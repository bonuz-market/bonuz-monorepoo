import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

import { developmentChains, SUPPORTED_PLATFORMS, VERIFICATION_BLOCK_CONFIRMATIONS } from '../helper-hardhat-config'
import verify from '../utils/verify'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const accounts = await ethers.getSigners() // could also do with getNamedAccounts

  const [deployer] = accounts

  const chainId: number = network.config.chainId!

  log('----------------------------------------------------')
  log('Deploying Bfuel ...')

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const contract = await deploy('Bfuel', {
    from: deployer.address,
    args: ['0xB00Da7Ab600F076a753b3cE8ba53Ec96E4d89d37'],
    log: true,
    ...(!developmentChains.includes(network.name) && {
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: waitBlockConfirmations
    }),
  })

  log(`deployed at ${contract.address}`)
  log('----------------------------------------------------')

}

export default deploy

deploy.id = 'deploy_Bfuel' // id required to prevent re-execution
deploy.tags = ['all', 'Bfuel']
