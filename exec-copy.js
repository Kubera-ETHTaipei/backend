"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exec = void 0;
/* eslint-disable no-console */
var cleapi = require("@ora-io/cle-api");
var fs = require("node:fs");
var ethers_1 = require("ethers");
// import { loadYamlFromPath } from "@ora-io/cle-api";
global.__BROWSER__ = false;
var networkConfig = {
  sepolia: "https://eth-sepolia.public.blastapi.io",
};
var config = {
  JsonRpcProviderUrl: {
    // Erigon node rpc are highly recommended here.
    mainnet: "https://eth.llamarpc.com",
    sepolia: "https://eth-sepolia.public.blastapi.io",
  },
  UserPrivateKey: "0x{key}",
};
var execOptionsForEvent = {
  wasmPath: __dirname + "/cle.wasm",
  yamlPath: __dirname + "/cle.yaml",
  //   local: false,
};
function loadConfigByNetwork(yaml, networksConfig, isDataSource) {
  var _a, _b, _c;
  var network;
  if (
    ((_a = yaml.dataSources) === null || _a === void 0
      ? void 0
      : _a[0].kind) !== "ethereum"
  )
    throw new Error("loadConfigByNetwork only support ethereum right now.");
  // For exec and prove, we need to load the data source network
  if (isDataSource)
    network =
      (_b = yaml.dataSources) === null || _b === void 0
        ? void 0
        : _b[0].network;
  // For publish & verify, we need to load the data destination network
  else
    network =
      (_c = yaml.dataDestinations) === null || _c === void 0
        ? void 0
        : _c[0].network;
  // TODO: move health check
  if (!network) {
    throw new Error(
      'Network of "'.concat(
        isDataSource ? "dataSource" : "dataDestination",
        '" is not defined in yaml.'
      )
    );
  }
  // Check if the network is defined in constants.
  // const targetNetwork = getTargetNetwork(network)?.name.toLowerCase()
  // let targetConfig = ''
  // if (targetNetwork) {
  var targetConfig = networksConfig ? networksConfig[network] : undefined;
  // }
  if (!targetConfig) {
    throw new Error(
      '[-] networksConfig for network "'.concat(
        network,
        '" is not found in zkgraph-api.'
      )
    );
  }
  return targetConfig;
}
async function Exec(execBlockid) {
  return __awaiter(this, void 0, void 0, function () {
    var wasmPath,
      yamlPath,
      wasm,
      wasmUint8Array,
      yamlContent,
      yaml,
      dsp,
      jsonRpcUrl,
      provider,
      generalParams,
      execParams,
      state;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          (wasmPath = execOptionsForEvent.wasmPath),
            (yamlPath = execOptionsForEvent.yamlPath);
          wasm = fs.readFileSync(wasmPath);
          wasmUint8Array = new Uint8Array(wasm);
          yamlContent = fs.readFileSync(yamlPath);
          yaml = cleapi.CLEYaml.fromYamlContent(yamlContent);
          dsp = cleapi.dspHub.getDSPByYaml(yaml, {});
          jsonRpcUrl = loadConfigByNetwork(
            yaml,
            config.JsonRpcProviderUrl,
            true
          );
          provider = new ethers_1.ethers.providers.JsonRpcProvider(jsonRpcUrl);
          generalParams = {
            provider: provider,
            // blockId: loadConfigByNetwork(yaml, blocknumForStorageTest, true), // for storage
            blockId: execBlockid, // for event
            // blockId: loadConfigByNetwork(yaml, networkConfig, true),
          };
          execParams =
            dsp === null || dsp === void 0
              ? void 0
              : dsp.toExecParams(generalParams);
          return [
            4 /*yield*/,
            cleapi.execute(
              { wasmUint8Array: wasmUint8Array, cleYaml: yaml },
              execParams
            ),
          ];
        case 1:
          state = _a.sent();
          return [2 /*return*/, state];
      }
    });
  });
}
exports.Exec = Exec;
