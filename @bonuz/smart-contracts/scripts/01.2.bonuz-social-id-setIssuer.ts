import hre from 'hardhat'

import { BonuzSocialId } from '../typechain-types'



async function main() {
  console.log('Running script to set the issuer of BonuzSocialId contract...')
  console.log(' ')

  const { deployments, ethers, getNamedAccounts, network } = hre

  //const contract: BonuzSocialId = await ethers.getContract('BonuzSocialId')
  // const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', '0x131FD47BD3ba332A945A2bAC967F6183D9a9A5F3') // polygon mumbai - deployed using mm metamask wallet
  const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', '0x9220070245b67130977FdF32acA4acdF6aD163cC') // base & core dao mainnet - deployed using jc metamask wallet
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

  const issuerAddresses = [
    '0xFA42bA87c81D3a45Ea7C590A596387b87CF4cB7D', // jc metamask
    '0xC026e8BD372030D190b14D0444b42B87dF3594db', // jc biconomy 
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
