import { ethers, getNamedAccounts } from "hardhat"
import { PROPOSALS } from '../deploy/01-deploy-ballot';

const main = async (_proposalIndex: number) => {
  const voter = (await getNamedAccounts()).voter
  const ballot = await ethers.getContract("Ballot", voter)

  console.log(`Voting with ${voter} to ${PROPOSALS[_proposalIndex]} ...`)

  const transactionResponse = await ballot.vote(_proposalIndex.toString())
  await transactionResponse.wait(1)

  console.log("Vote registered successfully !!!")
  console.log("__________________________________________________")
}


const proposalIndex: number = parseInt(process.env.proposalIndex!)
main(proposalIndex)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })