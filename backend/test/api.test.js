import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databasePath = path.join(os.tmpdir(), `carbonx-test-${Date.now()}.sqlite`);
process.env.DATABASE_PATH = databasePath;
process.env.JWT_SECRET = "test-secret";

const { createApp } = await import("../src/app.js");
const { closeDb, migrate } = await import("../src/db.js");

const app = createApp();

const sampleBoundary = {
  type: "Polygon",
  coordinates: [
    [
      [79.59025, 17.9678],
      [79.59485, 17.9678],
      [79.59485, 17.9712],
      [79.59025, 17.9712],
      [79.59025, 17.9678]
    ]
  ]
};

const sampleMultiBoundary = {
  type: "MultiPolygon",
  coordinates: [
    sampleBoundary.coordinates,
    [
      [
        [79.596, 17.9678],
        [79.598, 17.9678],
        [79.598, 17.9692],
        [79.596, 17.9692],
        [79.596, 17.9678]
      ]
    ]
  ]
};

beforeAll(async () => {
  await migrate();
});

afterAll(async () => {
  await closeDb();
  if (fs.existsSync(databasePath)) {
    fs.unlinkSync(databasePath);
  }
});

describe("CarbonX API", () => {
  it("registers and logs in a farmer", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Ramaiah",
      phone: "9000000001",
      password: "carbonx123"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeTruthy();
    expect(registerResponse.body.user.name).toBe("Ramaiah");

    const loginResponse = await request(app).post("/api/auth/login").send({
      phone: "9000000001",
      password: "carbonx123"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeTruthy();
  });

  it("rejects protected farm routes without a JWT", async () => {
    const response = await request(app).get("/api/farms");

    expect(response.status).toBe(401);
  });

  it("creates a farm and calculates NDVI carbon estimates", async () => {
    const authResponse = await request(app).post("/api/auth/register").send({
      name: "Lakshmi",
      phone: "9000000002",
      password: "carbonx123"
    });

    const createResponse = await request(app)
      .post("/api/farms")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Warangal Test Farm",
        boundaryGeojson: sampleBoundary
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.farm.status).toBe("calculated");
    expect(createResponse.body.farm.areaAcres).toBeGreaterThan(0);
    expect(createResponse.body.farm.ndviScore).toBeGreaterThanOrEqual(0.48);
    expect(createResponse.body.farm.tco2eEstimate).toBeGreaterThan(0);
    expect(createResponse.body.farm.earningsEstimateInr).toBeGreaterThan(0);

    const listResponse = await request(app)
      .get("/api/farms")
      .set("Authorization", `Bearer ${authResponse.body.token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.farms).toHaveLength(1);

    const calculateResponse = await request(app)
      .post(`/api/farms/${createResponse.body.farm.id}/calculate`)
      .set("Authorization", `Bearer ${authResponse.body.token}`);

    expect(calculateResponse.status).toBe(200);
    expect(calculateResponse.body.farm.status).toBe("calculated");
    expect(calculateResponse.body.farm.ndviScore).toBe(createResponse.body.farm.ndviScore);
  });

  it("accepts FTW-style MultiPolygon boundaries", async () => {
    const authResponse = await request(app).post("/api/auth/register").send({
      name: "Savitri",
      phone: "9000000003",
      password: "carbonx123"
    });

    const createResponse = await request(app)
      .post("/api/farms")
      .set("Authorization", `Bearer ${authResponse.body.token}`)
      .send({
        name: "Selected FTW Field",
        boundaryGeojson: sampleMultiBoundary
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.farm.boundaryGeojson.type).toBe("MultiPolygon");
    expect(createResponse.body.farm.areaAcres).toBeGreaterThan(0);
    expect(createResponse.body.farm.status).toBe("calculated");
  });

  it("rejects invalid login credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      phone: "9000000001",
      password: "wrong-password"
    });

    expect(response.status).toBe(401);
  });
});
