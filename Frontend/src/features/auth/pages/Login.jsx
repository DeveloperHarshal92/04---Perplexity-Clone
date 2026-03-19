import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import { useSelector } from 'react-redux';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const submitForm = async (event) => {
    event.preventDefault();

    const payload = {
      email,
      password,
    };

    await handleLogin(payload);
    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-[#31b8c6] mb-2">Welcome Back</h1>

        <p className="text-sm text-neutral-400 mb-6">
          Sign in to continue to Perplexity
        </p>

        <form onSubmit={submitForm} className="space-y-5">
          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-[#31b8c6]"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-[#31b8c6]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#31b8c6] hover:bg-[#2aa3b0] text-black py-3 rounded-lg font-medium transition"
          >
            Sign In
          </button>
        </form>

        {/* 🔗 Navigation */}
        <p className="text-sm text-neutral-400 mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#31b8c6] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
