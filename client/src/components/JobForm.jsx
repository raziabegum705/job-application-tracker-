import { motion } from "framer-motion";
import { Building2, Briefcase, MapPin, Link2, Wallet, Calendar, FileText, Tag } from "lucide-react";

const STATUSES = ["Applied", "OA", "Interview", "Offer", "Rejected"];
const SOURCES  = ["LinkedIn", "Naukri", "Company Website", "Referral", "Other"];

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted mb-1.5">
        {Icon && <Icon size={13} />} {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full border border-line dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none focus:border-brand-500 transition-colors placeholder:text-slate-400";

export default function JobForm({ form, setForm, onSubmit, loading, btnText }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Section: Basic Info */}
      <section>
        <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-4 flex items-center gap-2">
          <Building2 size={15} className="text-brand-600" /> Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field icon={Building2} label="Company Name *">
            <input name="company" value={form.company} onChange={handleChange} required placeholder="e.g. Google, TCS" className={inputClass} />
          </Field>
          <Field icon={Briefcase} label="Role / Position *">
            <input name="role" value={form.role} onChange={handleChange} required placeholder="e.g. SWE Intern" className={inputClass} />
          </Field>
          <Field icon={MapPin} label="Location">
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bengaluru / Remote" className={inputClass} />
          </Field>
          <Field icon={Link2} label="Job URL">
            <input name="jobUrl" value={form.jobUrl} onChange={handleChange} placeholder="https://careers.google.com/..." className={inputClass} />
          </Field>
        </div>
      </section>

      {/* Section: Status & Tracking */}
      <section>
        <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-4 flex items-center gap-2">
          <Tag size={15} className="text-brand-600" /> Status & Tracking
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field icon={Tag} label="Status *">
            <select name="status" value={form.status} onChange={handleChange} className={inputClass + " cursor-pointer"}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field icon={Tag} label="Source">
            <select name="source" value={form.source} onChange={handleChange} className={inputClass + " cursor-pointer"}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field icon={Calendar} label="Applied Date">
            <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} className={inputClass} />
          </Field>
          <Field icon={Calendar} label="Interview Date (optional)">
            <input type="date" name="interviewDate" value={form.interviewDate} onChange={handleChange} className={inputClass} />
          </Field>
        </div>
      </section>

      {/* Section: Additional Details */}
      <section>
        <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-4 flex items-center gap-2">
          <FileText size={15} className="text-brand-600" /> Additional Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field icon={Wallet} label="Salary / Stipend">
            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹6 LPA" className={inputClass} />
          </Field>
        </div>
        <Field icon={FileText} label="Notes">
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={4}
            placeholder="HR contact, interview feedback, next steps..." className={inputClass + " resize-none"} />
        </Field>
      </section>

      {/* Sticky submit */}
      <div className="sticky bottom-0 left-0 -mx-6 sm:-mx-8 px-6 sm:px-8 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-line dark:border-slate-800">
        <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors disabled:opacity-60 shadow-glow">
          {loading ? "Saving..." : btnText}
        </motion.button>
      </div>
    </form>
  );
}
