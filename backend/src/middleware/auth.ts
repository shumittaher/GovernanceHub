import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedUser {
  userId: number;
  tenantId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "error",
        message: "Missing or invalid authorization header",
      });
      return;
    }

    const token = authHeader.slice(7);

    const decoded = jwt.verify(token, JWT_SECRET as string) as AuthenticatedUser;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
}
