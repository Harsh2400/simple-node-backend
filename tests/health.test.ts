import request from "supertest";

import { buildApp } from "../src/app";

describe("health check", () => {
  const app = buildApp();

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /api/hello returns greeting", async () => {
    const res = await request(app).get("/api/hello?name=DevOps");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("hello, DevOps!");
  });
});
