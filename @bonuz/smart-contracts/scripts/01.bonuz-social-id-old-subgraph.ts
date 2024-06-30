import hre, { ethers } from 'hardhat'
import { request, gql } from 'graphql-request'

import { SUPPORTED_PLATFORMS } from '../helper-hardhat-config'
import { BonuzSocialId } from '../typechain-types'
import axios from 'axios'

import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
  PaymasterMode,
  BiconomySmartAccountV2Config,
} from "@biconomy/account";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  IPaymaster,
  BiconomyPaymaster,
} from "@biconomy/paymaster";
import { ChainId } from "@biconomy/core-types";

const query = gql`
  query GetUserProfilesByWallets($wallets: [ID!]!) {
    userProfiles(where: { id_in: $wallets }) {
      wallet: id
      handle
      name
      profileImage
      socialLinks {
        platform
        link
      }
    }
  }
`

interface QueryVariables {
  wallets: string[]
}

interface SocialLink {
  platform: string
  link: string
}

interface UserProfile {
  wallet: string
  handle: string
  name: string
  profileImage: string
  socialLinks: SocialLink[]
}

interface QueryResponse {
  userProfiles: UserProfile[]
}

const CORE_CHAIN_ID = 1116;

const biconomyConfigByChainId = {
  // [ChainId.POLYGON_MUMBAI]: {
  //   bundler: new Bundler({
  //     bundlerUrl:
  //       "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44", // https://docs.biconomy.io/docs/dashboard/keys
  //     chainId: ChainId.POLYGON_MUMBAI,
  //     // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  //   }),
  //   paymaster: new BiconomyPaymaster({
  //     paymasterUrl:
  //       "https://paymaster.biconomy.io/api/v1/80001/pxFfSjlF6.7dafeea0-6c6e-4611-b51a-8f4428fa51f3",
  //   }),
  //   chainId: ChainId.POLYGON_MUMBAI,
  //   rpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/${config.blockchain.alchemy.apiKey}`,
  // },
  // [ChainId.POLYGON_MAINNET]: {
  //   bundler: new Bundler({
  //     bundlerUrl:
  //       "https://bundler.biconomy.io/api/v2/137/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv", // https://docs.biconomy.io/docs/dashboard/keys
  //     chainId: ChainId.POLYGON_MAINNET,
  //     // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  //   }),
  //   paymaster: new BiconomyPaymaster({
  //     paymasterUrl:
  //       "https://paymaster.biconomy.io/api/v1/137/zdx2Ha-3o.4a5005e2-1494-4fa8-8d5a-6d7910aa7d0c",
  //   }),
  //   chainId: ChainId.POLYGON_MAINNET,
  //   rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${config.blockchain.alchemy.apiKey}`,
  // },
  // [ChainId.ARBITRUM_NOVA_MAINNET]: {
  //   // TODO: update bundler and paymaster
  //   bundler: new Bundler({
  //     bundlerUrl:
  //       "https://bundler.biconomy.io/api/v2/42170/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv", // https://docs.biconomy.io/docs/dashboard/keys
  //     chainId: ChainId.ARBITRUM_NOVA_MAINNET,
  //     // entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  //   }),

  //   paymaster: new BiconomyPaymaster({
  //     paymasterUrl:
  //       "https://paymaster.biconomy.io/api/v1/42170/hP_uA_d-i.a30417d0-7197-4a2e-8dda-e770783eaf07",
  //   }),
  //   chainId: ChainId.ARBITRUM_NOVA_MAINNET,
  //   rpcUrl: `https://nova.arbitrum.io/rpc`,
  // },
  [CORE_CHAIN_ID]: {
    bundler: new Bundler({
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/1116/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv", // https://docs.biconomy.io/docs/dashboard/keys
      chainId: CORE_CHAIN_ID as any,
    }),
    paymaster: new BiconomyPaymaster({
      paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/1116/fuDTX650I.b5dbbfd7-a4f9-4ea1-a892-4e8d516a7c2b",
    }),
    chainId: CORE_CHAIN_ID,
    rpcUrl: `https://rpc.coredao.org`,
  },
};

const setUser = async (params: any, contract: any, smartAccount: BiconomySmartAccountV2) => {

  const createUserTx = new ethers.utils.Interface([
    `
	function setUserProfile(
	  address _walletAddress,
	  string  _name,
	  string  _handle,
	  string  _profileImage
	) 
	`,
  ]);

  const data = createUserTx.encodeFunctionData("setUserProfile", params);

  const contractAddress = contract.address
  const tx1 = {
    to: contractAddress,
    data,
  }
  const { waitForTxHash } = await smartAccount.sendTransaction(tx1, {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  });
  const { transactionHash, userOperationReceipt } = await waitForTxHash();
  console.log(transactionHash, "txHash");
  console.log(userOperationReceipt, "receipt");
}

async function main() {
  const { deployments, ethers, getNamedAccounts, network } = hre

  //const contract: BonuzSocialId = await ethers.getContract('BonuzSocialId')
  // const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', '0x131FD47BD3ba332A945A2bAC967F6183D9a9A5F3') // polygon mumbai - deployed using mm metamask wallet
  const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', '0x9220070245b67130977FdF32acA4acdF6aD163cC') // core dao mainnet - deployed using jc metamask wallet
  const owner = await contract.owner()

  const [caller] = await ethers.getSigners()


  // const chainId = CORE_CHAIN_ID
  // const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
  //   ...biconomyConfigByChainId[chainId],
  //   signer: caller,
  // }

  // let biconomySmartAccount = await createSmartAccountClient(
  //   biconomySmartAccountConfig
  // );

  // console.log("address: ", await biconomySmartAccount.getAccountAddress());
  // await setUser([
  //   '0xC026e8BD372030D190b14D0444b42B87dF3594db',
  //   'test',
  //   'test',
  //   'test'
  // ], contract, biconomySmartAccount)

  // const callerAddr = caller.address
  // const isAdmin = await contract.isAdmin(callerAddr)
  // const isIssuer = await contract.isIssuer(callerAddr)

  // console.log({
  //   owner,
  //   callerAddr,
  //   isAdmin,
  //   isIssuer
  // })

  // const issuerAddresses = [
  //   '0x75b5cd23F365fDc40AEBC76070f826dfea6c5Ab8',
  //   '0xFA42bA87c81D3a45Ea7C590A596387b87CF4cB7D', // jc metamask
  //   '0xC026e8BD372030D190b14D0444b42B87dF3594db', // jc biconomy 
  // ]


  // for (const issuerAddress of issuerAddresses) {
  //   const isIssuer = await contract.isIssuer(issuerAddress)

  //   if (isIssuer) {
  //     console.log('Already Issuer:', issuerAddress)
  //   } else {
  //     console.log('Setting Issuer:', issuerAddress)
  //     const tx = await contract.connect(caller).setIssuer(issuerAddress, true)
  //     await tx.wait()
  //   }
  // }

  // // set admins
  // const adminAddresses = [
  //   '0x75b5cd23F365fDc40AEBC76070f826dfea6c5Ab8',
  //   '0xFA42bA87c81D3a45Ea7C590A596387b87CF4cB7D', // jc metamask
  //   '0xC026e8BD372030D190b14D0444b42B87dF3594db', // jc biconomy 
  // ]

  // for (const adminAddress of adminAddresses) {
  //   const isAdmin = await contract.isAdmin(adminAddress)

  //   if (isAdmin) {
  //     console.log('Already Admin:', adminAddress)
  //   } else {
  //     console.log('Setting Admin:', adminAddress)
  //     const tx = await contract.connect(caller).setAdmin(adminAddress, true)
  //     await tx.wait()
  //   }
  // }

  const platforms = ['w_wallet1', 'w_wallet2', 'w_wallet3', 'w_wallet4', 'w_wallet5']

  for (const socialLink of platforms) {
    console.log('Setting:', socialLink)

    const tx = await contract.setAllowedSocialLink(socialLink, true)
    await tx.wait()
  }

  // const address = '0x41503386c8f1e2ee26d7293b4a7ee7f4be9f7976' //  my biconomy address
  // const tx = await contract.connect(issuer).setUserHandle(address, 'testing')
  // tx.wait()
  // const address = '0xC026e8BD372030D190b14D0444b42B87dF3594db'
  // const contractData = await contract?.getUserProfileAndSocialLinks(address, SUPPORTED_PLATFORMS)
  // console.log('contractData', contractData)

  // const graphqlEndpoint =
  //   'https://subgraph.satsuma-prod.com/bec5fd335898/muzzamils-team--1669084/graph-test/version/v0.0.2-new-version/api'
  // const url = 'https://bonuz-admin-wts46rwpca-ey.a.run.app/api/users?limit=100&depth=0'
  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29sbGVjdGlvbiI6ImFkbWlucyIsImVtYWlsIjoib3BzQGJvbnV6Lm1hcmtldCIsImlhdCI6MTcwOTEyODI1NSwiZXhwIjoxNzA5MTM1NDU1fQ.7PbjtErFpgvINy9arOeS63OPoRgrHmnXCxfY9RndJ40'
  // const userDataFromBackend = await axios.get(url, {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // })
  // const users = userDataFromBackend?.data?.docs
  // // if (users) {
  // //   for (const user of users) {
  // //     const { smartAccountAddress, handle } = user
  // //     console.log('Setting:', smartAccountAddress, handle)

  // //     const tx = await contract.connect(issuer).setUserHandle(smartAccountAddress, handle)
  // //     tx.wait()
  // //   }
  // // }
  // const wallets = users?.map((user: any) => user.smartAccountAddress)

  // const variables = {
  //   wallets: wallets
  // }

  // const data: QueryResponse = await request(graphqlEndpoint, query, variables)
  // // console.log(data)
  // for (const userProfile of data.userProfiles) {
  //   const { wallet, name, handle, profileImage, socialLinks } = userProfile
  //   console.log('Setting:', wallet, handle)

  //   const tx = await contract.connect(issuer).setUserProfile(wallet,name, handle, profileImage)
  //   tx.wait()

  //   const platforms = socialLinks.map((link) => link.platform)
  //   const links = socialLinks.map((link) => link.link)
  //   const tx2 = await contract.connect(issuer).setSocialLinks(platforms, links, wallet)
  //   tx2.wait()


  //   // for (const socialLink of socialLinks) {
  //   //   const { platform, link } = socialLink
  //   //   console.log('Setting:', wallet, platform, link)

  //   //   const tx = await contract.connect(issuer).setSocialLink(platform, link, wallet)
  //   //   tx.wait()
  //   // }
  // }

  console.log('----------------------------------------------------')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
