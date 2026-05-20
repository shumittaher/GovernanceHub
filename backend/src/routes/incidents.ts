import { Router } from "express";
import { z } from "zod";
import {
  createIncident,
  listIncidents,
} from "../services/incidentsService";

const router = Router();

const createIncidentSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]),
  assigned_to: z.string().optional(),
});

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

router.post("/", async (req, res) => {
  try {
    const incidentData = createIncidentSchema.safeParse(req.body);

    if (!incidentData.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body",
        errors: incidentData.error.issues,
      });
    }

    const incident = await createIncident(incidentData.data);

    res.status(201).json({ incident });
  } catch (error) {
    console.error("Failed to create incident:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to create incident",
    });
  }
});

export default router;
