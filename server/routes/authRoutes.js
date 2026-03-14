import express from "express";
import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';


const router = express.Router();

// ========== AUTH ROUTES ========== //
router.post("/signup", async (req, res) => {
  try {
    console.log("📝 Signup attempt:", {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    const { name, email, phone, password, confirmPassword, role } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();
    console.log("✅ User created successfully:", user.email);

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Signup error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password, email, phone } = req.body;

    console.log("🔑 Login attempt received:", { identifier, email, phone });

    let loginField, loginValue;

    if (identifier) {
      if (identifier.includes("@")) {
        loginField = "email";
        loginValue = identifier.toLowerCase();
      } else {
        loginField = "phone";
        loginValue = identifier;
      }
    } else if (email) {
      loginField = "email";
      loginValue = email.toLowerCase();
    } else if (phone) {
      loginField = "phone";
      loginValue = phone;
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide email or phone number",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const query = { [loginField]: loginValue };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials. Please check your email/phone and password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials. Please check your email/phone and password.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };

    console.log(`✅ Login successful: ${user.email}`);

    res.json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

router.post("/create-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: "admin@nishat.com" });

    if (adminExists) {
      return res.json({
        success: false,
        message: "Admin user already exists",
        email: adminExists.email,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const adminUser = new User({
      name: "System Administrator",
      email: "admin@nishat.com",
      phone: "+923001234567",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    const { password, ...adminResponse } = adminUser.toObject();

    res.status(201).json({
      success: true,
      message: "Default admin created successfully",
      user: adminResponse,
      testCredentials: {
        email: "admin@nishat.com",
        phone: "+923001234567",
        password: "admin123",
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create admin user",
    });
  }
});


router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 1. Find user by token AND ensure token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Assumes you stored an expiration date
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired.' });
    }

    // 2. Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 3. Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    res.json({ success: true, message: 'Password successfully updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
});


router.post('/forgot-password', async (req, res) => {
  try {
    const { method, identifier } = req.body;

    // Build dynamic query based on method
    const query = method === 'email' ? { email: identifier } : { phone: identifier };
    
    // Find user
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(16).toString('hex');
    const resetTokenExpires = Date.now() + (60 * 60 * 1000); // 1 hour

    // Save token to user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // In production: Send this token via Email (Nodemailer) or SMS (Twilio).
    // For this demo, we return it to the frontend.
    res.json({ 
        success: true, 
        message: 'Reset request processed.', 
        resetToken: resetToken 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error processing request.' });
  }
});
export default router;