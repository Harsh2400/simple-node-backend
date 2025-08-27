import { Request, Response, NextFunction } from "express";

import { logger } from "../lib/logger";

type ErrorWithStatus = { status?: number; message?: string };

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const e = (
    typeof err === "object" && err !== null ? (err as ErrorWithStatus) : {}
  ) as ErrorWithStatus;

  const status = typeof e.status === "number" ? e.status : 500;
  const message = typeof e.message === "string" ? e.message : "Internal Server Error";

  logger.error({ err, path: req.path, id: req.id }, "Unhandled error");
  res.status(status).json({ error: message });
}
