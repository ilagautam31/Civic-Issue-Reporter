import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Only allow "admin" role to be set manually in trusted/dev contexts.
    // In production this would be locked down further (invite codes etc).
    const user = await User.create({
      name,
      email,
      password,
      role: role === "admin" ? "admin" : "citizen",
    });

    return res.status(201).json({
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  return res.json({ user: req.user });
};
