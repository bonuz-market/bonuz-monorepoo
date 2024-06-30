import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  BiconomySmartAccountV2Config,
  DEFAULT_ENTRYPOINT_ADDRESS,
  createSmartAccountClient
} from '@biconomy/account'
import { Bundler, IBundler } from '@biconomy/bundler'
import { ChainId } from '@biconomy/core-types'
import {
  BiconomyPaymaster, IHybridPaymaster,
  IPaymaster, PaymasterMode,
  SponsorUserOperationDto
} from '@biconomy/paymaster'
import hre, { ethers } from 'hardhat'

import { developmentChains } from '../helper-hardhat-config'
import { BonuzTokens } from '../typechain-types'

const bundler: IBundler = new Bundler({
  bundlerUrl:
    'https://bundler.biconomy.io/api/v2/137/kj90iBbhs.jkL90oYh-iJkl-45ic-af80-klgHf74b78Cv', // https://docs.biconomy.io/docs/dashboard/keys
  chainId: ChainId.POLYGON_MAINNET,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    'https://paymaster.biconomy.io/api/v1/137/zdx2Ha-3o.4a5005e2-1494-4fa8-8d5a-6d7910aa7d0c',
})

const mintNft = async (params: any, contract: any, biconomySmartAccount: BiconomySmartAccount) => {
  const mintTx = new ethers.utils.Interface([
    `
    function mint(
      address _account,
      string memory _tokenType,
      string memory _name,
      string memory _desc,
      string memory _imageURL,
      bool _isSoulBound,
      uint256 _expiryDate,
      uint256 _points
      ) 
    `,
  ])

  // const params = [
  //   to,
  //   tokenType,
  //   name,
  //   desc,
  //   imageURL,
  //   isSoulBound,
  //   expiryDate,
  //   points
  // ];

  const data = mintTx.encodeFunctionData('mint', params)

  const contractAddress = contract.address
  const tx1 = {
    to: contractAddress,
    data,
  }
  const { waitForTxHash } = await biconomySmartAccount.sendTransaction(tx1, {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  });
  const { transactionHash, userOperationReceipt } = await waitForTxHash();
  console.log(transactionHash, "txHash");
  console.log(userOperationReceipt, "receipt");
}

async function main() {
  const { deployments, ethers, getNamedAccounts, network } = hre

  if (developmentChains.includes(network.name)) await deployments.fixture(['BonuzTokens']) //? deploy BonuzTokensDraft3 contract if it is not already deployed

  // const contract: BonuzTokens = await ethers.getContract('BonuzTokens')
  const contract: BonuzTokens = await ethers.getContractAt('BonuzTokens', '0x2A945B46EE2c6B8BAC319514d5EcdEdf2CBB607b')
  const owner = await contract.owner()
  console.log('contract owner', owner)

  const [private_key_account] = await ethers.getSigners()

  // const biconomySmartAccountConfig: BiconomySmartAccountV2Config = {
  //   signer: private_key_account,
  //   chainId: ChainId.POLYGON_MAINNET,
  //   bundler: bundler,
  //   paymaster: paymaster,
  //   rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/NlnCuGZCDhj1TGuo1b2oWuoo15S0kMux'
  // }

  // let biconomySmartAccount = await createSmartAccountClient(
  //   biconomySmartAccountConfig
  // );


  // const smartAccountAdd = await biconomySmartAccount.getAccountAddress()
  // console.log("smartAccountAdd: ", smartAccountAdd);

  // const issuer = {
  //   address: smartAccountAdd
  //   // address: private_key_account.address
  // }
  // // //* ISSUER
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
      const tx = await contract.connect(private_key_account).setIssuer(issuerAddress, true, {
        // gasLimit: 1000000
      })
      await tx.wait()
    }
  }

  // set admins
  const adminAddresses = [
    '0xFA42bA87c81D3a45Ea7C590A596387b87CF4cB7D', // jc metamask
    '0xC026e8BD372030D190b14D0444b42B87dF3594db', // jc biconomy 
  ]

  for (const adminAddress of adminAddresses) {
    const isAdmin = await contract.isAdmin(adminAddress)

    if (isAdmin) {
      console.log('Already Admin:', adminAddress)
    } else {
      console.log('Setting Admin:', adminAddress)
      const tx = await contract.setAdmin(adminAddress, true)
      await tx.wait()
    }
  }
  //* MINT
  // const to = '0xA11Ff149080a7EdD1c444E1F01b791cD48a53B80' // account 6
  const to = '0xA11Ff149080a7EdD1c444E1F01b791cD48a53B80' // muzzamil biconomy

  // ? Voucher

  console.log("private_key_account ", private_key_account.address);
  const voucherMetadata = {
    tokenType: 'VOUCHER',
    name: '25% Voucher Sample',
    desc: '25% Voucher Sample',
    imageURL: 'ipfs://bafybeich7tasr34jdxugkdcvjqclm4fbw5liofoj3ehcoqr2vtirrcbxzy/Voucher',
    isSoulBound: false,
    redeemDate: 0,
    expiryDate: 0,
    points: 0

    // 'recipient': '0xF0A8391b201D66388D3389E2FF721f5e1c1E5709',
    // 'tokenType': 'MEMBERSHIP',
    // 'issuer': '0x41503386c8f1e2ee26d7293b4a7ee7f4be9f7976',
    // 'name': 'Membership  new Partner',
    // 'desc': 'Membership  new Partner des',
    // 'isSoulBound': false,
    // 'redeemDate': 0,
    // 'expiryDate': 0,
    // 'points': 0,
    // 'imageURL': 'https://ipfs.io/ipfs/bafybeihzeulkinenvc3gc26b7nnlvturqv3c67z6k7vxgqxcbknvtglcae'
  }
  const tx = await contract.connect(private_key_account)
    .mint(
      to,
      voucherMetadata.tokenType,
      voucherMetadata.name,
      voucherMetadata.desc,
      voucherMetadata.imageURL,
      voucherMetadata.isSoulBound,
      voucherMetadata.expiryDate,
      voucherMetadata.points,
    )
  const receipt = await tx.wait()
  // console.log("receipt ", receipt);
  // const voucherParams = [
  //   to,
  //   voucherMetadata.tokenType,
  //   voucherMetadata.name,
  //   voucherMetadata.desc,
  //   voucherMetadata.imageURL,
  //   voucherMetadata.isSoulBound,
  //   voucherMetadata.expiryDate,
  //   voucherMetadata.points
  // ]
  // await mintNft([
  //   to,
  //   'VOUCHER',
  //   '25% Voucher Sample',
  //   '25% Voucher Sample',
  //   voucherMetadata.imageURL,
  //   voucherMetadata.isSoulBound,
  //   voucherMetadata.expiryDate,
  //   voucherMetadata.points
  // ], 
  // contract, 
  // biconomySmartAccount
  // )


  // await mintNft([
  //   issuer.address,
  //   '50% Voucher Sample',
  //   '50% Voucher Sample',
  //   voucherMetadata.imageURL,
  //   voucherMetadata.isSoulBound,
  //   voucherMetadata.expiryDate,
  //   voucherMetadata.points
  // ], 
  // contract, 
  // biconomySmartAccount
  // )

  // const loyaltyMetadata = {
  //   issuer: issuer.address,
  //   tokenType: 'LOYALTY',
  //   name: 'Test Loyalty',
  //   desc: 'Test Loyalty Description',
  //   imageURL: 'ipfs://bafybeidpnx3s4w4twugk3nz2moffs7aszefzok3dpur6aev2jwhwckbvqy/Loyalty',
  //   isSoulBound: false,
  //   redeemDate: 0,
  //   expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
  //   points: 0
  // }

  // // await contract
  // //   .mint(
  // //     to,
  // //     loyaltyMetadata.tokenType,
  // //     loyaltyMetadata.name,
  // //     loyaltyMetadata.desc,
  // //     loyaltyMetadata.imageURL,
  // //     loyaltyMetadata.isSoulBound,
  // //     loyaltyMetadata.expiryDate,
  // //     loyaltyMetadata.points
  // //   )

  // const loyaltyParams = [
  //   to,
  //   loyaltyMetadata.tokenType,
  //   loyaltyMetadata.name,
  //   loyaltyMetadata.desc,
  //   loyaltyMetadata.imageURL,
  //   loyaltyMetadata.isSoulBound,
  //   loyaltyMetadata.expiryDate,
  //   loyaltyMetadata.points
  // ]
  // await mintNft(loyaltyParams, contract, biconomySmartAccount)
  // await mintNft(loyaltyParams, contract, biconomySmartAccount)
  // await mintNft(loyaltyParams, contract, biconomySmartAccount)
  // const membershipMetadata = {
  //   //issuer: issuer.address,
  //   tokenType: 'MEMBERSHIP',
  //   name: 'Membership Sample',
  //   desc: 'Membership',
  //   imageURL: 'ipfs://bafybeie6ugzqeh4pbf4avtwnlwiltd6p3z7rzuabizzkqg563gnc3z4upa/Membership',
  //   isSoulBound: false,
  //   redeemDate: 0,
  //   expiryDate: 0,
  //   points: 0
  // }

  // await contract
  //   .mint(
  //     to,
  //     membershipMetadata.tokenType,
  //     membershipMetadata.name,
  //     membershipMetadata.desc,
  //     membershipMetadata.imageURL,
  //     membershipMetadata.isSoulBound,
  //     membershipMetadata.expiryDate,
  //     membershipMetadata.points
  //   )

  // const membershipParams = [
  //   to,
  //   membershipMetadata.tokenType,
  //   membershipMetadata.name,
  //   membershipMetadata.desc,
  //   membershipMetadata.imageURL,
  //   membershipMetadata.isSoulBound,
  //   membershipMetadata.expiryDate,
  //   membershipMetadata.points
  // ]
  // await mintNft(membershipParams, contract, biconomySmartAccount)
  // await mintNft(membershipParams, contract, biconomySmartAccount)
  // await mintNft(membershipParams, contract, biconomySmartAccount)

  // should be soulbound else we will get error from sc
  // const certificateMetadata = {
  //   //issuer: issuer.address,
  //   tokenType: 'CERTIFICATE',
  //   name: 'Web3 Certificate Course Completion',
  //   desc: 'Web3 Certificate Course Completion',
  //   imageURL: 'ipfs://bafybeiauzk6v3jiypxamp3sq2xwicbeafhvap4inueirqq5n6pmfpojulm/Certificate',
  //   isSoulBound: true,
  //   redeemDate: 0,
  //   expiryDate: 0,
  //   points: 0
  // }

  // await contract
  //   .mint(
  //     to,
  //     certificateMetadata.tokenType,
  //     certificateMetadata.name,
  //     certificateMetadata.desc,
  //     certificateMetadata.imageURL,
  //     certificateMetadata.isSoulBound,
  //     certificateMetadata.expiryDate,
  //     certificateMetadata.points
  //   )

  // const certificateParams = [
  //   to,
  //   certificateMetadata.tokenType,
  //   certificateMetadata.name,
  //   certificateMetadata.desc,
  //   certificateMetadata.imageURL,
  //   certificateMetadata.isSoulBound,
  //   certificateMetadata.expiryDate,
  //   certificateMetadata.points
  // ]
  // await mintNft([
  //   issuer.address,
  //   'Web3 Certificate course Completion',
  //   'Web3 Certificate course Completion',
  //   certificateMetadata.imageURL,
  //   certificateMetadata.isSoulBound,
  //   certificateMetadata.expiryDate,
  //   certificateMetadata.points
  // ], contract, biconomySmartAccount)

  // should be soulbound else we will get error from sc
  // const popMetadata = {
  //   //issuer: issuer.address,
  //   tokenType: 'POP',
  //   name: 'Proof or Participation Sample',
  //   desc: 'Proof or Participation Sample',
  //   imageURL: 'ipfs://bafybeiefufr7a3mmirftfpadpt4z7nupbcjgkugnkpg6prz2jozehdaxsi/POA',
  //   isSoulBound: true,
  //   redeemDate: 0,
  //   expiryDate: 0,
  //   points: 0
  // }

  // await contract
  //   .mint(
  //     to,
  //     popMetadata.tokenType,
  //     popMetadata.name,
  //     popMetadata.desc,
  //     popMetadata.imageURL,
  //     popMetadata.isSoulBound,
  //     popMetadata.expiryDate,
  //     popMetadata.points
  //   )

  // const popParams = [
  //   to,
  //   popMetadata.tokenType,
  //   popMetadata.name,
  //   popMetadata.desc,
  //   popMetadata.imageURL,
  //   popMetadata.isSoulBound,
  //   popMetadata.expiryDate,
  //   popMetadata.points
  // ]
  // await mintNft(popParams, contract, biconomySmartAccount)
  // await mintNft(popParams, contract, biconomySmartAccount)
  // await mintNft(popParams, contract, biconomySmartAccount)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
