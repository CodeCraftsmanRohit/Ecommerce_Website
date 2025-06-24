import express from "express";
import {
  register,
  login,
  logout,
  isAuthenticated,
  sendResetOtp,
  resetpassword,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import  {upload}  from '../middleware/multer.js';
const authRouter = express.Router();

// Auth Routes
authRouter.post('/register', upload.single('coverImage'), register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// Authenticated Check (supports both POST and GET)
authRouter.post("/is-auth", userAuth, isAuthenticated);
authRouter.get("/is-auth", userAuth, isAuthenticated);

// Password Reset Routes
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetpassword);

export default authRouter;
