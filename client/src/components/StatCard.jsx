import { motion } from "framer-motion";
import useCountUp from "../hooks/useCountUp";

export default function StatCard({ label, value, icon: Icon, accent = "text-brand-600", trend }) {
  const count = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-5 shadow-soft hover:shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${accent}`}>
          {Icon && <Icon size={18} />}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend.up ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"}`}>
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-ink dark:text-slate-50 tabular-nums">{count}</p>
      <p className="text-sm text-muted dark:text-slate-400 mt-0.5">{label}</p>
    </motion.div>
  );
}
