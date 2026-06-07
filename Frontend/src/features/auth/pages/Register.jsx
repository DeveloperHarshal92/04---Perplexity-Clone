import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

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

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    // You can handle registration logic here
    // navigate("/");
  }

  return (
    <div className="dark flex items-center justify-center min-h-screen p-md bg-surface-dim overflow-hidden font-body-md text-on-surface">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-accent/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-[480px] z-10">
        <div className="glass-card rounded-2xl p-lg md:p-xl transition-all duration-500 ease-in-out">
          {/* Header Section */}
          <header className="flex flex-col gap-sm mb-lg">
            <div className="flex items-center gap-xs">
              <img alt="Orchard AI" className="w-8 h-8 rounded-md" src="https://lh3.googleusercontent.com/aida/AP1WRLttygO57vcpMbS9IhQtnYFUvW0rthLyZ1JFio4pieRXM4j6x7I7RycZVyPX3lP94t347N6RqmNdMybWfYy4EfUBiMB6qguKHJf9nkIcAIMuTTUZraYC1uM7VNL_AgoTeUd4ADRwBm72B55QlOiy2G_ISHI4CMBwK0eT_vU6LM_9qVl4RoO8yVJ0U4OdqtdoXRMG9bQNcHuv8qV8dcqNQ3jIHNqb4cScQv-H_9kgWEiS2_z1G9DPgPc2KQ"/>
              <span className="font-lora text-headline-sm font-semibold tracking-tight text-primary uppercase">ORCHARD AI</span>
            </div>
            <div className="mt-xs">
              <h1 className="font-headline-md text-headline-md text-on-surface">Start your sanctuary.</h1>
              <p className="font-body-md text-body-md text-on-surface-variant/80">Cultivating intelligence with intentional design.</p>
            </div>
          </header>

          {/* Registration Form */}
          <form className="flex flex-col gap-md" id="registrationForm" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="flex flex-col gap-xs">
              <label className="font-body-md text-label-caps text-on-surface-variant uppercase tracking-widest px-unit" htmlFor="username">Username</label>
              <input 
                className="bg-surface-variant/50 border border-outline-variant/30 rounded-lg px-md py-sm font-code-sm text-on-surface input-glow transition-all placeholder:text-on-surface-variant/40" 
                id="username" 
                name="username"
                placeholder="Choose a handle" 
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-xs">
              <label className="font-body-md text-label-caps text-on-surface-variant uppercase tracking-widest px-unit" htmlFor="email">Email</label>
              <input 
                className="bg-surface-variant/50 border border-outline-variant/30 rounded-lg px-md py-sm font-code-sm text-on-surface input-glow transition-all placeholder:text-on-surface-variant/40" 
                id="email" 
                name="email"
                placeholder="sanctuary@orchard.ai" 
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label className="font-body-md text-label-caps text-on-surface-variant uppercase tracking-widest px-unit" htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-surface-variant/50 border border-outline-variant/30 rounded-lg px-md py-sm font-code-sm text-on-surface input-glow transition-all placeholder:text-on-surface-variant/40" 
                  id="password" 
                  name="password"
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface" onClick={() => setShowPassword(!showPassword)} type="button">
                  <span className="material-symbols-outlined text-[20px]" id="visibilityIcon">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Password Strength Meter */}
              <div className="grid grid-cols-4 gap-xs mt-xs">
                {[1, 2, 3, 4].map((level) => {
                  let bgColor = 'rgba(255, 255, 255, 0.1)';
                  if (level <= strength) {
                    if (strength === 1) bgColor = '#ef4444'; // Red
                    if (strength === 2) bgColor = '#f97316'; // Orange
                    if (strength === 3) bgColor = '#facc15'; // Yellow
                    if (strength >= 4) bgColor = '#D97706'; // Accent
                  }
                  return (
                    <div 
                      key={level} 
                      className="strength-bar" 
                      style={{ backgroundColor: bgColor }}
                    />
                  );
                })}
              </div>

              {/* Requirements Checklist */}
              <ul className="flex flex-col gap-xs mt-sm custom-scrollbar max-h-40 overflow-y-auto pr-xs">
                <li className={`requirement-item flex items-center gap-xs font-body-md text-on-surface-variant/70 text-[14px] ${reqs.length ? 'met' : ''}`}>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  At least 8 characters long
                </li>
                <li className={`requirement-item flex items-center gap-xs font-body-md text-on-surface-variant/70 text-[14px] ${reqs.number ? 'met' : ''}`}>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Contains at least one number
                </li>
                <li className={`requirement-item flex items-center gap-xs font-body-md text-on-surface-variant/70 text-[14px] ${reqs.special ? 'met' : ''}`}>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Includes a special symbol (!@#$)
                </li>
              </ul>
            </div>

            {/* CTA */}
            <button className="mt-md w-full bg-accent text-on-primary py-md rounded-xl font-body-md font-semibold text-body-lg btn-primary-hover transition-all flex items-center justify-center gap-xs group" type="submit">
              Create account
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            
            <p className="text-center font-body-md text-[14px] text-on-surface-variant/60 mt-sm">
              By registering, you agree to our 
              <a className="text-primary hover:underline underline-offset-4 mx-1" href="#">Terms</a> and 
              <a className="text-primary hover:underline underline-offset-4 mx-1" href="#">Privacy Policy</a>.
            </p>
          </form>
        </div>

        {/* Secondary Navigation/Links */}
        <footer className="mt-lg text-center flex flex-col gap-sm">
          <p className="font-body-md text-on-surface-variant">
            Already have an account? 
            <Link className="text-primary font-semibold hover:text-primary-fixed transition-colors ml-1" to="/login">Sign in</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}