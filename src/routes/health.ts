import { Router } from "express";
export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() , message: "I am healthy!"});
});
