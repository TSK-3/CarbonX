import express from "express";
import { all, get, run } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

export const auctionsRouter = express.Router();

auctionsRouter.use(requireAuth);

function serializeAuction(auction) {
  return {
    id: auction.id,
    farmId: auction.farm_id,
    sellerId: auction.seller_id,
    blockchainAuctionId: auction.blockchain_auction_id,
    minBidEth: auction.min_bid_eth,
    endTime: auction.end_time,
    status: auction.status,
    highestBidderId: auction.highest_bidder_id,
    highestBidEth: auction.highest_bid_eth,
    createdAt: auction.created_at,
    farmName: auction.farm_name,
    sellerName: auction.seller_name,
    highestBidderName: auction.highest_bidder_name
  };
}

auctionsRouter.get("/", async (req, res, next) => {
  try {
    const auctions = await all(`
      SELECT a.*, f.name as farm_name, u1.name as seller_name, u2.name as highest_bidder_name
      FROM auctions a
      JOIN farms f ON a.farm_id = f.id
      JOIN users u1 ON a.seller_id = u1.id
      LEFT JOIN users u2 ON a.highest_bidder_id = u2.id
      WHERE a.status = 'active'
      ORDER BY a.created_at DESC
    `);
    res.json({ auctions: auctions.map(serializeAuction) });
  } catch (error) {
    next(error);
  }
});

auctionsRouter.post("/", async (req, res, next) => {
  try {
    const { farmId, blockchainAuctionId, minBidEth, endTime } = req.body;

    if (!farmId || !minBidEth || !endTime) {
      res.status(400).json({ message: "Missing required auction fields." });
      return;
    }

    const farm = await get("SELECT * FROM farms WHERE id = ? AND user_id = ?", [farmId, req.user.id]);
    if (!farm) {
      res.status(404).json({ message: "Farm not found or not owned by you." });
      return;
    }

    const result = await run(
      `INSERT INTO auctions (farm_id, seller_id, blockchain_auction_id, min_bid_eth, end_time, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [farmId, req.user.id, blockchainAuctionId, minBidEth, endTime]
    );

    const auction = await get("SELECT * FROM auctions WHERE id = ?", [result.id]);
    res.status(201).json({ auction: serializeAuction(auction) });
  } catch (error) {
    next(error);
  }
});

auctionsRouter.post("/:id/bid", async (req, res, next) => {
  try {
    const { amountEth } = req.body;
    const auctionId = req.params.id;

    if (!amountEth) {
      res.status(400).json({ message: "Bid amount is required." });
      return;
    }

    const auction = await get("SELECT * FROM auctions WHERE id = ?", [auctionId]);
    if (!auction) {
      res.status(404).json({ message: "Auction not found." });
      return;
    }

    if (auction.status !== 'active') {
      res.status(400).json({ message: "Auction is no longer active." });
      return;
    }

    if (amountEth <= auction.highest_bid_eth) {
      res.status(400).json({ message: "Bid must be higher than the current highest bid." });
      return;
    }

    await run(
      `UPDATE auctions SET highest_bidder_id = ?, highest_bid_eth = ? WHERE id = ?`,
      [req.user.id, amountEth, auctionId]
    );

    const updatedAuction = await get("SELECT * FROM auctions WHERE id = ?", [auctionId]);
    res.json({ auction: serializeAuction(updatedAuction) });
  } catch (error) {
    next(error);
  }
});
