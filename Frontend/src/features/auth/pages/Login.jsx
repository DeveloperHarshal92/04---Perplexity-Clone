import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 50;
      const rotateY = (centerX - x) / 50;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      const card = cardRef.current;
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
    <div className="dark min-h-screen flex items-center justify-center relative overflow-hidden font-body-md text-on-surface bg-surface-dim">
      {/* Atmospheric Background Elements */}
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] amber-glow pointer-events-none"></div>
      
      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[440px] px-gutter">
        {/* Glassmorphism Login Card */}
        <div ref={cardRef} className="glass-card rounded-xl p-xl shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
          {/* Logo Section */}
          <div className="flex items-center gap-md mb-xl">
            <img alt="Orchard AI" className="w-8 h-8 object-contain" src="data:image/png;base64,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"/>
            <span className="font-headline-md text-headline-md tracking-widest text-primary">ORCHARD AI</span>
          </div>

          {/* Header */}
          <header className="mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-surface-variant mb-xs">Welcome back</h1>
            <p className="font-body-sm text-body-sm text-outline">Access your neural workspace</p>
          </header>

          {/* Form */}
          <form className="space-y-lg" onSubmit={submitForm}>
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-md py-md text-on-background focus-amber transition-all placeholder:text-outline/50" 
                id="email" 
                placeholder="name@company.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                <a className="font-label-sm text-label-sm text-primary hover:underline transition-all" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-md py-md text-on-background focus-amber transition-all placeholder:text-outline/50" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button className="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-md rounded-lg flex items-center justify-center gap-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(217,119,7,0.2)]" type="submit">
              Sign in
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 500" }}>arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-xl flex items-center gap-md">
            <div className="h-px flex-1 bg-outline-variant/20"></div>
            <span className="font-label-sm text-label-sm text-outline">OR</span>
            <div className="h-px flex-1 bg-outline-variant/20"></div>
          </div>

          {/* Secondary Options */}
          <div className="space-y-md">
            <button className="w-full bg-surface-container border border-outline-variant/30 text-on-surface font-label-md text-label-md py-md rounded-lg flex items-center justify-center gap-md hover:bg-surface-variant transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer */}
          <footer className="mt-xl text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              No account? 
              <Link className="text-primary font-bold ml-xs hover:underline transition-all" to="/register">Create one</Link>
            </p>
          </footer>
        </div>

        {/* System Status Hint */}
        <div className="mt-lg flex justify-center gap-xl opacity-60">
          <div className="flex items-center gap-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-outline">Network Secure</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="font-label-sm text-label-sm text-outline">v2.4.1</span>
          </div>
        </div>
      </main>
    </div>
  );
}
