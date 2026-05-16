import crypto from "node:crypto";
import { config } from "../config.js";

export function estimateCarbon(areaAcres, ndviMean) {
  const areaHectares = areaAcres * 0.404686;
  const tco2e = areaHectares * ndviMean * 3.67;
  return {
    ndviScore: Number(ndviMean.toFixed(2)),
    tco2eEstimate: Number(tco2e.toFixed(2)),
    earningsEstimateInr: Math.round(tco2e * 2000)
  };
}

function mockNdvi(boundaryGeoJson) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(boundaryGeoJson))
    .digest("hex");
  const seed = Number.parseInt(hash.slice(0, 8), 16);
  return 0.48 + (seed % 2600) / 10000;
}

export async function calculateNdviForBoundary(boundaryGeoJson) {
  if (config.ndviProvider !== "mock") {
    throw new Error("Live Sentinel Hub NDVI is not configured in this MVP build.");
  }

  return mockNdvi(boundaryGeoJson);
}
