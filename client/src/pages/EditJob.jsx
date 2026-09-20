import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { ArrowLeft } from "lucide-react";
import JobForm from "../components/JobForm";

const today = () => new Date().toISOString().split("T")[0];
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "date not recorded";

function StatusTimeline({ history }) {
  return (
    <div className="mb-6 rounded-xl border border-line dark:border-slate-800 p-4">
      <p className="text-xs font-medium text-muted mb-3">Status timeline</p>
      <ol className="space-y-3">
        {history.map((h, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${i === history.length - 1 ? "bg-brand-600" : "bg-slate-400"}`} />
            <span className="font-medium text-ink dark:text-slate-200">{h.status}</span>
            <span className="text-muted">{fmt(h.date)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [originalStatus, setOriginalStatus] = useState(null);
  const [originalDate, setOriginalDate] = useState(today());
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/jobs/${id}`);
        const hist =
          data.statusHistory && data.statusHistory.length
            ? data.statusHistory
            : [
                { status: "Applied", date: data.appliedDate },
                ...(data.status !== "Applied" ? [{ status: data.status, date: data.updatedAt }] : []),
              ];
        const last = hist[hist.length - 1].date;
        const lastDate = last ? last.split("T")[0] : today();
        setHistory(hist);
        setOriginalStatus(data.status);
        setOriginalDate(lastDate);
        setForm({
          company: data.company || "", role: data.role || "", location: data.location || "",
          status: data.status || "Applied", source: data.source || "LinkedIn",
          salary: data.salary || "", jobUrl: data.jobUrl || "", notes: data.notes || "",
          appliedDate: data.appliedDate ? data.appliedDate.split("T")[0] : "",
          interviewDate: data.interviewDate ? data.interviewDate.split("T")[0] : "",
          statusDate: lastDate,
        });
      } catch {
        toast.error("Failed to load job details");
        navigate("/jobs");
      }
    };
    fetch();
  }, [id]);

  const handleFormChange = (f) => {
    if (f.status !== form.status) {
      f = { ...f, statusDate: f.status === originalStatus ? originalDate : today() };
    }
    setForm(f);
  };

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ["#2563EB", "#10b981", "#f59e0b", "#8b5cf6"] });
    setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 }, angle: 60 }), 200);
    setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 }, angle: 120 }), 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/jobs/${id}`, form);
      const becameOffer = form.status === "Offer" && originalStatus !== "Offer";
      if (becameOffer) {
        toast.success("🎉 Congratulations on your Offer!");
        fireConfetti();
        setTimeout(() => navigate("/jobs"), 900);
      } else {
        toast.success("Application updated!");
        navigate("/jobs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted text-sm">Loading job details...</div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink dark:hover:text-slate-200 mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Applications
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-ink dark:text-white mb-1">Edit Application</h1>
        <p className="text-sm text-muted mb-6">Update your application details or status</p>
        <StatusTimeline history={history} />
        <JobForm form={form} setForm={handleFormChange} onSubmit={handleSubmit} loading={loading}
          btnText="Update Application" showStatusDate />
      </motion.div>
    </div>
  );
}