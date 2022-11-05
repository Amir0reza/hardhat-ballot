import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ethers, network } from 'hardhat';

const PROPOSALS = ["Chocolate", "Vanilla", "Lemon", "Almond"]

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = []
    for (let i =0; i < array.length; i++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[i]))
    }
    return bytes32Array
}

const deployBallot: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
  ) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
  
    const { deployer } = await getNamedAccounts()
    console.log(`The deployer address is: ${deployer}`);

    const chainId = network.config.chainId;
    
    let args = [convertStringArrayToBytes32(PROPOSALS)]
    log("Deploying Ballot and waiting for confirmations...")
    const ballot = await deploy("Ballot", {
      from: deployer,
      log: true,
      args: args,
      waitConfirmations: 1,
    })
    log(`Ballot deployed at ${ballot.address}`)
  }
  
  export default deployBallot
  deployBallot.tags = ["all", "ballot"]