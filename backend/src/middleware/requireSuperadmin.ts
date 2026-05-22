import { Request, Response, NextFunction } from "express";

export function requireSuperadmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.role !== "superadmin") {
    res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
    return;
  }
  next();
}
