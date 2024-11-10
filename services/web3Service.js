// นำเข้า dependencies
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
console.log("Mnemonic:", process.env.MNEMONIC); // ตรวจสอบว่าโหลดค่า MNEMONIC ได้

// ดึงข้อมูล ABI และที่อยู่ของสัญญา
const contractABI = require('../src/abis/PointsSystem.json').abi;
const contractAddress = '0x09B08d88Dc38987A8a9e2315FF47B8DF1c8F7B86';

// ตั้งค่า HDWalletProvider พร้อมกับ mnemonic และ RPC URL
const provider = new HDWalletProvider({
    privateKeys: [
        "1ade856e918869905a865767b536faf16d671d9454e3d535a358d70ff64d79e8",
      ],
      providerOrUrl: "https://rpc-amoy.polygon.technology",
});

// สร้าง instance ของ Web3 และเชื่อมต่อกับ provider
const web3 = new Web3(provider);

// สร้าง instance ของ Smart Contract
const contract = new web3.eth.Contract(contractABI, contractAddress);
//console.log(contract);

module.exports = { web3, contract };
