import { ethers, getNamedAccounts } from "hardhat"

const main = async () => {
  const accounts = await ethers.getSigners()
  // const ballot = await ethers.getContract("Ballot")

  const deployer = accounts[0]
  const ballotFactory = await ethers.getContractFactory("Ballot")
  const ballot = ballotFactory.attach(
    "0x07048F6Fc40C8cf962396e62D3D4dd83dB225a00"
  )

  const tx = await deployer.sendTransaction({ to: ballot.address, data: "0x0000" })
  await tx.wait(1)
  console.log(`New chair person is ${deployer.address} !!!`)
  console.log("__________________________________________________")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
