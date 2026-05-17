import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { api } from "../api.js";
import { ethers } from "ethers";
import { AUCTION_ADDRESS } from "../contracts/addresses.js";
import AUCTION_ABI from "../contracts/CarbonAuction_abi.json";
import { Gavel, Clock, TrendingUp, Wallet, AlertCircle } from "lucide-react";

export function MarketplacePage() {
  const { token, user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    loadAuctions();
  }, [token]);

  async function loadAuctions() {
    try {
      const { auctions } = await api.listAuctions(token);
      setAuctions(auctions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleBid(auctionId, blockchainAuctionId, currentHighest) {
    setError("");
    const amount = bidAmounts[auctionId];
    if (!amount || parseFloat(amount) <= currentHighest) {
      setError("Bid must be higher than current highest.");
      return;
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AUCTION_ADDRESS, AUCTION_ABI, signer);

      const tx = await contract.placeBid(blockchainAuctionId, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();

      await api.placeBid(token, auctionId, { amountEth: parseFloat(amount) });
      await loadAuctions();
      setBidAmounts(prev => ({ ...prev, [auctionId]: "" }));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="p-10 text-center">Loading marketplace...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-10">
        <p className="terra-kicker">Transparent Trading</p>
        <h1 className="text-4xl font-black text-primary">Carbon Marketplace</h1>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Industries can bid on high-quality carbon credits directly from verified farmers. Every credit is a unique NFT on the blockchain.
        </p>
      </header>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-error-container text-on-error-container rounded-xl font-bold">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction.id} className="terra-card flex flex-col overflow-hidden">
            <div className="h-48 bg-primary/10 flex items-center justify-center relative">
              <TrendingUp size={48} className="text-primary/30" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm border border-primary/10">
                NFT # {auction.blockchainAuctionId}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary">{auction.farmName}</h3>
                  <p className="text-sm text-on-surface-variant">Seller: {auction.sellerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Current Bid</p>
                  <p className="text-lg font-black text-primary flex items-center gap-1">
                    {auction.highestBidEth || auction.minBidEth} <span className="text-xs">ETH</span>
                  </p>
                </div>
                <div className="bg-surface-container p-3 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-outline tracking-wider">Ends In</p>
                  <p className="text-sm font-bold text-primary flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(auction.endTime).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {user.role === 'buyer' ? (
                <div className="mt-auto space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount in ETH"
                      className="input flex-1"
                      value={bidAmounts[auction.id] || ""}
                      onChange={(e) => setBidAmounts(prev => ({ ...prev, [auction.id]: e.target.value }))}
                    />
                    <button
                      onClick={() => handleBid(auction.id, auction.blockchainAuctionId, auction.highestBidEth || auction.minBidEth)}
                      className="btn-primary"
                    >
                      <Gavel size={18} />
                      Bid
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-auto p-3 bg-surface-container-low rounded-xl text-center text-sm font-medium text-outline">
                  Farmers can view only. Switch to Buyer account to bid.
                </div>
              )}
            </div>
          </div>
        ))}
        {auctions.length === 0 && (
          <div className="col-span-full py-20 text-center terra-card">
            <TrendingUp size={48} className="mx-auto text-outline mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-outline">No active auctions</h3>
            <p className="text-on-surface-variant">Check back later for new carbon credit listings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
