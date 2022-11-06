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
    let deployer: SignerWithAddress,
      voter1: SignerWithAddress,
      voter2: SignerWithAddress,
      voter3: SignerWithAddress,
      voter4: SignerWithAddress,
      voter5: SignerWithAddress,
      attacker: SignerWithAddress

    beforeEach(async function () {
      const accounts = await ethers.getSigners()
      deployer = accounts[0]
      voter1 = accounts[1]
      voter2 = accounts[2]
      voter3 = accounts[3]
      voter4 = accounts[4]
      voter5 = accounts[5]
      attacker = accounts[6]
      await deployments.fixture(["all"])
      ballot = await ethers.getContract("Ballot", deployer)
    })

    describe("Constructor", function () {
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

    describe("When the chairperson interacts with the giveRightToVote function in the contract", function () {
      it("Gives right to vote for another address", async function () {
        await ballot.giveRightToVote(voter1.address)
        const voter1VotingWeight = (await ballot.voters(voter1.address)).weight
        expect(voter1VotingWeight.toString()).to.eq("1")
      })

      it("Can not give right to vote for someone that has voted", async function () {
        await ballot.giveRightToVote(voter1.address)
        await ballot.connect(voter1).vote(3)
        await expect(ballot.giveRightToVote(voter1.address)).to.be.revertedWith(
          "The voter already voted."
        )
      })

      it("Can not give right to vote for someone that has already voting rights", async function () {
        await ballot.giveRightToVote(voter1.address)
        await expect(ballot.giveRightToVote(voter1.address)).to.be.reverted
      })
    })

    describe("When the voter interact with the vote function in the contract", function () {
      it("Should register the vote", async () => {
        await ballot.giveRightToVote(voter1.address)
        await ballot.connect(voter1).vote(3)
        const proposalWeight = (await ballot.proposals(3)).voteCount
        expect(proposalWeight.toString()).to.eq("1")
      })
    })

    describe("When the voter interact with the delegate function in the contract", function () {
      it("Should transfer voting power", async () => {
        await ballot.giveRightToVote(voter1.address)
        await ballot.giveRightToVote(voter2.address)
        await ballot.connect(voter2).delegate(voter1.address)
        const voter1VotingWeight = (await ballot.voters(voter1.address)).weight
        expect(voter1VotingWeight.toString()).to.eq("2")
      })
    })

    describe("When the an attacker interact with the giveRightToVote function in the contract", function () {
      it("Should revert", async () => {
        await expect(
          ballot.connect(attacker).giveRightToVote(voter1.address)
        ).to.be.rejectedWith("Only chairperson can give right to vote.")
      })
    })

    describe("When the an attacker interact with the vote function in the contract", function () {
      it("Should revert", async () => {
        await expect(ballot.connect(attacker).vote(1)).to.be.revertedWith(
          "Has no right to vote"
        )
      })
    })

    describe("When the an attacker interact with the delegate function in the contract", function () {
      it("Should revert", async () => {
        await expect(
          ballot.connect(attacker).delegate(voter1.address)
        ).to.be.revertedWith("You have no right to vote")
      })
    })

    describe("When someone interact with the winningProposal function before any votes are cast", function () {
      it("Should return 0", async () => {
        const winningProposal = await ballot.winningProposal()
        expect(winningProposal.toString()).to.eq("0")
      })
    })

    describe("When someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
      it("Should return 0", async () => {
        await ballot.giveRightToVote(voter1.address)
        await ballot.connect(voter1).vote(0)
        const winningProposal = await ballot.winningProposal()
        expect(winningProposal.toString()).to.eq("0")
      })
    })

    describe("When someone interact with the winnerName function before any votes are cast", function () {
      it("Should return name of proposal 0", async () => {
        const winningProposalName = await ballot.winnerName()
        expect(ethers.utils.parseBytes32String(winningProposalName)).to.eq(
          PROPOSALS[0]
        )
      })
    })

    describe("When someone interact with the winnerName function after one vote is cast for the first proposal", function () {
      it("should return name of proposal 0", async () => {
        await ballot.giveRightToVote(voter1.address)
        await ballot.connect(voter1).vote(0)
        const winningProposalName = await ballot.winnerName()
        expect(ethers.utils.parseBytes32String(winningProposalName)).to.eq(
          PROPOSALS[0]
        )
      })
    })

    describe("When someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
      it("Should return the name of the winner proposal", async () => {
        await ballot.giveRightToVote(voter1.address)
        await ballot.giveRightToVote(voter2.address)
        await ballot.giveRightToVote(voter3.address)
        await ballot.giveRightToVote(voter4.address)
        await ballot.giveRightToVote(voter5.address)
        await ballot.connect(voter1).vote(1)
        await ballot.connect(voter2).vote(3)
        await ballot.connect(voter3).vote(3)
        await ballot.connect(voter4).vote(3)
        await ballot.connect(voter5).vote(2)
        const winningProposalName = await ballot.winnerName()
        expect(ethers.utils.parseBytes32String(winningProposalName)).to.eq(
          PROPOSALS[3]
        )
      })
    })

    describe("When 4 voters delegate to voter1 and voter 1 vote for proposal 2", function () {
      it("Should return the name of the proposal 2", async () => {
        await ballot.giveRightToVote(voter1.address)
        await ballot.giveRightToVote(voter2.address)
        await ballot.giveRightToVote(voter3.address)
        await ballot.giveRightToVote(voter4.address)
        await ballot.giveRightToVote(voter5.address)
        await ballot.connect(voter2).delegate(voter1.address)
        await ballot.connect(voter3).delegate(voter1.address)
        await ballot.connect(voter4).delegate(voter1.address)
        await ballot.connect(voter5).delegate(voter1.address)
        await ballot.connect(voter1).vote(2)
        const winningProposalName = await ballot.winnerName()
        expect(ethers.utils.parseBytes32String(winningProposalName)).to.eq(
          PROPOSALS[2]
        )
      })
    })
  })
}
