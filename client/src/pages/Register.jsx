import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthSidePanel from "../components/AuthSidePanel";

const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 4);
};
const strengthMeta = [
  { label: "Very Weak", color: "bg-rose-500" },
  { label: "Weak",      color: "bg-orange-500" },
  { label: "Fair",      color: "bg-amber-500" },
  { label: "Strong",    color: "bg-emerald-500" },
  { label: "Excellent", color: "bg-emerald-600" },
];

export default function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [success, setSuccess]             = useState(false);
  const [errors, setErrors]               = useState({});

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "At least 6 characters required";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", { name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      toast.success(`Account created! Welcome, ${data.name}!`);
      setTimeout(() => login(data), 900);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950">
      <AuthSidePanel />
<div className="relative flex-1 overflow-hidden flex items-center justify-center px-6 sm:px-10 py-12 bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100">

  {/* Background Mesh */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.25),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.25),transparent_35%),radial-gradient(circle_at_25%_80%,rgba(56,189,248,0.20),transparent_30%)]"></div>

  {/* Top Right Glow */}
  <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-blue-400/30 blur-[140px]"></div>

  {/* Bottom Left Glow */}
  <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-cyan-300/30 blur-[140px]"></div>

  {/* Center Glow */}
  <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl"></div>

  {/* Grid */}
  <div
    className="absolute inset-0 opacity-[0.08]"
    style={{
      backgroundImage: `
      linear-gradient(rgba(37,99,235,.25) 1px, transparent 1px),
      linear-gradient(90deg, rgba(37,99,235,.25) 1px, transparent 1px)
    `,
      backgroundSize: "45px 45px",
    }}
  />

  {/* Rings */}
  <div className="absolute top-12 right-10 h-72 w-72 rounded-full border border-blue-300/30"></div>

  <div className="absolute bottom-8 left-8 h-96 w-96 rounded-full border border-sky-300/20"></div>
     
        <motion.div className="
relative z-10
w-full max-w-md
rounded-[32px]
bg-white/80
backdrop-blur-2xl

border-2 border-blue-200/80
ring-1 ring-white/70

shadow-[0_20px_60px_rgba(37,99,235,0.18)]

p-9

transition-all
duration-300
hover:border-blue-400
hover:shadow-[0_30px_80px_rgba(37,99,235,0.28)]
" >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-emerald-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-ink dark:text-white">You're all set!</h3>
                <p className="text-muted text-sm mt-2">Redirecting you to the dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-7">
                  <h2 className="text-2xl font-bold text-ink dark:text-white tracking-tight">Create your account</h2>
                  <p className="text-muted text-sm mt-1.5">Start tracking your job search journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Name */}
                  <div>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input name="name" id="name" value={form.name} onChange={handleChange} placeholder=" "
                        className={`w-full pl-10 pr-3 pt-4 pb-1.5 border rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none transition-colors peer
                          ${errors.name ? "border-rose-400" : "border-line dark:border-slate-700 focus:border-brand-500"}`} />
                      <label htmlFor="name" className="absolute left-10 top-3.5 text-sm text-muted transition-all duration-150 origin-left peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-brand-600 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:scale-75">Full Name</label>
                    </div>
                    {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input type="email" name="email" id="email-r" value={form.email} onChange={handleChange} placeholder=" "
                        className={`w-full pl-10 pr-3 pt-4 pb-1.5 border rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none transition-colors peer
                          ${errors.email ? "border-rose-400" : "border-line dark:border-slate-700 focus:border-brand-500"}`} />
                      <label htmlFor="email-r" className="absolute left-10 top-3.5 text-sm text-muted transition-all duration-150 origin-left peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-brand-600 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:scale-75">Email Address</label>
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1.5">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input type={showPassword ? "text" : "password"} name="password" id="password-r" value={form.password} onChange={handleChange} placeholder=" "
                        className={`w-full pl-10 pr-11 pt-4 pb-1.5 border rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none transition-colors peer
                          ${errors.password ? "border-rose-400" : "border-line dark:border-slate-700 focus:border-brand-500"}`} />
                      <label htmlFor="password-r" className="absolute left-10 top-3.5 text-sm text-muted transition-all duration-150 origin-left peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-brand-600 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:scale-75">Password</label>
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-slate-300">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-rose-500 mt-1.5">{errors.password}</p>}

                    {/* Strength meter */}
                    {form.password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0,1,2,3].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthMeta[strength].color : "bg-slate-100 dark:bg-slate-800"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted mt-1">{strengthMeta[strength].label}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input type={showConfirm ? "text" : "password"} name="confirmPassword" id="confirm-r" value={form.confirmPassword} onChange={handleChange} placeholder=" "
                        className={`w-full pl-10 pr-11 pt-4 pb-1.5 border rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none transition-colors peer
                          ${errors.confirmPassword ? "border-rose-400" : "border-line dark:border-slate-700 focus:border-brand-500"}`} />
                      <label htmlFor="confirm-r" className="absolute left-10 top-3.5 text-sm text-muted transition-all duration-150 origin-left peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-brand-600 peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:scale-75">Confirm Password</label>
                      <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-slate-300">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1.5">{errors.confirmPassword}</p>}
                  </div>

                  <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-glow mt-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={15} /></>}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-muted mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
