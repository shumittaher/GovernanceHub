"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const incidentsService_1 = require("../services/incidentsService");
const router = (0, express_1.Router)();
const createIncidentSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty(),
    description: zod_1.z.string().optional(),
    severity: zod_1.z.enum(["Low", "Medium", "High", "Critical"]),
    status: zod_1.z.enum(["Open", "In Progress", "Resolved", "Closed"]),
    assigned_to: zod_1.z.string().optional(),
});
router.get("/", async (_req, res) => {
    try {
        const incidents = await (0, incidentsService_1.listIncidents)();
        res.json({ incidents });
    }
    catch (error) {
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
        const incident = await (0, incidentsService_1.createIncident)(incidentData.data);
        res.status(201).json({ incident });
    }
    catch (error) {
        console.error("Failed to create incident:", error);
        res.status(500).json({
            status: "error",
            message: "Unable to create incident",
        });
    }
});
exports.default = router;
