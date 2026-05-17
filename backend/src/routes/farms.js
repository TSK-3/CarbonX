import express from "express";
import { all, get, run } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { calculateNdviForBoundary, estimateCarbon } from "../services/ndviService.js";
import { calculateAreaAcres, normalizeBoundaryGeoJson } from "../utils/geo.js";

export const farmsRouter = express.Router();

farmsRouter.use(requireAuth);

async function serializeFarm(farm) {
  const auction = await get("SELECT id FROM auctions WHERE farm_id = ? AND status = 'active'", [farm.id]);

  return {
    id: farm.id,
    userId: farm.user_id,
    name: farm.name,
    boundaryGeojson: JSON.parse(farm.boundary_geojson),
    areaAcres: farm.area_acres,
    ndviScore: farm.ndvi_score,
    tco2eEstimate: farm.tco2e_estimate,
    earningsEstimateInr: farm.earnings_estimate_inr,
    status: farm.status,
    nftTokenId: farm.nft_token_id,
    nftContractAddress: farm.nft_contract_address,
    auctionActive: !!auction,
    createdAt: farm.created_at
  };
}

farmsRouter.post("/", async (req, res, next) => {
  try {
    const { name, boundaryGeojson } = req.body;

    if (!name || !boundaryGeojson) {
      res.status(400).json({ message: "Farm name and boundary GeoJSON are required." });
      return;
    }

    const boundary = normalizeBoundaryGeoJson(boundaryGeojson);
    const areaAcres = calculateAreaAcres(boundary);

    if (areaAcres <= 0) {
      res.status(400).json({ message: "Farm boundary area must be greater than zero." });
      return;
    }

    const ndviMean = await calculateNdviForBoundary(boundary);
    const estimates = estimateCarbon(areaAcres, ndviMean);

    const result = await run(
      `INSERT INTO farms
        (user_id, name, boundary_geojson, area_acres, ndvi_score, tco2e_estimate, earnings_estimate_inr, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'calculated')`,
      [
        req.user.id,
        String(name).trim(),
        JSON.stringify(boundary),
        areaAcres,
        estimates.ndviScore,
        estimates.tco2eEstimate,
        estimates.earningsEstimateInr
      ]
    );

    const farm = await get("SELECT * FROM farms WHERE id = ? AND user_id = ?", [
      result.id,
      req.user.id
    ]);
    res.status(201).json({ farm: await serializeFarm(farm) });
  } catch (error) {
    if (error.message.includes("Boundary")) {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
});

farmsRouter.get("/", async (req, res, next) => {
  try {
    const farms = await all(
      "SELECT * FROM farms WHERE user_id = ? ORDER BY created_at DESC, id DESC",
      [req.user.id]
    );
    const serializedFarms = await Promise.all(farms.map(serializeFarm));
    res.json({ farms: serializedFarms });
  } catch (error) {
    next(error);
  }
});

farmsRouter.get("/:id", async (req, res, next) => {
  try {
    const farm = await get("SELECT * FROM farms WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id
    ]);

    if (!farm) {
      res.status(404).json({ message: "Farm not found." });
      return;
    }

    res.json({ farm: await serializeFarm(farm) });
  } catch (error) {
    next(error);
  }
});

farmsRouter.post("/:id/calculate", async (req, res, next) => {
  try {
    const farm = await get("SELECT * FROM farms WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id
    ]);

    if (!farm) {
      res.status(404).json({ message: "Farm not found." });
      return;
    }

    const boundary = JSON.parse(farm.boundary_geojson);
    const ndviMean = await calculateNdviForBoundary(boundary);
    const estimates = estimateCarbon(farm.area_acres, ndviMean);

    await run(
      `UPDATE farms
       SET ndvi_score = ?, tco2e_estimate = ?, earnings_estimate_inr = ?, status = 'calculated'
       WHERE id = ? AND user_id = ?`,
      [
        estimates.ndviScore,
        estimates.tco2eEstimate,
        estimates.earnings_estimate_inr,
        farm.id,
        req.user.id
      ]
    );

    const updatedFarm = await get("SELECT * FROM farms WHERE id = ? AND user_id = ?", [
      farm.id,
      req.user.id
    ]);
    res.json({ farm: await serializeFarm(updatedFarm) });
  } catch (error) {
    next(error);
  }
});

farmsRouter.post("/:id/mint", async (req, res, next) => {
  try {
    const { tokenId, contractAddress } = req.body;
    const farm = await get("SELECT * FROM farms WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id
    ]);

    if (!farm) {
      res.status(404).json({ message: "Farm not found." });
      return;
    }

    await run(
      `UPDATE farms SET nft_token_id = ?, nft_contract_address = ?, status = 'verified' WHERE id = ?`,
      [tokenId, contractAddress, farm.id]
    );

    const updatedFarm = await get("SELECT * FROM farms WHERE id = ?", [farm.id]);
    res.json({ farm: await serializeFarm(updatedFarm) });
  } catch (error) {
    next(error);
  }
});
