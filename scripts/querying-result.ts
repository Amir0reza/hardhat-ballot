import { ethers, getNamedAccounts } from "hardhat"

const main = async () => {
  const deployer = (await getNamedAccounts()).deployer
  const ballot = await ethers.getContract("Ballot", deployer)

  const winnerProposalIndex = await ballot.winningProposal()
  const winnerProposal = ethers.utils.parseBytes32String((await ballot.winnerName()))

  console.log(`Proposal number ${winnerProposalIndex} which was ${winnerProposal} won!!!`)
  console.log("__________________________________________________")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
