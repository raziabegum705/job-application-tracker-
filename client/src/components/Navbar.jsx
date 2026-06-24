import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Briefcase, Plus, Sun, Moon, LogOut, ChevronDown, Search, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const links = [
    { to: "/",     label: "Dashboard",    icon: LayoutDashboard },
    { to: "/jobs", label: "Applications", icon: Briefcase },
    { to: "/add",  label: "Add New",      icon: Plus },
  ];

  const initials = user?.name?.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-30 glass border-b border-line dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Briefcase size={16} />
            </div>
            <span className="font-bold text-ink dark:text-white tracking-tight">JobTracker</span>
          </Link>

          {/* Nav Links — desktop */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 rounded-full p-1">
            {links.map(l => {
              const active = location.pathname === l.to;
              return (
                <Link key={l.to} to={l.to} className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5">
                  {active && (
                    <motion.div layoutId="navpill" className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-soft" transition={{ type: "spring", duration: 0.4 }} />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${active ? "text-brand-600 dark:text-brand-500" : "text-muted hover:text-ink dark:hover:text-slate-200"}`}>
                    <l.icon size={14} /> {l.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Spotlight hint */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
              className="hidden sm:flex items-center gap-2 text-xs text-muted bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Search size={13} /> Search <kbd className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-line dark:border-slate-700 text-[10px]">⌘K</kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink dark:hover:text-slate-200 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(o => !o)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-white text-xs font-semibold flex items-center justify-center">
                  {initials}
                </div>
                <ChevronDown size={14} className={`text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-card border border-line dark:border-slate-800 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-line dark:border-slate-800">
                      <p className="text-sm font-semibold text-ink dark:text-slate-100 truncate">{user?.name}</p>
                      <p className="text-xs text-muted truncate">{user?.email}</p>
                    </div>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <User size={15} /> View Profile
                    </button>
                    <button
                      onClick={() => { logout(); toast.success("Logged out successfully!"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${active ? "bg-brand-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-muted"}`}>
                <l.icon size={13} /> {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
