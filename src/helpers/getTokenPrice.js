const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const { ethers } = require("ethers");
const BigNumber = require("bignumber.js");
require("dotenv").config();

const getTokenPrice = async (address1, amount) => {
  console.log("hello");

  const address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.token.getTokenPrice({
    address: address1,
    chain,
  });
  console.log(response);
  const priceInEth = response.toJSON().nativePrice.value;
  const decimals = response.toJSON().tokenDecimals;
  const value = parseFloat(
    parseFloat(ethers.utils.formatUnits(amount, decimals)).toFixed(2)
  );
  console.log(value);
  // const valueBn = new BigNumber(value);
  // const amountBn = new BigNumber(amount);
  // const final_amount = valueBn * amountBn;
  // console.log("Final price:", final_amount);
  return value;
};

module.exports = getTokenPrice;
// getTokenPrice();

800000000;
