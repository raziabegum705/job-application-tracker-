import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, FunnelChart, Funnel, LabelList,
} from "recharts";
import { Send, FileSearch, Users, Trophy, XCircle, Plus, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import CompanyLogo from "../components/CompanyLogo";
import EmptyState from "../components/EmptyState";
import { SkeletonCard, SkeletonChart, SkeletonRow } from "../components/Skeleton";


const STATUS_COLORS = { Applied: "#3b82f6", OA: "#8b5cf6", Interview: "#f97316", Offer: "#10b981", Rejected: "#f43f5e" };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get("/api/jobs/stats"),
          api.get("/api/jobs"),
        ]);
        setStats(statsRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const motivational = [
    "Every application is one step closer to your offer.",
    "Consistency beats intensity. Keep applying!",
    "Your dream company is one application away.",
  ][new Date().getDate() % 3];

  // Pie data — status distribution
  const pieData = stats ? ["Applied","OA","Interview","Offer","Rejected"].map(s => ({ name: s, value: stats[s] || 0 })).filter(d => d.value > 0) : [];

  // Funnel data
  const funnelData = stats ? [
    { name: "Applied",   value: stats.total || 0,    fill: "#3b82f6" },
    { name: "OA",        value: (stats.OA||0)+(stats.Interview||0)+(stats.Offer||0), fill: "#8b5cf6" },
    { name: "Interview", value: (stats.Interview||0)+(stats.Offer||0), fill: "#f97316" },
    { name: "Offer",     value: stats.Offer || 0,    fill: "#10b981" },
  ] : [];

  // Monthly applications — derived from jobs[]
  const monthlyData = (() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString("default", { month: "short" });
      const count = jobs.filter(j => {
        const jd = new Date(j.appliedDate || j.createdAt);
        return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear();
      }).length;
      months.push({ month: label, applications: count });
    }
    return months;
  })();

  // Source breakdown
  const sourceData = (() => {
    const map = {};
    jobs.forEach(j => { map[j.source || "Other"] = (map[j.source || "Other"] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const recent = jobs.slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <SkeletonChart /><SkeletonChart />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink dark:text-white tracking-tight">
            {greeting}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted text-sm mt-1.5 flex items-center gap-1.5">
            <Sparkles size={14} className="text-brand-500" /> {motivational}
          </p>
        </div>
        <Link to="/add" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-glow transition-colors">
          <Plus size={16} /> Add Application
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Applied" value={stats?.total || 0} icon={Send} accent="text-brand-600" />
        <StatCard label="Online Assessment" value={stats?.OA || 0} icon={FileSearch} accent="text-violet-600" />
        <StatCard label="Interviews" value={stats?.Interview || 0} icon={Users} accent="text-orange-600" />
        <StatCard label="Offers" value={stats?.Offer || 0} icon={Trophy} accent="text-emerald-600" />
        <StatCard label="Rejected" value={stats?.Rejected || 0} icon={XCircle} accent="text-rose-600" />
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800">
          <EmptyState
            title="No applications yet"
            description="Start tracking your job search by adding your first application."
            action={<Link to="/add" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl"><Plus size={16}/> Add Your First Job</Link>}
          />
        </div>
      ) : (
        <>
          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Funnel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6">
              <h2 className="font-semibold text-ink dark:text-slate-100 mb-1">Application Funnel</h2>
              <p className="text-xs text-muted mb-4">Your progress through each stage</p>
              <ResponsiveContainer width="100%" height={240}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList position="right" dataKey="name" fill="#64748B" stroke="none" fontSize={12} />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            {/* Status Pie */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6">
              <h2 className="font-semibold text-ink dark:text-slate-100 mb-1">Status Distribution</h2>
              <p className="text-xs text-muted mb-4">Breakdown of all applications</p>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {pieData.map((d, i) => <Cell key={i} fill={STATUS_COLORS[d.name]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted text-center py-16">No data yet</p>}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6">
              <h2 className="font-semibold text-ink dark:text-slate-100 mb-1">Monthly Applications</h2>
              <p className="text-xs text-muted mb-4">Last 6 months</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#2563EB" radius={[6,6,0,0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Source Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6">
              <h2 className="font-semibold text-ink dark:text-slate-100 mb-1">Applications by Source</h2>
              <p className="text-xs text-muted mb-4">Where you're applying from</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sourceData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0,6,6,0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-slate-800">
              <h2 className="font-semibold text-ink dark:text-slate-100">Recent Applications</h2>
              <Link to="/jobs" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-line dark:divide-slate-800">
              {recent.map((job, i) => (
                <motion.div key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <CompanyLogo company={job.company} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink dark:text-slate-200 truncate">{job.role}</p>
                    <p className="text-xs text-muted truncate">{job.company} · {job.location}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
