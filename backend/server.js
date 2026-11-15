
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import pool from "./config/postgres.js";
import connectMongoDB from "./config/mongodb.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify PostgreSQL
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully");

    // Connect MongoDB
    await connectMongoDB();

    // Start Express
    app.listen(PORT, () => {
      console.log(
        `MediSense Backend running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
