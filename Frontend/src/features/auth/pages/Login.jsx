import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();
    const payload = { email, password };
    await handleLogin(payload);
    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        .font-sans-dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div
        className="font-sans-dm min-h-screen flex items-center justify-center overflow-hidden relative"
        style={{ background: "#0D0F17" }}
      >
        {/* Background effects */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #F59E0B33, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle, #6366F133, transparent 70%)" }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(20,22,32,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(32px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-display font-medium text-white/80 text-lg tracking-tight">
                HybridMind
              </span>
            </div>

            <h1 className="font-display text-3xl font-medium text-white/90 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-white/35 mb-8 font-mono-dm">
              Sign in to continue your conversations
            </p>

            <form onSubmit={submitForm} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 font-mono-dm uppercase tracking-wider">
                  Email
                </label>
                <div
                  className="relative flex items-center rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focusedField === "email" ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focusedField === "email" ? "0 0 0 3px rgba(245,158,11,0.08)" : "none",
                  }}
                >
                  <Mail size={15} className="absolute left-4 text-white/25 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-white/85 placeholder-white/20 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 font-mono-dm uppercase tracking-wider">
                  Password
                </label>
                <div
                  className="relative flex items-center rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focusedField === "password" ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focusedField === "password" ? "0 0 0 3px rgba(245,158,11,0.08)" : "none",
                  }}
                >
                  <Lock size={15} className="absolute left-4 text-white/25 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent pl-11 pr-12 py-3.5 text-sm text-white/85 placeholder-white/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/25 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(245,158,11,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #EA580C)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.25)",
                }}
              >
                Sign In
                <ArrowRight size={15} />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />
              </div>
            </div>

            <p className="text-sm text-white/30 text-center font-mono-dm">
              No account?{" "}
              <Link
                to="/register"
                className="text-amber-400/80 hover:text-amber-400 transition-colors underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Bottom hint */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Zap size={11} className="text-amber-400/40" />
            <span className="text-xs text-white/15 font-mono-dm">
              Secured with JWT · Sessions last 7 days
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}