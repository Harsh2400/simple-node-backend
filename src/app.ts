import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { requestId } from "./middlewares/requestId";
import { logger } from "./lib/logger";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({ reqId: (req as any).id }),
    }),
  );

  app.get("/", (_req, res) => res.json({ service: "simple-node-backend", ok: true }));
  app.use(routes);

  app.use(errorHandler);
  return app;
}
