import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "hardhat-gas-reporter"
import "dotenv/config"
import "hardhat-deploy"
import "solidity-coverage"
import fs from "fs-extra"
import { ethers } from "ethers"

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL!.toString()

const encryptedJson =
  fs.readFileSync("./encrypted-publicTest.json", "utf8") || "emptry"
let PRIVATE_KEY: string, PRIVATE_KEY1: string, PRIVATE_KEY2: string
const PASSWORD: string = process.env.WAL_PASS || "No pass provided"
if (PASSWORD != "No pass provided") {
  PRIVATE_KEY = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    PASSWORD
  ).privateKey
  PRIVATE_KEY1 =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690c"
  PRIVATE_KEY2 =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690e"
} else {
  PRIVATE_KEY =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
  PRIVATE_KEY1 =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690c"
  PRIVATE_KEY2 =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690e"
}

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY1, PRIVATE_KEY2],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: true,
    // outputFile: "gas-report.txt",
    // noColors: true,
    currency: "USD",
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
  namedAccounts: {
    deployer: {
      default: 0,
      5: 0, // ==> for example for goerli chainId it's second account
    },
  },
}

export default config
