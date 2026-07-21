import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi.js";
import { setCredentials } from "../redux/authSlice.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser(form);
      dispatch(setCredentials(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">CivicTrack</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sign in to manage reports, track updates, and support your community.
          </p>
        </div>

        {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-900">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label className="block text-sm font-medium text-slate-900">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          No account?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
