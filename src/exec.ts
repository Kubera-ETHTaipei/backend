/* eslint-disable no-console */
import * as cleapi from "@ora-io/cle-api"
import * as fs from "node:fs"
import { ethers } from "ethers"
// import { loadYamlFromPath } from "@ora-io/cle-api";
;(global as any).__BROWSER__ = false

interface NetworksConfig {
  mainnet?: any // Optional
  sepolia?: any // Optional
  goerli?: any // Optional
}
const networkConfig: NetworksConfig = {
  sepolia: "https://eth-sepolia.public.blastapi.io",
}

const config = {
  JsonRpcProviderUrl: {
    // Erigon node rpc are highly recommended here.
    mainnet: "https://rpc.ankr.com/eth",
    sepolia: "https://eth-sepolia.public.blastapi.io",
  },
  UserPrivateKey: "0x{key}",
}

const execOptionsForEvent = {
  wasmPath: __dirname + "/cle.wasm",
  yamlPath: __dirname + "/cle.yaml",
  //   local: false,
}

function loadConfigByNetwork(
  yaml: cleapi.CLEYaml,
  networksConfig: NetworksConfig,
  isDataSource: boolean
) {
  let network: string | undefined
  if (yaml.dataSources?.[0].kind !== "ethereum")
    throw new Error("loadConfigByNetwork only support ethereum right now.")

  // For exec and prove, we need to load the data source network
  if (isDataSource) network = yaml.dataSources?.[0].network
  // For publish & verify, we need to load the data destination network
  else network = yaml.dataDestinations?.[0].network

  // TODO: move health check
  if (!network) {
    throw new Error(
      `Network of "${
        isDataSource ? "dataSource" : "dataDestination"
      }" is not defined in yaml.`
    )
  }

  // Check if the network is defined in constants.
  // const targetNetwork = getTargetNetwork(network)?.name.toLowerCase()
  // let targetConfig = ''
  // if (targetNetwork) {
  const targetConfig = networksConfig
    ? (networksConfig as any)[network]
    : undefined
  // }

  if (!targetConfig) {
    throw new Error(
      `[-] networksConfig for network "${network}" is not found in zkgraph-api.`
    )
  }

  return targetConfig
}

export async function Exec(execBlockid: number) {
  const { wasmPath, yamlPath } = execOptionsForEvent

  const wasm = fs.readFileSync(wasmPath, "utf-8")
  const wasmUint8Array = new TextEncoder().encode(wasm)
  // new Uint8Array(wasm);
  const yamlContent = fs.readFileSync(yamlPath, "utf-8")
  const yaml = cleapi.CLEYaml.fromYamlContent(yamlContent)
  const dsp = cleapi.dspHub.getDSPByYaml(yaml, {})

  const jsonRpcUrl = loadConfigByNetwork(yaml, config.JsonRpcProviderUrl, true)
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const generalParams = {
    provider,
    // blockId: loadConfigByNetwork(yaml, blocknumForStorageTest, true), // for storage
    blockId: execBlockid, // for event
    // blockId: loadConfigByNetwork(yaml, networkConfig, true),
  }

  const execParams = dsp?.toExecParams(generalParams)

  const state = await cleapi.execute(
    { wasmUint8Array, cleYaml: yaml },
    execParams as any
  )

  return Buffer.from(state).toString("hex")
}
