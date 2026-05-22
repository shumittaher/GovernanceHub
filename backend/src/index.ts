import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import incidentsRouter from "./routes/incidents";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import superadminRouter from "./routes/superadmin";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      message: "GovernanceHub backend running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/superadmin", superadminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});