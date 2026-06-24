import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import JobForm from "../components/JobForm";

const defaultForm = {
  company: "", role: "", location: "", status: "Applied",
  source: "LinkedIn", salary: "", jobUrl: "", notes: "",
  appliedDate: new Date().toISOString().split("T")[0],
  interviewDate: "",
};

export default function AddJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/jobs", form);
      toast.success("Application added successfully!");
      navigate("/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink dark:hover:text-slate-200 mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to Applications
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-line dark:border-slate-800 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-ink dark:text-white mb-1">Add Application</h1>
        <p className="text-sm text-muted mb-6">Track a new job you've applied to</p>
        <JobForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} btnText="Add Application" />
      </motion.div>
    </div>
  );
}
