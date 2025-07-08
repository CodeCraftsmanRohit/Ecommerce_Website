// middleware/userAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const userAuth2 = async (req, res, next) => {
  try {
    console.log("🍪 Cookies:", req.cookies);

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
    console.log("✅ Authenticated user:", user.name);

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default userAuth2;
