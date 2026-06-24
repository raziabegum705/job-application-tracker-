import { motion } from "framer-motion";
import { BarChart3, CalendarClock, Target, TrendingUp, Briefcase } from "lucide-react";

const features = [
  { icon: BarChart3,     title: "Dashboard Analytics",   desc: "Visualize your job search funnel at a glance" },
  { icon: CalendarClock, title: "Interview Timeline",    desc: "Never miss a follow-up or interview date" },
  { icon: Target,        title: "Smart Job Management",  desc: "Track every application from applied to offer" },
  { icon: TrendingUp,    title: "Career Insights",       desc: "Understand patterns in your job search" },
];

export default function AuthSidePanel() {
  return (
    <div className="hidden lg:flex flex-col w-1/2 bg-ink dark:bg-slate-950 relative overflow-hidden px-12 py-14">
      {/* Decorative glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5 mb-16">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-glow">
            <Briefcase size={18} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">JobTracker</span>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-4xl font-extrabold text-white leading-[1.15] tracking-tight">
            Track Every Opportunity.<br />
            <span className="text-brand-400">Land Your Dream Job.</span>
          </h1>
          <p className="text-slate-400 mt-5 text-base leading-relaxed max-w-md">
            A modern SaaS application for tracking job applications, interviews, offers, and career progress through a clean analytics dashboard.
          </p>
        </motion.div>

        {/* Feature cards — explicit translucent styling so text always stays readable,
            regardless of the app's light/dark theme (this panel is always on a dark background) */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="bg-white/[0.07] hover:bg-white/[0.1] backdrop-blur-sm rounded-2xl p-4 border border-white/15 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center mb-2.5">
                <f.icon size={16} className="text-brand-400" />
              </div>
              <p className="text-white text-sm font-semibold">{f.title}</p>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12">
          <p className="text-slate-500 text-xs tracking-wide">
            Designed & Developed for Job Seekers
          </p>
        </div>
      </div>
    </div>
  );
}
