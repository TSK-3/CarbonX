// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CarbonAuction is ReentrancyGuard {
    struct Auction {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 minBid;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool active;
        bool ended;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCount;

    mapping(uint256 => mapping(address => uint256)) public pendingReturns;

    event AuctionCreated(uint256 auctionId, address seller, address nftAddress, uint256 tokenId, uint256 minBid, uint256 endTime);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);

    function createAuction(address _nftAddress, uint256 _tokenId, uint256 _minBid, uint256 _duration) external {
        IERC721 nft = IERC721(_nftAddress);
        require(nft.ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(nft.getApproved(_tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)), "Not approved");

        nft.transferFrom(msg.sender, address(this), _tokenId);

        auctionCount++;
        auctions[auctionCount] = Auction({
            seller: msg.sender,
            nftAddress: _nftAddress,
            tokenId: _tokenId,
            minBid: _minBid,
            endTime: block.timestamp + _duration,
            highestBidder: address(0),
            highestBid: 0,
            active: true,
            ended: false
        });

        emit AuctionCreated(auctionCount, msg.sender, _nftAddress, _tokenId, _minBid, auctions[auctionCount].endTime);
    }

    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value >= auction.minBid, "Bid too low");
        require(msg.value > auction.highestBid, "Bid lower than current highest");

        if (auction.highestBidder != address(0)) {
            pendingReturns[_auctionId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction not ended yet");

        auction.active = false;
        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            IERC721(auction.nftAddress).transferFrom(address(this), auction.highestBidder, auction.tokenId);
            payable(auction.seller).transfer(auction.highestBid);
        } else {
            IERC721(auction.nftAddress).transferFrom(address(this), auction.seller, auction.tokenId);
        }

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }

    function withdraw(uint256 _auctionId) external nonReentrant {
        uint256 amount = pendingReturns[_auctionId][msg.sender];
        require(amount > 0, "Nothing to withdraw");

        pendingReturns[_auctionId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
