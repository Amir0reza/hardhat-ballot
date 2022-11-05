import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { deployments, ethers, network } from "hardhat"
import { Ballot } from "../../typechain-types/Ballot"
import { PROPOSALS } from "../../deploy/01-deploy-ballot"

const chainId = network.config.chainId

if (chainId != 31337) {
  describe.skip
} else {
  describe("Ballot contract", function () {
    let ballot: Ballot
    let deployer: SignerWithAddress
    beforeEach(async function () {
      const accounts = await ethers.getSigners()
      deployer = accounts[0]
      await deployments.fixture(["all"])
      ballot = await ethers.getContract("Ballot", deployer)
    })

    describe("Constructor", async function () {
      it("Sets the deployer address as chairperson", async () => {
        const chairperson = await ballot.chairperson()
        expect(chairperson).to.eq(deployer.address)
      })

      it("Set voting weight of chairperson to 1", async () => {
        const chairperson = await ballot.chairperson()
        const chairpersonVotingWeight = (await ballot.voters(chairperson))
          .weight
        expect(chairpersonVotingWeight.toString()).to.eq("1")
      })

      it("It has provided some proposals", async () => {
        for (let index = 0; index < PROPOSALS.length; index++) {
          const proposalName = (await ballot.proposals(index)).name
          expect(ethers.utils.parseBytes32String(proposalName)).to.eq(
            PROPOSALS[index]
          )
        }
      })

      it("All proposals has zero votes", async () => {
        for (let index = 0; index < PROPOSALS.length; index++) {
          const proposalVoteCount = (await ballot.proposals(index)).voteCount
          expect(proposalVoteCount.toString()).to.eq("0")
        }
      })
    })
  })
}
