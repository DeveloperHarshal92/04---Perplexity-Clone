import { useState } from "react";
import { Link } from "react-router";

export default function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-[#31b8c6] mb-2">
          Create Account
        </h1>

        <p className="text-sm text-neutral-400 mb-6">
          Join Perplexity and start exploring
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-neutral-400">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-[#31b8c6]"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-[#31b8c6]"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-400">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-[#31b8c6]"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#31b8c6] hover:bg-[#2aa3b0] text-black py-3 rounded-lg font-medium transition"
          >
            Create Account
          </button>

        </form>

         {/* 🔗 Navigation */}
        <p className="text-sm text-neutral-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login" 
            className="text-[#31b8c6] hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}