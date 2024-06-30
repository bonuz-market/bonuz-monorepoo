import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from '../helper-hardhat-config'
import verify from '../utils/verify'
import { ethers } from 'hardhat'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  // const { deployer, bob, alice, trudy } = await getNamedAccounts()
  const accounts = await ethers.getSigners()
  const [deployer] = accounts


  const chainId: number = network.config.chainId!

  log('----------------------------------------------------')
  log('Deploying BonuzTokens')

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const args: any = []

  const contract = await deploy('BonuzTokens', {
    from: deployer.address,
    args: args,
    log: true,
    ...(!developmentChains.includes(network.name) && {
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: waitBlockConfirmations
    })
  })

  log(`deployed at ${contract.address}`)
  log('----------------------------------------------------')

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(contract.address, args, 'contracts/BonuzTokens.sol:BonuzTokens')
  }
}

export default deploy

deploy.id = 'deploy_BonuzTokens' // id required to prevent re-execution
deploy.tags = ['all', 'BonuzTokens']
