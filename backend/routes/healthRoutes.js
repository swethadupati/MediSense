
import express from "express";
import pool from "../config/postgres.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  let postgresStatus = "disconnected";
  let mongoStatus = "disconnected";

  try {
    await pool.query("SELECT NOW()");
    postgresStatus = "connected";
  } catch (error) {
    console.error("PostgreSQL health check:", error.message);
  }

  if (mongoose.connection.readyState === 1) {
    mongoStatus = "connected";
  }

  const overallStatus =
    postgresStatus === "connected" &&
    mongoStatus === "connected"
      ? "healthy"
      : "degraded";

  res.status(overallStatus === "healthy" ? 200 : 503).json({
    success: overallStatus === "healthy",
    application: "MediSense",
    backend: "running",
    databases: {
      postgresql: postgresStatus,
      mongodb: mongoStatus
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
