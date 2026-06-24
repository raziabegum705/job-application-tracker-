import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase, ArrowRight, LayoutDashboard, ListChecks, Plus,
  Send, Users, Trophy, Sparkles, CheckCircle2, BarChart3, Bell,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import CompanyLogo from "../components/CompanyLogo";

const navLinks = [
  { href: "#dashboard",    label: "Dashboard" },
  { href: "#applications", label: "Applications" },
  { href: "#add-new",      label: "+ Add New" },
];

const pipelineSteps = [
  { label: "Applied",   icon: Send,    color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10" },
  { label: "Interview", icon: Users,   color: "bg-orange-50 text-orange-600 dark:bg-orange-500/10" },
  { label: "Offer",     icon: Trophy,  color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" },
];

const features = [
  {
    id: "add-new",
    icon: Plus,
    title: "Add New Applications in Seconds",
    desc: "Log the company, role, location, and source the moment you hit apply — no spreadsheet required.",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "One Dashboard, Full Visibility",
    desc: "See your entire pipeline at a glance — totals, funnel, and monthly trends, all animated and live.",
  },
  {
    id: "applications",
    icon: ListChecks,
    title: "Organize Every Application",
    desc: "Search, sort, and filter by status. Know exactly where every opportunity stands, instantly.",
  },
  {
    id: "insights",
    icon: BarChart3,
    title: "Status & Source Insights",
    desc: "Understand which platforms and stages are working for you with built-in analytics.",
  },
];

const mockJobs = [
  { company: "Google",    role: "SWE Intern",        status: "Interview" },
  { company: "Microsoft", role: "Backend Engineer",  status: "Applied" },
  { company: "Stripe",    role: "Frontend Engineer", status: "Offer" },
];

function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="bg-white dark:bg-slate-950 text-ink dark:text-slate-100">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-30 glass border-b border-line dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-glow">
              <Briefcase size={16} />
            </div>
            <span className="font-bold tracking-tight text-lg">Job Tracker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 rounded-full p-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-muted hover:text-ink dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-medium text-muted hover:text-ink dark:hover:text-slate-200 px-3 py-2 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-glow transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-14 items-center">
        <FadeIn>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-full mb-6">
            <Sparkles size={13} /> Job Search CRM
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold leading-[1.05] tracking-tight">
            Track Every Job.
          </h1>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-600 leading-tight tracking-tight mt-1">
            Never Lose Track Again.
          </h2>
          <p className="text-lg text-muted mt-6 leading-relaxed max-w-lg">
            Applied to 15 companies and lost track of half of them? Know exactly where
            you stand — application status, next round, and interview data, all in one place.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-9">
            <Link to="/register" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl text-base shadow-glow transition-colors">
              Get Started — It's Free <ArrowRight size={17} />
            </Link>
            <a href="#how-it-works" className="text-base font-medium text-ink dark:text-slate-200 hover:text-brand-600 transition-colors">
              See how it works →
            </a>
          </div>

          <div className="flex items-center gap-2 mt-7 text-sm text-muted">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Free forever · No credit card required
          </div>
        </FadeIn>

        {/* Hero product mockup */}
        <FadeIn delay={0.15} className="relative">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-line dark:border-slate-800 p-5 max-w-md mx-auto"
          >
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted ml-2 font-medium">My Applications</span>
            </div>
            <div className="space-y-2">
              {mockJobs.map((j) => (
                <div key={j.company} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <CompanyLogo company={j.company} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{j.role}</p>
                    <p className="text-xs text-muted truncate">{j.company}</p>
                  </div>
                  <StatusBadge status={j.status} />
                </div>
              ))}
            </div>
            <button className="w-full mt-3 border-2 border-dashed border-line dark:border-slate-700 rounded-xl py-2.5 text-sm font-medium text-muted hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-1.5">
              <Plus size={15} /> Add New Application
            </button>
          </motion.div>

          {/* Floating offer badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="absolute -top-5 -right-3 sm:right-2 bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-card rounded-xl px-3.5 py-2.5 flex items-center gap-2"
          >
            <span className="text-lg">🎉</span>
            <div>
              <p className="text-xs font-semibold leading-none">Offer Received!</p>
              <p className="text-[11px] text-muted leading-none mt-0.5">Stripe · Frontend Engineer</p>
            </div>
          </motion.div>

          {/* Floating reminder badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-5 -left-3 sm:left-2 bg-white dark:bg-slate-900 border border-line dark:border-slate-800 shadow-card rounded-xl px-3.5 py-2.5 flex items-center gap-2"
          >
            <Bell size={14} className="text-brand-600" />
            <p className="text-xs font-medium">Interview tomorrow · Google</p>
          </motion.div>
        </FadeIn>
      </section>

      {/* ===== STATUS PIPELINE / HOW IT WORKS ===== */}
      <section id="how-it-works" className="bg-slate-50 dark:bg-slate-900/40 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">Status Tracking</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">From Applied to Offer — Track It All</h2>
            <p className="text-muted mt-3 max-w-xl mx-auto">
              Every application moves through a clear pipeline, so you always know what's next.
            </p>
          </FadeIn>

          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-12 flex-wrap">
            {pipelineSteps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 sm:gap-6">
                <FadeIn delay={i * 0.12}>
                  <div className="bg-white dark:bg-slate-900 border border-line dark:border-slate-800 rounded-2xl shadow-soft p-6 w-36 sm:w-44">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 ${s.color}`}>
                      <s.icon size={20} />
                    </div>
                    <p className="font-semibold text-sm">{s.label}</p>
                  </div>
                </FadeIn>
                {i < pipelineSteps.length - 1 && (
                  <ArrowRight size={22} className="text-slate-300 dark:text-slate-700 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">Built For Job Seekers</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need, Nothing You Don't</h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08} className="bg-white dark:bg-slate-900 border border-line dark:border-slate-800 rounded-2xl p-6 hover:shadow-card transition-shadow" >
              <div id={f.id} className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center mb-4">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-base mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== APPLICATIONS PREVIEW (anchor target) ===== */}
      <section id="applications-anchor" className="hidden" aria-hidden="true" />

      {/* ===== FINAL CTA ===== */}
      <section className="bg-ink dark:bg-slate-900 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start Tracking Your Job Search Today
            </h2>
            <p className="text-slate-400 mt-3 max-w-md mx-auto">
              Free forever. No credit card. Just a clean, organized way to land your next role.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl text-base shadow-glow transition-colors mt-8">
              Get Started — It's Free <ArrowRight size={17} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-line dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
              <Briefcase size={12} />
            </div>
            <span className="text-sm font-semibold">Job Tracker</span>
          </div>
          <p className="text-xs text-muted">© {new Date().getFullYear()} Job Tracker. Built with the MERN stack.</p>
        </div>
      </footer>
    </div>
  );
}
