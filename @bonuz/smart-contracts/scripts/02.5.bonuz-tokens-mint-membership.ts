import hre from 'hardhat'

import { developmentChains } from '../helper-hardhat-config'
import { BonuzTokens } from '../typechain-types'

async function main() {
  console.log('Running script to mint a Membership...')
  console.log(' ')

  const { deployments, ethers, getNamedAccounts, network } = hre

  if (developmentChains.includes(network.name)) await deployments.fixture(['BonuzTokens']) //? deploy BonuzTokensDraft3 contract if it is not already deployed

  // const contract: BonuzTokens = await ethers.getContract('BonuzTokens')
  const contract: BonuzTokens = await ethers.getContractAt(
    'BonuzTokens',
    '0x2A945B46EE2c6B8BAC319514d5EcdEdf2CBB607b'
  )
  const owner = await contract.owner()

  const [caller] = await ethers.getSigners()

  const callerAddr = caller.address
  const isAdmin = await contract.isAdmin(callerAddr)
  const isIssuer = await contract.isIssuer(callerAddr)

  console.log({
    owner,
    callerAddr,
    isAdmin,
    isIssuer
  })

  //* MINT
  const to = '0xA11Ff149080a7EdD1c444E1F01b791cD48a53B80' // muzzamil

  const metadata = {
    tokenType: 'MEMBERSHIP',
    name: 'Membership Sample',
    desc: 'Membership',
    imageURL: 'ipfs://bafybeie6ugzqeh4pbf4avtwnlwiltd6p3z7rzuabizzkqg563gnc3z4upa/Membership',
    isSoulBound: false,
    redeemDate: 0,
    expiryDate: 0,
    points: 0
  }


  const tx = await contract.connect(caller)
    .mint(
      to,
      metadata.tokenType,
      metadata.name,
      metadata.desc,
      metadata.imageURL,
      metadata.isSoulBound,
      metadata.expiryDate,
      metadata.points,
    )
  const receipt = await tx.wait()

  console.log('----------------------------------------------------')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
