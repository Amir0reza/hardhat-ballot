import { ethers, getNamedAccounts } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"

const main = async (_to: Address) => {
  const voter = (await getNamedAccounts()).voter
  // const ballot = await ethers.getContract("Ballot", voter)

  const ballotFactory = await ethers.getContractFactory("Ballot")
  const ballot = ballotFactory.attach("0x07048F6Fc40C8cf962396e62D3D4dd83dB225a00")

  console.log(`Delegating vote from ${voter} to ${_to} ...`)

  const transactionResponse = await ballot.delegate(_to)
  await transactionResponse.wait(1)

  console.log("Vote delegated successfully !!!")
  console.log("__________________________________________________")
}


main(process.env.delegateTo!)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })