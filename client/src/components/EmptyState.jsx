import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-slate-800 flex items-center justify-center mb-4 text-brand-600 dark:text-brand-500">
        {icon || <Inbox size={28} />}
      </div>
      <h3 className="font-semibold text-ink dark:text-slate-100 text-lg">{title}</h3>
      {description && <p className="text-sm text-muted dark:text-slate-400 mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
