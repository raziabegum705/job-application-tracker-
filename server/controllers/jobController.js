const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { user: req.user._id };
    if (status && status !== "All") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
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
    const job = await Job.create({ ...req.body, user: req.user._id });
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
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const jobs = await Job.find({ user: req.user._id });
    const stats = { total: jobs.length, Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 };
    jobs.forEach((j) => {
      if (stats[j.status] !== undefined) stats[j.status]++;
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getStats };
