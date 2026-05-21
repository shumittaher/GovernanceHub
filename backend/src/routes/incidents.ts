import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import {
  createIncident,
  getIncidentById,
  listIncidents,
} from "../services/incidentsService";

const router = Router();

router.use(authMiddleware);

const createIncidentSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"]),
  assigned_to: z.string().optional(),
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const incidents = await listIncidents(tenantId);

    res.json({ incidents });
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch incidents",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid incident id",
      });
    }

    const tenantId = req.user!.tenantId;
    const incident = await getIncidentById(tenantId, id);

    if (!incident) {
      return res.status(404).json({
        status: "error",
        message: "Incident not found",
      });
    }

    res.json({ incident });
  } catch (error) {
    console.error("Failed to fetch incident:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to fetch incident",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const incidentData = createIncidentSchema.safeParse(req.body);

    if (!incidentData.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body",
        errors: incidentData.error.issues,
      });
    }

    const incident = await createIncident(tenantId, incidentData.data);

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
