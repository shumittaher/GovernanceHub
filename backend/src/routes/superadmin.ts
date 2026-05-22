import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { requireSuperadmin } from "../middleware/requireSuperadmin";
import { listAdmins, createAdmin, deleteAdmin } from "../services/superadminService";
import { listTenants, createTenant, deleteTenant } from "../services/tenantsService";

const router = Router();

router.use(authMiddleware);
router.use(requireSuperadmin);

const createAdminSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  tenant_id: z.number().int().positive("tenant_id must be a positive integer"),
});

router.get("/admins", async (_req: Request, res: Response) => {
  try {
    const admins = await listAdmins();
    res.json({ admins });
  } catch (error) {
    console.error("Failed to list admins:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to list admins",
    });
  }
});

router.post("/admins", async (req: Request, res: Response) => {
  try {
    const parsed = createAdminSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body",
        errors: parsed.error.issues,
      });
    }

    const { name, email, password, tenant_id } = parsed.data;
    const admin = await createAdmin(tenant_id, name, email, password);

    res.status(201).json({ admin });
  } catch (error) {
    console.error("Failed to create admin:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to create admin",
    });
  }
});

router.delete("/admins/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid admin id",
      });
    }

    const deleted = await deleteAdmin(id);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete admin:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to delete admin",
    });
  }
});

const createTenantSchema = z.object({
  name: z.string().nonempty("Name is required"),
});

router.get("/tenants", async (_req: Request, res: Response) => {
  try {
    const tenants = await listTenants();
    res.json({ tenants });
  } catch (error) {
    console.error("Failed to list tenants:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to list tenants",
    });
  }
});

router.post("/tenants", async (req: Request, res: Response) => {
  try {
    const parsed = createTenantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body",
        errors: parsed.error.issues,
      });
    }

    const tenant = await createTenant(parsed.data.name);
    res.status(201).json({ tenant });
  } catch (error) {
    console.error("Failed to create tenant:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to create tenant",
    });
  }
});

router.delete("/tenants/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tenant id",
      });
    }

    const deleted = await deleteTenant(id);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Tenant not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete tenant:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to delete tenant",
    });
  }
});

export default router;
