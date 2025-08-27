import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  logger.error({ err, path: req.path, id: (req as any).id }, "Unhandled error");
  res.status(status).json({ error: err.message || "Internal Server Error" });
}
