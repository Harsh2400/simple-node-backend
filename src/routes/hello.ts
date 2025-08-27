import { Router } from "express";
export const helloRouter = Router();

helloRouter.get("/hello", (req, res) => {
  const name = String(req.query.name || "world");
  res.json({ message: `hello, ${name}!` });
});
