const { ethers } = require("ethers")
const contractAddress = ""
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_protocol",
        type: "address",
      },
    ],
    name: "add_trusted_protocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainid",
        type: "uint256",
      },
    ],
    name: "ChainNotSupported",
    type: "error",
  },
  {
    inputs: [],
    name: "createTable",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "credit",
        type: "uint256",
      },
    ],
    name: "insertIntoTable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "StringsInsufficientHexLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "credit",
        type: "uint256",
      },
    ],
    name: "updateTable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "_tableId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTableId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTableName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "trusted_protocols",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]
require("dotenv").config()
const provider = ethers.getDefaultProvider((network = "sepolia"))
const contract = new ethers.Contract(contractAddress, abi, provider)
const wallet = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider)
console.log("wallet address:", wallet.address)

async function insertIntoTableTransaction(address, credit) {
  console.log("HI I am in INssert INto ")
  console.log(address, credit)
  const contractWithSigner = contract.connect(wallet)
  const tx = await contractWithSigner.insertIntoTable(address, credit)
  const receipt = await tx.wait()
  console.log(receipt)
}
async function updateTableTransaction(address, credit) {
  const contractWithSigner = contract.connect(wallet)
  const tx = await contractWithSigner.updateTable(address, credit)
  const receipt = await tx.wait()
  console.log(receipt)
}

module.exports = {
  insertIntoTableTransaction,
  updateTableTransaction,
}
