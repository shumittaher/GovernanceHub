import { Router } from "express";
import { listIncidents } from "../services/incidentsService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const incidents = await listIncidents();

    res.json({ incidents });
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch incidents",
    });
  }
});

export default router;
