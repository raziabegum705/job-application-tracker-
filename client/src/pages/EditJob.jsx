import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { ArrowLeft } from "lucide-react";
import JobForm from "../components/JobForm";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [originalStatus, setOriginalStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/jobs/${id}`);
        setOriginalStatus(data.status);
        setForm({
          company: data.company || "", role: data.role || "", location: data.location || "",
          status: data.status || "Applied", source: data.source || "LinkedIn",
          salary: data.salary || "", jobUrl: data.jobUrl || "", notes: data.notes || "",
          appliedDate: data.appliedDate ? data.appliedDate.split("T")[0] : "",
          interviewDate: data.interviewDate ? data.interviewDate.split("T")[0] : "",
        });
      } catch {
        toast.error("Failed to load job details");
        navigate("/jobs");
      }
    };
    fetch();
  }, [id]);

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
        <JobForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} btnText="Update Application" />
      </motion.div>
    </div>
  );
}
