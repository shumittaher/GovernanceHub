import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { createUser } from "../services/usersService";

const router = Router();

router.use(authMiddleware);

const createUserSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

router.post("/", requireRole("admin"), async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const userData = createUserSchema.safeParse(req.body);

    if (!userData.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request body",
        errors: userData.error.issues,
      });
    }

    const user = await createUser(tenantId, userData.data);

    res.status(201).json({ user });
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to create user",
    });
  }
});

export default router;
