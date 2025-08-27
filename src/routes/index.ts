import { Router } from "express";

import { healthRouter } from "./health";
import { helloRouter } from "./hello";

export const routes = Router();

routes.use(healthRouter);
routes.use("/api", helloRouter);
