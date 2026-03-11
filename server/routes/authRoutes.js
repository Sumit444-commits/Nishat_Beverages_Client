import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

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

export default router;