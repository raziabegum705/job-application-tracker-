import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthSidePanel from "../components/AuthSidePanel";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
        <motion.div
         className="
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
"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink tracking-tight">Welcome back</h2>
            <p className="text-muted text-sm mt-1.5">Sign in to continue tracking your applications</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email — floating label */}
            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email" name="email" id="email" value={form.email} onChange={handleChange}
                  placeholder=" " aria-invalid={!!errors.email}
                  className={`w-full pl-10 pr-3 pt-4 pb-1.5 border rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none transition-colors peer
                    ${errors.email ? "border-rose-400 focus:border-rose-500" : "border-line dark:border-slate-700 focus:border-brand-500"}`}
                />
                <label htmlFor="email" className="absolute left-10 top-3.5 text-sm text-muted transition-all duration-150 origin-left
                  peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-brand-600
                  peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:scale-75">
                  Email Address
                </label>
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1.5">{errors.email}</p>}
            </div>

            {/* Password — floating label + eye toggle */}
            <div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? "text" : "password"} name="password" id="password"
                  value={form.password} onChange={handleChange} placeholder=" " aria-invalid={!!errors.password}
                  className={`w-full pl-10 pr-11 pt-4 pb-1.5 border rounded-xl text-sm bg-white dark:bg-slate-900 text-ink dark:text-slate-100 outline-none transition-colors peer
                    ${errors.password ? "border-rose-400 focus:border-rose-500" : "border-line dark:border-slate-700 focus:border-brand-500"}`}
                />
                <label htmlFor="password" className="absolute left-10 top-3.5 text-sm text-muted transition-all duration-150 origin-left
                  peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-brand-600
                  peer-[&:not(:placeholder-shown)]:-translate-y-2 peer-[&:not(:placeholder-shown)]:scale-75">
                  Password
                </label>
                <button type="button" onClick={() => setShowPassword(s => !s)} aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-slate-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1.5">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={() => setRemember(r => !r)}
                  className="w-4 h-4 rounded border-line text-brand-600 focus:ring-brand-500" />
                Remember me
              </label>
              <button type="button" className="text-sm text-brand-600 font-medium hover:underline">Forgot password?</button>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-glow"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted mt-7">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
