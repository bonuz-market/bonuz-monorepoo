import hre from 'hardhat'

import { SUPPORTED_PLATFORMS } from '../helper-hardhat-config'
import { BonuzSocialId } from '../typechain-types'

async function main() {
  console.log('Running script to get the user profile and social links of BonuzSocialId contract...')
  console.log(' ')

  const { deployments, ethers, getNamedAccounts, network } = hre

  //const contract: BonuzSocialId = await ethers.getContract('BonuzSocialId')
  // const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', '0x131FD47BD3ba332A945A2bAC967F6183D9a9A5F3') // polygon mumbai - deployed using mm metamask wallet
  const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', '0x9220070245b67130977FdF32acA4acdF6aD163cC') // core dao mainnet - deployed using jc metamask wallet
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

  const address = '0xC026e8BD372030D190b14D0444b42B87dF3594db'
  const contractData = await contract?.getUserProfileAndSocialLinks(address, SUPPORTED_PLATFORMS)
  console.log('contractData', contractData)

  console.log('----------------------------------------------------')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
