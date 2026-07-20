import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi.js";
import { setCredentials } from "../redux/authSlice.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerUser(form);
      dispatch(setCredentials(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl border border-[#dce8f5] p-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Create Account</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          required
          className="border border-[#dce8f5] rounded-lg px-4 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="border border-[#dce8f5] rounded-lg px-4 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          className="border border-[#dce8f5] rounded-lg px-4 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="bg-primary text-white rounded-lg py-2 font-medium">
          Sign Up
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Already have an account? <Link to="/login" className="text-primary">Log in</Link>
      </p>
    </div>
  );
}
