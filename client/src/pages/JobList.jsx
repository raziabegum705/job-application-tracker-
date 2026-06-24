import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, MoreVertical, Pencil, Trash2, ExternalLink,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Briefcase,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import CompanyLogo from "../components/CompanyLogo";
import EmptyState from "../components/EmptyState";
import { SkeletonRow } from "../components/Skeleton";

const STATUSES = ["All", "Applied", "OA", "Interview", "Offer", "Rejected"];
const PAGE_SIZE = 8;

function ActionMenu({ job, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted transition-colors">
        <MoreVertical size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-card border border-line dark:border-slate-800 overflow-hidden z-20"
          >
            <Link to={`/edit/${job._id}`} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Pencil size={14} /> Edit
            </Link>
            {job.jobUrl && (
              <a href={job.jobUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <ExternalLink size={14} /> View Posting
              </a>
            )}
            <button onClick={() => { setOpen(false); onDelete(job._id); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JobList() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage]       = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.status = filter;
      if (search) params.search = search;
      const { data } = await axios.get("/api/jobs", { params });
      setJobs(data);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { const t = setTimeout(fetchJobs, 300); return () => clearTimeout(t); }, [filter, search]);
  useEffect(() => { setPage(1); }, [filter, search]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    const arr = [...jobs];
    arr.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "appliedDate" || sortKey === "createdAt") { va = new Date(va); vb = new Date(vb); }
      else { va = (va || "").toString().toLowerCase(); vb = (vb || "").toString().toLowerCase(); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [jobs, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application? This can't be undone.")) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      toast.success("Application deleted");
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="w-3 inline-block" />;
    return sortDir === "asc" ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white tracking-tight">Applications</h1>
          <p className="text-muted text-sm mt-1">{jobs.length} total application{jobs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/add" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-glow transition-colors">
          <Plus size={16} /> Add Application
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            placeholder="Search by company or role..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-line dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === s ? "bg-brand-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-muted hover:text-ink dark:hover:text-slate-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 overflow-hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={26} />}
            title="No applications found"
            description={search || filter !== "All" ? "Try adjusting your search or filters." : "Add your first job application to get started."}
            action={<Link to="/add" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl"><Plus size={16}/> Add Application</Link>}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/60 text-muted text-xs uppercase tracking-wide">
                  <tr>
                    <th onClick={() => handleSort("company")} className="px-5 py-3.5 text-left font-medium cursor-pointer select-none">Company <SortIcon col="company" /></th>
                    <th onClick={() => handleSort("role")}    className="px-5 py-3.5 text-left font-medium cursor-pointer select-none">Role <SortIcon col="role" /></th>
                    <th className="px-5 py-3.5 text-left font-medium">Location</th>
                    <th onClick={() => handleSort("status")} className="px-5 py-3.5 text-left font-medium cursor-pointer select-none">Status <SortIcon col="status" /></th>
                    <th onClick={() => handleSort("appliedDate")} className="px-5 py-3.5 text-left font-medium cursor-pointer select-none">Applied <SortIcon col="appliedDate" /></th>
                    <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-slate-800">
                  {paginated.map((job) => (
                    <motion.tr key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <CompanyLogo company={job.company} size={32} />
                          <span className="font-medium text-ink dark:text-slate-200">{job.company}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-ink dark:text-slate-300">{job.role}</td>
                      <td className="px-5 py-3.5 text-muted">{job.location}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={job.status} /></td>
                      <td className="px-5 py-3.5 text-muted">{new Date(job.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                      <td className="px-5 py-3.5 text-right"><ActionMenu job={job} onDelete={handleDelete} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-line dark:divide-slate-800">
              {paginated.map((job) => (
                <motion.div key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
                  <div className="flex items-start gap-3">
                    <CompanyLogo company={job.company} size={38} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm text-ink dark:text-slate-200">{job.role}</p>
                          <p className="text-xs text-muted">{job.company} · {job.location}</p>
                        </div>
                        <ActionMenu job={job} onDelete={handleDelete} />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <StatusBadge status={job.status} />
                        <span className="text-xs text-muted">{new Date(job.appliedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-line dark:border-slate-800">
                <p className="text-xs text-muted">Page {page} of {totalPages}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-line dark:border-slate-700 text-muted disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-line dark:border-slate-700 text-muted disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
