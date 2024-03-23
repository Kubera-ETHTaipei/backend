const express = require("express")
const cors = require("cors")
const app = express()
const port = 3002

app.use(cors())

const { Exec } = require("./exec.js")
const { ethers } = require("ethers")
const getTokenPrice = require("./helpers/getTokenPrice.js")
const Moralis = require("moralis").default
const {
  insertIntoTableTransaction,
  updateTableTransaction,
} = require("./contract.js")
// const cors = require("cors");
// const bodyParser = require("body-parser");
// app.use(
//   cors({
//     origin: "http://localhost:3000", // replace with the origin you want to allow
//   })
// );
// app.use(bodyParser.json());

// const { mintNFT } = require("./mintNFT");

app.post("/insert", async (req, res) => {
  console.log(req.query, typeof req.query.blockNum)
  const blockNum = parseInt(req.query.blockNum)
  const address = req.query.address
  console.log(blockNum, typeof blockNum)
  let borrowed = 0
  let temp = null
  //19445162
  //19445193
  try {
    for (let i = blockNum; i <= 19474082; i++) {
      console.log("running block", i)
      try {
        await Exec(i).then((ret) => {
          temp = ret
        })
      } catch (error) {
        console.log(error)
        continue
      }
      console.log("HIHIHIIIHi")
      let data = temp.substring(24)
      let reserve = data.toString().substring(0, 40)
      let data2 = data.substring(40)
      let user = data2.toString().substring(0, 40)
      let amount = data2.substring(64)
      let parse_data = BigInt("0x" + amount)
      console.log(parse_data)
      let final_value = await getTokenPrice(reserve, parse_data)
      borrowed = borrowed + final_value
      console.log("the log:", borrowed)
    }
    console.log("Process completed successfully")
    if (borrowed > 0) {
      console.log("Borrowed:", borrowed)
      await insertIntoTableTransaction(address, borrowed)
    }
  } catch (error) {
    console.log("the error:", error)
  }

  res.status(200).send(borrowed.toString())
})

app.post("/update", async (req, res) => {
  console.log(req.query, typeof req.query.blockNum)
  const blockNum = parseInt(req.query.blockNum)
  const address = req.query.address
  console.log(blockNum, typeof blockNum)
  let borrowed = 0
  let temp = null
  //19445162
  //19445193
  try {
    for (let i = blockNum; i <= 19474082; i++) {
      console.log("running block", i)
      try {
        await Exec(i).then((ret) => {
          temp = ret
        })
      } catch (error) {
        console.log(error)
        continue
      }
      console.log("HIHIHIIIHi")
      let data = temp.substring(24)
      let reserve = data.toString().substring(0, 40)
      let data2 = data.substring(40)
      let user = data2.toString().substring(0, 40)
      if (user != address) {
        continue
      }
      let amount = data2.substring(64)
      let parse_data = BigInt("0x" + amount)
      console.log(parse_data)
      let final_value = await getTokenPrice(reserve, parse_data)

      borrowed = borrowed + final_value
      console.log("the log:", borrowed)
    }
    console.log("Process completed successfully")
    if (borrowed > 0) {
      console.log("Borrowed:", borrowed)
      await updateTableTransaction(address, borrowed)
    }
  } catch (error) {
    console.log("the error:", error)
  }

  res.status(200).send(borrowed.toString())
})

app.listen(port, async () => {
  console.log(__dirname + "cle.yaml")
  console.log(`Server is running on http://localhost:${port}`)
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  })
})
