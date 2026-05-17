import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const CarbonCreditNFT = await ethers.getContractFactory("CarbonCreditNFT");
  const nft = await CarbonCreditNFT.deploy(deployer.address);
  await nft.waitForDeployment();
  console.log("CarbonCreditNFT deployed to:", await nft.getAddress());

  const CarbonAuction = await ethers.getContractFactory("CarbonAuction");
  const auction = await CarbonAuction.deploy();
  await auction.waitForDeployment();
  console.log("CarbonAuction deployed to:", await auction.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
