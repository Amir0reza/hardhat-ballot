import { ethers, getNamedAccounts } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"

const main = async (_to: Address) => {
  const deployer = (await getNamedAccounts()).deployer
  // const ballot = await ethers.getContract("Ballot", deployer)

  const ballotFactory = await ethers.getContractFactory("Ballot")
  const ballot = ballotFactory.attach("0x07048F6Fc40C8cf962396e62D3D4dd83dB225a00")

  console.log(`Giving voting rights to ${_to} ...`)
  
  const transactionResponse = await ballot.giveRightToVote(_to)
  await transactionResponse.wait(1)

  console.log("Voting right granted !!!")
  console.log("__________________________________________________")
}

main(process.env.give_right_to!)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
