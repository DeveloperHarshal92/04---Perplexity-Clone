import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PerplexityIcon = ({ size = 22, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2V22M12 12L20 4M12 12L4 4M12 12L20 20M12 12L4 20M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const loading = useSelector((state) => state.auth.loading);

  const reqs = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      await handleRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success(
        "Account created! Please check your email to verify before signing in.",
        { duration: 5000 },
      );
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-[#faf8f5] text-[#27251e] font-sans selection:bg-[#016a71]/15">
      {/* Background Ambience */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-30 blur-[130px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(1, 106, 113, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[440px]">
        <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-6 sm:p-8 card-subtle-shadow">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#27251e] text-[#faf8f5] flex items-center justify-center">
              <PerplexityIcon size={18} />
            </div>
            <span className="text-[20px] font-medium tracking-tight text-[#27251e]">
              perplexity
            </span>
          </div>

          {/* Header */}
          <header className="mb-6">
            <h1 className="text-[22px] font-medium text-[#27251e] tracking-tight mb-1">
              Create your account
            </h1>
            <p className="text-[14px] text-[#72706b]">
              Start researching and querying with verified knowledge
            </p>
          </header>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1.5">
              <label
                className="text-[13px] font-medium text-[#27251e]"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full bg-[#faf8f5] border border-[#d1d1cd] rounded-[12px] px-3.5 py-2.5 text-[#27251e] placeholder:text-[#92918b] text-[14px] input-focus-teal transition-all"
                id="username"
                name="username"
                placeholder="Choose a username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-[13px] font-medium text-[#27251e]"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full bg-[#faf8f5] border border-[#d1d1cd] rounded-[12px] px-3.5 py-2.5 text-[#27251e] placeholder:text-[#92918b] text-[14px] input-focus-teal transition-all"
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                className="text-[13px] font-medium text-[#27251e]"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-[#faf8f5] border border-[#d1d1cd] rounded-[12px] px-3.5 py-2.5 text-[#27251e] placeholder:text-[#92918b] text-[14px] input-focus-teal transition-all pr-10"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92918b] hover:text-[#27251e] p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password.length > 0 && (
                <div className="pt-1">
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[1, 2, 3, 4].map((level) => {
                      let bgColor = "#d1d1cd";
                      if (level <= strength) {
                        if (strength === 1) bgColor = "#93000a";
                        else if (strength === 2) bgColor = "#d97706";
                        else if (strength >= 3) bgColor = "#016a71";
                      }
                      return (
                        <div
                          key={level}
                          className="h-1 rounded-full transition-colors duration-200"
                          style={{ backgroundColor: bgColor }}
                        />
                      );
                    })}
                  </div>

                  {/* Requirements list */}
                  <div className="text-[12px] space-y-1 text-[#72706b]">
                    <div
                      className={`flex items-center gap-1.5 ${reqs.length ? "text-[#016a71] font-medium" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {reqs.length ? "check" : "circle"}
                      </span>
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${reqs.number ? "text-[#016a71] font-medium" : ""}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {reqs.number ? "check" : "circle"}
                      </span>
                      <span>Contains at least one number</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full bg-[#27251e] hover:bg-[#000000] active:scale-[0.99] text-[#faf8f5] font-medium text-[14px] py-2.5 rounded-[12px] flex items-center justify-center gap-2 transition-all mt-3 disabled:opacity-50"
              type="submit"
            >
              {loading ? "Creating account..." : "Create account"}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-6 text-center">
            <p className="text-[13px] text-[#72706b]">
              Already have an account?
              <Link
                className="text-[#016a71] font-medium ml-1.5 hover:underline"
                to="/login"
              >
                Sign in
              </Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
