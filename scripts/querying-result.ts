import { ethers } from "hardhat"
import { Ballot__factory } from '../typechain-types/factories/Ballot__factory';

const main = async () => {
  // const ballot = await ethers.getContract("Ballot")

  const ballotFactory = await ethers.getContractFactory("Ballot")
  const ballot = ballotFactory.attach("0x07048F6Fc40C8cf962396e62D3D4dd83dB225a00")

  const winnerProposalIndex = await ballot.winningProposal()
  const winnerProposal = await ballot.winnerName()
  const numberOfVotes = ((await ballot.proposals(winnerProposalIndex)).voteCount).toString()

  console.log(`Proposal number ${winnerProposalIndex} which was ${winnerProposal} won with total votes of ${numberOfVotes}!!!`)
  console.log("__________________________________________________")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
