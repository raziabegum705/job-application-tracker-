import { motion } from "framer-motion";
import { Send, FileSearch, Users, Trophy, XCircle } from "lucide-react";

const config = {
  Applied:   { color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 ring-blue-200 dark:ring-blue-500/20",     Icon: Send },
  OA:        { color: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 ring-violet-200 dark:ring-violet-500/20", Icon: FileSearch },
  Interview: { color: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 ring-orange-200 dark:ring-orange-500/20", Icon: Users },
  Offer:     { color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-500/20", Icon: Trophy },
  Rejected:  { color: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 ring-rose-200 dark:ring-rose-500/20",     Icon: XCircle },
};

export default function StatusBadge({ status, size = "sm" }) {
  const c = config[status] || config.Applied;
  const { Icon } = c;
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset shadow-soft ${pad} ${c.color}`}
    >
      <Icon size={size === "sm" ? 12 : 14} />
      {status}
    </motion.span>
  );
}
