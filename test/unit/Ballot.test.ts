import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai";
import { deployments, ethers } from "hardhat"
import { Ballot } from '../../typechain-types/Ballot';

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
    it("It has provided some prposals", async function () {
      
    })

    it("sets the deployer address as chairperson", async function () {
      const chairperson = await ballot.chairperson()
      expect(chairperson).to.eq(deployer.address)
    })
  })
})
