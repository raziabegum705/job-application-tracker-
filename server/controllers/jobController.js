const Job = require("../models/Job");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SORTABLE = ["company", "role", "status", "appliedDate", "createdAt"];

const getJobs = async (req, res) => {
  try {
    const { status, search, page, limit, sortBy, sortDir } = req.query;
    const query = { user: req.user._id };
    if (status && status !== "All") query.status = status;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { company: { $regex: safe, $options: "i" } },
        { role: { $regex: safe, $options: "i" } },
      ];
    }

    if (page) {
      const p = Math.max(parseInt(page) || 1, 1);
      const l = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
      const field = SORTABLE.includes(sortBy) ? sortBy : "createdAt";
      const dir = sortDir === "asc" ? 1 : -1;
      const [jobs, total] = await Promise.all([
        Job.find(query)
          .sort({ [field]: dir, _id: -1 })
          .collation({ locale: "en", strength: 2 })
          .skip((p - 1) * l)
          .limit(l),
        Job.countDocuments(query),
      ]);
      return res.json({ jobs, total, page: p, pages: Math.ceil(total / l) });
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this job" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { user, _id, statusHistory, statusDate, ...body } = req.body;
    const status = body.status || "Applied";
    const job = await Job.create({
      ...body,
      user: req.user._id,
      statusHistory: [{ status, date: body.appliedDate || new Date() }],
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }
    const { user, _id, statusHistory, statusDate, ...safe } = req.body;
    const when = statusDate ? new Date(statusDate) : new Date();

    let history = (job.statusHistory || []).map((h) => ({ status: h.status, date: h.date }));
    if (history.length === 0) {
      // old jobs without history
      history.push({ status: "Applied", date: job.appliedDate || job.createdAt });
      if (job.status !== "Applied") history.push({ status: job.status, date: job.updatedAt });
    }
    if (safe.status && safe.status !== job.status) {
      history.push({ status: safe.status, date: when });
    } else if (statusDate) {
      history[history.length - 1].date = when; // correct the date of current status
    }
    if (history[0].status === "Applied" && safe.appliedDate) {
      history[0].date = new Date(safe.appliedDate);
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { ...safe, statusHistory: history },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    start.setMonth(start.getMonth() - 5);

    const [byStatus, bySource, byMonth, recent] = await Promise.all([
      Job.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: { user: req.user._id, appliedDate: { $gte: start } } },
        {
          $group: {
            _id: { y: { $year: "$appliedDate" }, m: { $month: "$appliedDate" } },
            count: { $sum: 1 },
          },
        },
      ]),
      Job.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5),
    ]);

    const stats = { total: 0, Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 };
    byStatus.forEach((r) => {
      if (stats[r._id] !== undefined) stats[r._id] = r.count;
      stats.total += r.count;
    });

    stats.sources = bySource.map((r) => ({ name: r._id || "Other", value: r.count }));

    stats.monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const hit = byMonth.find((r) => r._id.y === d.getFullYear() && r._id.m === d.getMonth() + 1);
      stats.monthly.push({
        month: d.toLocaleString("en-US", { month: "short" }),
        applications: hit ? hit.count : 0,
      });
    }

    stats.recent = recent;
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getStats };