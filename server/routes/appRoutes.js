import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  const dbName = mongoose.connection.db?.databaseName || "Not connected";

  res.json({
    status: "OK",
    server: "Running",
    database: {
      status: dbStatus,
      name: dbName,
      host: mongoose.connection.host || "N/A",
      readyState: mongoose.connection.readyState,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
