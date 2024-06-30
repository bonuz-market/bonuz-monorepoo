import axios from 'axios'
import hre, { ethers } from 'hardhat'

import BonuzSocialIdAbi from '../artifacts/contracts/BonuzSocialId.sol/BonuzSocialId.json'
import { SUPPORTED_PLATFORMS } from '../helper-hardhat-config'
import { BonuzSocialId } from '../typechain-types'

const networksDetails = {
  network1: {
    rpcUrl: process.env.CORE_BLOCKCHAIN_MAINNET_RPC_URL,
    chainId: 1116,
    name: 'Core Dao Mainnet',
    contractAddress: '0x9220070245b67130977FdF32acA4acdF6aD163cC'
  },
  // network2: {
  //   rpcUrl: process.env.BASE_SEPOLIA_TESTNET_RPC_URL,
  //   chainId: 84_532,
  //   name: 'Base Sepolia Testnet',
  //   contractAddress: '0xB16A86e0D35cBAAcE25DdCF7107876008332f877'
  // }
  network2: {
    rpcUrl: process.env.BASE_MAINNET_RPC_URL,
    chainId: 8453,
    name: 'Base Mainnet',
  contractAddress: '0x9220070245b67130977FdF32acA4acdF6aD163cC'
  }
}

async function main() {
  console.log(
    `Running script to migrate socials ids from ${networksDetails.network1.name} network to ${networksDetails.network2.name} network`
  )

  console.log(' ')

  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey) {
    throw new Error('Please set your PRIVATE_KEY in a .env file')
  }

  const network1Provider = new ethers.providers.JsonRpcProvider(networksDetails.network1.rpcUrl)
  const network1Wallet = new ethers.Wallet(privateKey, network1Provider)

  const network2Provider = new ethers.providers.JsonRpcProvider(networksDetails.network2.rpcUrl)
  const network2Wallet = new ethers.Wallet(privateKey, network2Provider)

  const contract1 = new ethers.Contract(
    networksDetails.network1.contractAddress,
    BonuzSocialIdAbi.abi,
    network1Wallet
  ) as BonuzSocialId
  const contract2 = new ethers.Contract(
    networksDetails.network2.contractAddress,
    BonuzSocialIdAbi.abi,
    network2Wallet
  ) as BonuzSocialId

  const caller = network1Wallet // network1Wallet and network2Wallet both are same
  const callerAddr = caller.address

  const owner1 = await contract1.owner()
  const isAdmin1 = await contract1.isAdmin(callerAddr)
  const isIssuer1 = await contract1.isIssuer(callerAddr)

  console.log({
    owner1,
    callerAddr,
    isAdmin1,
    isIssuer1
  })

  const owner2 = await contract2.owner()
  const isAdmin2 = await contract2.isAdmin(callerAddr)
  const isIssuer2 = await contract2.isIssuer(callerAddr)

  console.log({
    owner2,
    callerAddr,
    isAdmin2,
    isIssuer2
  })

  console.log(' ')

  console.log('Getting all the users from backend')
  console.log(' ')

  const url = 'https://bonuz-admin-wts46rwpca-ey.a.run.app/api/users?limit=10000&depth=0'
  const token =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IkdScmlJbW50cEFFREVRUmw5N2FYbk9XSVo5enBNbEVIVlN1Mi1zZE9PUzAifQ.eyJpZCI6NjksIndhbGxldEFkZHJlc3MiOiIweDA5MzU5NTJiZjhBMDMwMTBjZUVlMzkwNzBhMTA0OWY4MjhFODE2ZmIiLCJzbWFydEFjY291bnRBZGRyZXNzIjoiMHg1MjU5YjM2MEM5M0EyYTg5Y2M5Y2Y5MDQyZWFiNjFCQUM2NWNGOEE2IiwiaWF0IjoxNzE3ODQyMTEzLCJpc3MiOiJodHRwczovL2FwaS5ib251ei5hcHAiLCJhdWQiOiJodHRwczovL2FwaS5ib251ei5hcHAiLCJleHAiOjE3MTg0NDY5MTMsInN1YiI6IkN1c3RvbSBKV1QgZm9yIEJvbnV6IEF1dGhlbnRpY2F0aW9uIn0.Np5b9FNb6JbFieeWuxqy7hdJfxAcnlJQZ3J1mWBFxztX3Cs42lLjFeTb_7kfJLy2abg3ZHNxd4DVhhvrC0FfR0IMH8Du8-7BsTwpLikMa4Hm1K3Cw7s4hKKvc0_dmPCFVaf4L4EgsbtzqQ1Oy3n2C5clkHnIBBGr5M7RQe2ImvgwgReNP6XNvbh3B0-akGrRf1qqyjpAn2YINEOzWIjuTKfCJLgIedo_zOP02ppZcZSN-cDtJbHrnCMMdp6x3Ga2rik12tqSMVFkC2IPoJAGEY5LO123QpDJqCKnoWMLM7a-UoSALDHF1uyem5eL1hprspDapeVWs0GPI4lHchztqA'
  const userDataFromBackend = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const users = userDataFromBackend?.data?.docs
  const wallets = users?.map((user: any) => user.smartAccountAddress)

  for (const wallet of wallets) {
    const address = wallet
    // const address = '0x1D3BC9cd90329722FCe2573Fd8AfB6c5c9E132E2' // mende
    const contract1Data = await contract1.getUserProfileAndSocialLinks(address, SUPPORTED_PLATFORMS)

    const [name, profileImage, handle, links] = contract1Data

    const tx = await contract2.setUserProfile(address, name, handle, profileImage)
    tx.wait()

    const tx2 = await contract2.setSocialLinks(SUPPORTED_PLATFORMS, links, address)
    tx2.wait()

    // const contract2Data = await contract2.getUserProfileAndSocialLinks(address, SUPPORTED_PLATFORMS)
    // console.log('contract2Data', contract2Data)
  }

  console.log('----------------------------------------------------')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
