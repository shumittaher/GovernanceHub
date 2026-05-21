import { Router } from "express";
import { z } from "zod";
import { loginUser } from "../services/authService";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid login payload",
        errors: parsed.error.issues,
      });
    }

    const result = await loginUser(parsed.data.email, parsed.data.password);
    if (!result) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    res.json({
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(500).json({
      status: "error",
      message: "Unable to process login",
    });
  }
});

export default router;
