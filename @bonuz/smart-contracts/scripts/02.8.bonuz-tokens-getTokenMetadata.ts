import hre from 'hardhat'

import { developmentChains } from '../helper-hardhat-config'
import { BonuzTokens } from '../typechain-types'

async function main() {
  console.log('Running script 02.8.bonuz-tokens-getTokenMetadata.ts...')
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

  const tokenIds = [56]
  for (const tokenId of tokenIds) {
    const tokenMetadata = await contract.getTokenMetadata(tokenId)
    console.log({ tokenMetadata })
  }



  console.log('----------------------------------------------------')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
