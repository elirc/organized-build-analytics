import request from "supertest";

import { createApp } from "../../src/app.js";

describe("health endpoint", () => {
  it("returns ok", async () => {
    const app = createApp();
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
