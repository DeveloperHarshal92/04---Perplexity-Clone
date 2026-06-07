import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";

const OrchardLogo = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22C12 22 4 16 4 9C4 5 7 2 12 2C17 2 20 5 20 9C20 16 12 22 12 22Z" />
    <path d="M12 22V12" />
    <path d="M12 16C9 14 8 11 8 11" />
  </svg>
);

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [strength, setStrength] = useState(0);

  const reqs = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    uppercase: /[A-Z]/.test(formData.password),
  };

  useEffect(() => {
    let score = 0;
    if (reqs.length) score += 1;
    if (reqs.number) score += 1;
    if (reqs.special) score += 1;
    if (reqs.uppercase) score += 1;
    setStrength(score);
  }, [formData.password]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  const fields = [
    {
      key: "username",
      label: "Username",
      type: "text",
      placeholder: "Choose a username",
      icon: User,
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "you@example.com",
      icon: Mail,
    },
    {
      key: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Create a strong password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Lora', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div
        className="font-sans min-h-screen flex items-center justify-center overflow-hidden relative dark"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 flex justify-center">
          <div
            className="absolute top-[-10%] w-[600px] h-[400px] rounded-full blur-[100px] opacity-20"
            style={{ background: "radial-gradient(ellipse at top, var(--accent), transparent 70%)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 w-full max-w-md mx-4 my-8"
        >
          <div
            className="rounded-2xl p-8"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <OrchardLogo size={28} className="text-[var(--accent)]" />
              <span className="font-serif font-medium text-[var(--text-primary)] text-xl tracking-tight">
                Orchard AI
              </span>
            </div>

            <h1 className="font-serif text-3xl font-medium text-[var(--text-primary)] mb-2">
              Create account
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 font-sans">
              Join and start exploring knowledge
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 font-mono uppercase tracking-wider">
                      {field.label}
                    </label>
                    <div
                      className="relative flex items-center rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid transparent",
                        outline: focusedField === field.key ? "2px solid var(--accent)" : "none",
                        outlineOffset: "2px",
                      }}
                    >
                      <Icon size={16} className="absolute left-4 text-[var(--text-tertiary)] pointer-events-none" />
                      <input
                        type={field.type}
                        name={field.key}
                        placeholder={field.placeholder}
                        value={formData[field.key]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.key)}
                        onBlur={() => setFocusedField(null)}
                        aria-label={field.label}
                        className="w-full bg-transparent pl-11 pr-12 py-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none"
                      />
                      {field.isPassword && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-4 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Password strength and requirements */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3 pt-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            strength >= level
                              ? "var(--accent)"
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      {reqs.length ? <Check size={12} className="text-[var(--accent)]" /> : <X size={12} className="text-[var(--text-tertiary)]" />}
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {reqs.uppercase ? <Check size={12} className="text-[var(--accent)]" /> : <X size={12} className="text-[var(--text-tertiary)]" />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {reqs.number ? <Check size={12} className="text-[var(--accent)]" /> : <X size={12} className="text-[var(--text-tertiary)]" />}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {reqs.special ? <Check size={12} className="text-[var(--accent)]" /> : <X size={12} className="text-[var(--text-tertiary)]" />}
                      <span>Special character</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "var(--accent)",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 14px var(--accent-glow)",
                }}
              >
                Create Account
                <ArrowRight size={16} />
              </motion.button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: "1px solid var(--border)" }} />
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] text-center font-sans">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--accent)] hover:underline underline-offset-4 transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}