# simple-node-backend

A tiny-but-professional Node.js backend built with **TypeScript + Express**. It’s intentionally simple for learning DevOps/CI-CD, but structured with industry best practices (env validation, logging, tests, CI ready). No Docker required.

---

## Features

* **TypeScript** build to `dist/`
* **Express** with security basics (`helmet`, `cors`)
* **Strict env validation** using Zod
* **Structured logging** via Pino (+ request IDs)
* **Jest + Supertest** tests
* **ESLint + Prettier**
* **GitHub Actions CI** (lint, test, build)

---

## Requirements

* Node **v20 LTS** (see `.nvmrc`)
* npm **10+**

---

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev
# → http://localhost:3000/ (service info)
# → http://localhost:3000/health (health)
# → http://localhost:3000/api/hello?name=you (sample API)
```

### Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only --poll src/server.ts",
  "build": "rimraf dist && tsc",
  "start": "node dist/server.js",
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix",
  "format": "prettier --check .",
  "format:fix": "prettier --write .",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

---

## Environment Variables

Env is validated at startup. See `.env.example`:

```
NODE_ENV=development
PORT=3000
# PRETTY_LOGS=true  # optional; requires dev dep pino-pretty
```

> **Tip:** In production, use SSM Parameter Store or Secrets Manager to supply env, and generate `.env` on the instance during deploy.

---

## Project Structure

```
src/
  app.ts              # express app factory
  server.ts           # entrypoint
  config/env.ts       # zod env validation
  lib/logger.ts       # pino logger
  middlewares/
    errorHandler.ts
    requestId.ts
  routes/
    index.ts
    health.ts
    hello.ts

.tests/
  health.test.ts
```

---

## Endpoints

* `GET /` → service banner
* `GET /health` → `{ status: "ok", uptime }`
* `GET /api/hello?name=YourName` → `{ message: "hello, YourName!" }`

---

## Linting & Formatting

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:fix
```

---

## Testing

```bash
npm test
npm run test:watch
```

---

## Logging

* Uses **Pino**; request logs via `pino-http`.
* Request IDs are added and echoed via the `x-request-id` header.
* In dev, pretty logs require `pino-pretty` (install as dev dependency).

---

## CI (GitHub Actions)

A minimal workflow lives at `.github/workflows/ci.yml`:

* Checks out repo
* Uses Node from `.nvmrc`
* `npm ci`, `npm run lint`, `npm test`, `npm run build`

> We’ll extend this to build artifacts and trigger an SSM-based deploy.

---

## Production Run (local simulation)

```bash
npm run build
PORT=5000 NODE_ENV=production npm start
```

Behind a reverse proxy (e.g., Nginx), point `/` or `/api` to the Node port.

---

## Deployment (Private EC2 via AWS SSM) — Overview

> **No public IP, no SSH.**

**Prereqs** (infra):

* EC2 in a **private subnet**
* Outbound via **NAT Gateway** or VPC Endpoints for SSM/EC2Messages/SSMMessages/S3
* SSM Agent installed (Amazon Linux 2023 has it by default)
* IAM Instance Profile with:

  * `AmazonSSMManagedInstanceCore`
  * `s3:GetObject` on your artifact bucket/path
  * `ssm:GetParameter` (Parameter Store) or `secretsmanager:GetSecretValue`

**Pipeline shape** (high-level):

1. GitHub Actions: lint/test/build → zip artifact.
2. Upload artifact to S3 (versioned key e.g. `releases/<commit_sha>.zip`).
3. **SSM SendCommand** to instance (target by tag) to:

   * Download artifact to `/opt/apps/simple-node-backend/releases/<sha>`
   * `npm ci --omit=dev`
   * Render `.env` from SSM parameters
   * Update `current` symlink → `releases/<sha>`
   * `pm2 reload <app>` *or* `systemctl restart <service>`
   * Health check `curl localhost:$PORT/health` → fail on non-200
4. Keep `releases/` for rollbacks; relink on failure.

**Env & Secrets**: Use Parameter Store/Secrets Manager; never commit secrets.

> A ready-to-copy deploy workflow + instance bootstrap script will be added once you share VPC/role/parameter names.

---

## Conventions

* Branch: `main`
* Conventional commits (recommended) or clear imperative messages
* PRs require CI green (lint, test, build)

---

## Troubleshooting

* **Pino pretty error**: Install `pino-pretty` (dev) or set `PRETTY_LOGS=false`.
* **Port in use**: Change `PORT` or stop other processes.
* **Env validation exits**: Ensure required vars exist; check `.env`.

---

## License

MIT (or your choice).
