import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// app routes imports
import appRoutes from "./routes/app-routes.js";
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import salesmenRoutes from './routes/salesmenRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import areaAssignmentRoutes from './routes/areaAssignmentRoutes.js';
import openingBalanceRoutes from './routes/openingBalances.js';
import closingRecordRoutes from './routes/closingRecords.js';
import dailyAssignmentRoutes from './routes/dailyAssignments.js';
import salesmanPaymentRoutes from './routes/salesmanPayments.js';
import stockAdjustmentRoutes from './routes/stockAdjustments.js';
import dailyReminderRoutes from './routes/dailyReminders.js';

// Import the database connection module
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// ========== MIDDLEWARE ========== //
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
      "https://nishat-beverages-app.vercel.app",
      process.env.backend_url,
      process.env.frontend_url
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== INITIALIZE DATABASE ========== //
// Connect to DB immediately for Serverless functions
connectDB();

// ========== ROUTES ========== //
app.get("/", (req, res) => {
  res.json({
    message: "Nishat Beverages Admin API is running!",
    database: {
      status:
        mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      name: mongoose.connection.db?.databaseName || "Not connected",
    },
  });
});

app.use("/api", appRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", customerRoutes);
app.use("/api", salesmenRoutes);
app.use("/api", areaAssignmentRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", salesRoutes);
app.use("/api", expenseRoutes);
app.use('/api/opening-balances', openingBalanceRoutes);
app.use('/api/closing-records', closingRecordRoutes);
app.use('/api/daily-assignments', dailyAssignmentRoutes);
app.use('/api/salesman-payments', salesmanPaymentRoutes);
app.use('/api/stock-adjustments', stockAdjustmentRoutes);
app.use('/api/daily-reminders', dailyReminderRoutes);

// ========== ERROR HANDLING ========== //
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ========== START SERVER ========== //
const PORT = process.env.PORT || 5000;

// Only listen automatically if running locally (Not on Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 NISHAT BEVERAGES RO PLANT - ADMIN SERVER");
    console.log("=".repeat(60));
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log("=".repeat(60));
    console.log("\n🔐 AUTHENTICATION ENDPOINTS:");
    console.log(`   POST  http://localhost:${PORT}/api/auth/signup`);
    console.log(`   POST  http://localhost:${PORT}/api/auth/login`);
    console.log(
      `   POST  http://localhost:${PORT}/api/auth/create-admin (optional)`,
    );
    console.log(`   GET   http://localhost:${PORT}/api/auth/users`);
    console.log("\n👥 CUSTOMER ENDPOINTS:");
    console.log(`   GET   http://localhost:${PORT}/api/customers`);
    console.log(`   POST  http://localhost:${PORT}/api/customers`);
    console.log(`   GET   http://localhost:${PORT}/api/customers/areas/list`);
    console.log("\n👤 SALESMAN ENDPOINTS:");
    console.log(`   GET   http://localhost:${PORT}/api/salesmen`);
    console.log(`   POST  http://localhost:${PORT}/api/salesmen`);
    console.log(`   GET   http://localhost:${PORT}/api/salesmen/stats/summary`);
    console.log("\n📍 AREA ASSIGNMENT ENDPOINTS:");
    console.log(`   GET    http://localhost:${PORT}/api/area-assignments`);
    console.log(`   POST   http://localhost:${PORT}/api/area-assignments`);
    console.log(`   GET    http://localhost:${PORT}/api/area-assignments/:id`);
    console.log(`   PUT    http://localhost:${PORT}/api/area-assignments/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/area-assignments/:id`);
    console.log(
      `   GET    http://localhost:${PORT}/api/area-assignments/stats/summary`,
    );
    console.log("=".repeat(60));
  });
}

// Export for Vercel Serverless Functions
export default app;
