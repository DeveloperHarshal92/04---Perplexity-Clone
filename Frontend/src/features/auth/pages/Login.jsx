import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import { PerplexusIcon } from "../../../components/PerplexusLogo.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();
    if (!email || !password) return;
    const payload = { email, password };
    await handleLogin(payload);
    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center relative p-4 bg-[#faf8f5] text-[#27251e] font-sans selection:bg-[#016a71]/15">
      {/* Background Ambience */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-30 blur-[130px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(1, 106, 113, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[420px]">
        {/* Soft Paper Card */}
        <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-6 sm:p-8 card-subtle-shadow">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-5 h-5 text-[#27251e] flex items-center justify-center">
              <PerplexusIcon size={18} />
            </div>
            <span
              className="text-[20px] font-medium tracking-tight text-[#27251e] leading-none"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            >
              Perplexus
            </span>
          </div>

          {/* Header */}
          <header className="mb-6">
            <h1 className="text-[20px] font-normal text-[#27251e] tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-[14px] text-[#72706b] font-normal">
              Sign in to your account and research workspace
            </p>
          </header>

          {/* Form */}
          <form className="space-y-4" onSubmit={submitForm}>
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
                placeholder="name@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  className="text-[13px] font-medium text-[#27251e]"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="text-[12px] text-[#016a71] hover:underline transition-all"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <input
                className="w-full bg-[#faf8f5] border border-[#d1d1cd] rounded-[12px] px-3.5 py-2.5 text-[#27251e] placeholder:text-[#92918b] text-[14px] input-focus-teal transition-all"
                id="password"
                placeholder="••••••••"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#27251e] hover:bg-[#000000] active:scale-[0.99] text-[#faf8f5] font-medium text-[14px] py-2.5 rounded-[12px] flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
              type="submit"
            >
              {loading ? "Signing in..." : "Sign in"}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d1d1cd]/70" />
            <span className="text-[11px] font-mono text-[#92918b]">OR</span>
            <div className="h-px flex-1 bg-[#d1d1cd]/70" />
          </div>

          {/* Secondary Google Login */}
          <button
            type="button"
            className="w-full bg-[#faf8f5] border border-[#d1d1cd] text-[#27251e] hover:bg-[#f0ede6] text-[13px] font-medium py-2.5 rounded-[12px] flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <footer className="mt-6 text-center">
            <p className="text-[13px] text-[#72706b]">
              New to Perplexus?
              <Link
                className="text-[#016a71] font-medium ml-1.5 hover:underline"
                to="/register"
              >
                Create an account
              </Link>
            </p>
          </footer>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex justify-center items-center gap-2 text-[11px] font-mono text-[#92918b]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#016a71]" />
          <span>Encrypted connection</span>
        </div>
      </main>
    </div>
  );
}
