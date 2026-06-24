import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, Briefcase, Plus, LayoutDashboard } from "lucide-react";
import axios from "axios";
import CompanyLogo from "./CompanyLogo";

export default function SpotlightSearch() {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const [jobs, setJobs]   = useState([]);
  const navigate = useNavigate();

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const delay = setTimeout(() => {
      axios.get("/api/jobs", { params: { search: query } })
        .then(r => setJobs(r.data.slice(0, 6)))
        .catch(() => setJobs([]));
    }, 200);
    return () => clearTimeout(delay);
  }, [query, open]);

  const quickActions = [
    { label: "Go to Dashboard",  icon: LayoutDashboard, action: () => navigate("/") },
    { label: "View All Applications", icon: Briefcase, action: () => navigate("/jobs") },
    { label: "Add New Application",   icon: Plus,      action: () => navigate("/add") },
  ];

  const go = (path) => { navigate(path); setOpen(false); setQuery(""); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-line dark:border-slate-700 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line dark:border-slate-800">
              <Search size={18} className="text-muted flex-shrink-0" />
              <input
                autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search companies, roles, or jump to a page..."
                className="flex-1 bg-transparent outline-none text-sm text-ink dark:text-slate-100 placeholder:text-muted"
              />
              <kbd className="text-[10px] bg-slate-100 dark:bg-slate-800 text-muted px-1.5 py-0.5 rounded">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {!query && (
                <div className="px-2">
                  <p className="px-2 py-1 text-xs font-medium text-muted uppercase tracking-wide">Quick Actions</p>
                  {quickActions.map(a => (
                    <button key={a.label} onClick={() => { a.action(); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-ink dark:text-slate-200 transition-colors">
                      <a.icon size={16} className="text-muted" />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {query && jobs.length > 0 && (
                <div className="px-2">
                  <p className="px-2 py-1 text-xs font-medium text-muted uppercase tracking-wide">Applications</p>
                  {jobs.map(j => (
                    <button key={j._id} onClick={() => go("/jobs")}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                      <CompanyLogo company={j.company} size={28} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink dark:text-slate-200 truncate">{j.role}</p>
                        <p className="text-xs text-muted truncate">{j.company}</p>
                      </div>
                      <CornerDownLeft size={14} className="text-muted flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {query && jobs.length === 0 && (
                <p className="text-center text-sm text-muted py-8">No results for "{query}"</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
