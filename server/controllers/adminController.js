// adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import userModel from "../models/usermodel.js";
import Order from "../models/orderModel.js";

// POST /api/admin/register
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const existing = await Admin.findOne({ email });
  if (existing) return res.json({ success: false, message: "Admin already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ name, email, password: hashedPassword });
  await newAdmin.save();

  const token = jwt.sign({ adminId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("adminToken", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, message: "Admin registered", admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email } });
};

// POST /api/admin/login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.json({ success: false, message: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.json({ success: false, message: "Incorrect password" });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("adminToken", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, message: "Login successful" });
};

// GET /api/admin/is-auth
export const isAdminAuthenticated = async (req, res) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.adminId) return res.json({ success: false });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/admin/logout
export const logoutAdmin = async (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true, message: "Logged out successfully" });
};
export const getAllUsersWithOrders = async (req, res) => {
  try {
    const users = await userModel.find({}, "name email coverImage");

    const userData = await Promise.all(users.map(async (user) => {
      const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        coverImage: user.coverImage,
        orderCount: orders.length,
        latestStatus: orders[0]?.status || "No Orders",
      };
    }));

    res.json({ success: true, users: userData });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const getUserOrdersByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.json({ success: true, user, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
