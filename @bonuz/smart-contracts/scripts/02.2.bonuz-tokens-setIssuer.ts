import hre from 'hardhat'

import { developmentChains } from '../helper-hardhat-config'
import { BonuzTokens } from '../typechain-types'

async function main() {
  console.log('Running script to set the issuers of BonuzTokens contract...')
  console.log(' ')

  const { deployments, ethers, getNamedAccounts, network } = hre

  if (developmentChains.includes(network.name)) await deployments.fixture(['BonuzTokens']) //? deploy BonuzTokensDraft3 contract if it is not already deployed

  // const contract: BonuzTokens = await ethers.getContract('BonuzTokens')
  const contract: BonuzTokens = await ethers.getContractAt(
    'BonuzTokens',
    '0xf13d5259421D84C56A886a6e4F18814555eEb24c'
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

  //* ISSUER
  const issuerAddresses = [
    '0xFA42bA87c81D3a45Ea7C590A596387b87CF4cB7D', // jc metamask
    '0xC026e8BD372030D190b14D0444b42B87dF3594db' // jc biconomy
  ]

  for (const issuerAddress of issuerAddresses) {
    const isIssuer = await contract.isIssuer(issuerAddress)

    if (isIssuer) {
      console.log('Already Issuer:', issuerAddress)
    } else {
      console.log('Setting Issuer:', issuerAddress)
      const tx = await contract.connect(caller).setIssuer(issuerAddress, true)
      await tx.wait()
    }
  }

  console.log('----------------------------------------------------')

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
