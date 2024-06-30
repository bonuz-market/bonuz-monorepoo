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


const CORE_CHAIN_ID = 1116;
const POLYGON_MUMBAI = 80001;

const biconomyConfigByChainId = {
  [POLYGON_MUMBAI]: {
    bundler: new Bundler({
      bundlerUrl:
        "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44", // https://docs.biconomy.io/docs/dashboard/keys
      chainId: POLYGON_MUMBAI,
    }),
    paymaster: new BiconomyPaymaster({
      paymasterUrl:
        "https://paymaster.biconomy.io/api/v1/80001/pxFfSjlF6.7dafeea0-6c6e-4611-b51a-8f4428fa51f3",
    }),
    chainId: POLYGON_MUMBAI,
    rpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/mgVJSQhdkg0cExouvNE7rjbmZI5VlGEs`,
  },
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

const deployedContractAddress: { [key: number]: string } = {
  1116: '0x9220070245b67130977FdF32acA4acdF6aD163cC',
  80001: '0x131FD47BD3ba332A945A2bAC967F6183D9a9A5F3'
};

async function main() {
  const { deployments, ethers, getNamedAccounts, network } = hre
  const chainId = network.config.chainId
  if (!chainId) {
    throw new Error('INVALID_CHAIN_ID')
  }



  const contract: BonuzSocialId = await ethers.getContractAt('BonuzSocialId', deployedContractAddress[chainId]) // core dao mainnet - deployed using jc metamask wallet
  const owner = await contract.owner()

  const [caller] = await ethers.getSigners()

  const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
    //@ts-ignore 
    ...biconomyConfigByChainId[chainId],
    signer: caller,
  }

  let biconomySmartAccount = await createSmartAccountClient(
    biconomySmartAccountConfig
  );
  const smartAccountAddress = await biconomySmartAccount.getAccountAddress();

  const callerAddr = caller.address
  const isAdmin = await contract.isAdmin(callerAddr)
  const isIssuer = await contract.isIssuer(callerAddr)
  const isSmartAccountIssuer = await contract.isIssuer(smartAccountAddress)

  console.log({
    owner,
    callerAddr,
    smartAccountAddress,
    isAdmin,
    isIssuer,
    isSmartAccountIssuer
  })

  const address = '0xa2C7bE8848a4587892093676Cb2a976Cdf4e75F1'

  await setUser([
    address,
    'test',
    'test',
    'test'
  ], contract, biconomySmartAccount)


  const contractData = await contract?.getUserProfileAndSocialLinks(address, SUPPORTED_PLATFORMS)
  console.log('contractData', contractData)


  // const platforms = ['w_wallet1', 'w_wallet2', 'w_wallet3', 'w_wallet4', 'w_wallet5']

  // for (const socialLink of platforms) {
  //   console.log('Setting:', socialLink)

  //   const tx = await contract.setAllowedSocialLink(socialLink, true)
  //   await tx.wait()
  // }

  console.log('----------------------------------------------------')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
