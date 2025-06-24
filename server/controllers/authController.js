// Import bcryptjs to securely hash user passwords before storing them
import bcrypt from "bcryptjs";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
// Import jsonwebtoken to create signed JWT tokens for user authentication
import jwt from "jsonwebtoken";

// Import the user model from the models directory
import usermodel from "../models/usermodel.js";

import transporter from "../config/modemailer.js";


// Export an asynchronous controller function to handle user registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Safely upload cover image (if present)
    let coverImageUpload = null;
    if (req.file && req.file.buffer) {
      coverImageUpload = await uploadOnCloudinary(req.file.buffer);
    }

    const user = new usermodel({
      name,
      email,
      password: hashedPassword,
      coverImage: coverImageUpload?.secure_url || "", // fallback to empty string
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to My Website",
      text: `Welcome to my website. Your account has been created with email ID: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ User registered: ${email} (${name})`);

    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coverImage: user.coverImage,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const login = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Check if user with provided email exists
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    // Generate a new JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in cookie with security settings
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
        // ✅ Add login success log
    console.log(`✅ User logged in: ${email}`);


    // Respond with success message
    res.json({
      success: true,
      message: "User Login successfully",
    });
  } catch (error) {
    // Handle any errors
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token cookie from client
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // Respond with logout success
    return res.json({ success: true, message: "Log Out" });
  } catch (error) {
    // Send error response if logout fails
    res.json({ success: false, message: error.message });
  }
};



export const isAuthenticated=async(req,res)=>{
  try {
return res.json({success:true})
  } catch (error) {
    return res.json({success:false,message:error.message})

  }
};

export const sendResetOtp=async(req,res)=>{
  const {email}=req.body;

  if(!email){
    return res.json({success:false,message:'Email is required'})
  }

  try {

    const user=await usermodel.findOne({email});
     if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });}
       // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP and expiry to user record
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Email the OTP
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email, // ✅ fixed this
      subject: "PassWord Reset OTP",
      text: `Your OTP is ${otp}. Use this to proceed to resetting your password`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Reset Password OTP Sent on Email" });

    }

   catch(error) {
    return res.json({success:false,message:error.message})
  }


}


export const resetpassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    // ✅ Send new token after successful password reset
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Lax",
    });

    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
