// middleware/userAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch the full user object
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // ✅ Attach full user object to req.user
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;
