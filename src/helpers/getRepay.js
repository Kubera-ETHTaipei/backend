const getTokenPrice = require("./getTokenPrice.js");

const getRepay = async (address, blockNum) => {
  console.log("repay");
  try {
    await RepayExec(blockNum).then((ret) => {
      repayTemp = ret;
    });
  } catch (error) {
    console.log(error);
    return 0;
  }
  console.log("RPAYYYYYY");
  let data = temp.substring(24);

  let reserve = "0x" + data.toString().substring(0, 40);
  let data2 = data.substring(64);
  let user = "0x" + data2.toString().substring(0, 40);
  if (user != address.toLowerCase()) {
    return 0;
  }
  let amount = data2.substring(64);
  let parse_data = BigInt("0x" + amount);
  console.log(parse_data);
  let final_value = await getTokenPrice(reserve, parse_data);
  return final_value;
};

module.exports = getRepay;
