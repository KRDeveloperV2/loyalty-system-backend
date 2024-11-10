require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const providerAmoy = new HDWalletProvider({
  privateKeys: [
    "1ade856e918869905a865767b536faf16d671d9454e3d535a358d70ff64d79e8",
  ],
  providerOrUrl: "https://rpc-amoy.polygon.technology",
});

module.exports = {
  contracts_directory: "./contracts/", // ตำแหน่งไฟล์ .sol ของ Smart Contracts
  contracts_build_directory: "./src/abis/", // ตำแหน่งเก็บ ABI หลังจาก compile

  networks: {
    pointAmoy: {
      provider: () => providerAmoy,
      network_id: "80002", // Polygon Mainnet ID
      port: 80002,
      gas: 8000000, // Increase gas limit
      gasPrice: 30000000000, // 30 Gwei
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.21",
    }
  },
};
