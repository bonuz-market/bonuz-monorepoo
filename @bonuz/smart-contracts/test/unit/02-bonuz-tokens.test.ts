/* eslint-disable sonarjs/no-duplicate-string */
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { deployments, ethers, getNamedAccounts, network } from 'hardhat'

import { developmentChains } from '../../helper-hardhat-config'
import { BonuzTokens } from '../../typechain-types'
import { tokens } from '../../utils/helper'

developmentChains.includes(network.name)
  ? describe('BonuzTokens', function () {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    async function deployFixture() {
      const accounts = await ethers.getSigners() // could also do with getNamedAccounts
      // const namedAccounts = await getNamedAccounts()
      const [deployer, admin, issuer, organizer, instructor, recipient, attacker] = accounts

      await deployments.fixture(['BonuzTokens'])

      const contract: BonuzTokens = await ethers.getContract('BonuzTokens')

      await contract.setAdmin(admin.address, true)
      await contract.setIssuer(issuer.address, true)

      return {
        deployer,
        admin,
        issuer,
        organizer,
        instructor,
        recipient,
        attacker,
        contract,
        // attackerContract,
        ether: tokens
      }
    }

    describe('constructor', () => {
      it('should deploy the contract successfully', async () => {
        const { contract } = await loadFixture(deployFixture)

        expect(contract.address).to.not.equal(
          ethers.constants.AddressZero,
          'Contract address should not be zero'
        )

        expect(contract.address).to.properAddress
        expect(await contract.paused()).to.equal(false)
      })

      it('should set deployer as owner', async () => {
        const { contract, deployer } = await loadFixture(deployFixture)

        const contractOwner = await contract.owner()

        expect(contractOwner).to.equal(deployer.address, 'Incorrect contract owner')
      })
    })

    describe('pauseContract and unpauseContract', function () {
      it('should pause and unpause the contract', async function () {
        const { contract } = await loadFixture(deployFixture)

        await contract.setPause(true)
        expect(await contract.paused()).to.equal(true)

        // Unpause the contract
        await contract.setPause(false)
        expect(await contract.paused()).to.equal(false)
      })

      it('should revert when pause/unpause is not called by the owner', async function () {
        const { contract, attacker } = await loadFixture(deployFixture)

        await expect(contract.connect(attacker).setPause(true)).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )

        await expect(contract.connect(attacker).setPause(false)).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })
    })

    // ------------------ ROLES ------------------

    describe('addAdmin', () => {
      it('should grant the admin role to the specified account', async () => {
        const { contract } = await loadFixture(deployFixture)

        const newAdmin = ethers.Wallet.createRandom().address

        await contract.setAdmin(newAdmin, true)

        const isNewAdmin = await contract.isAdmin(newAdmin)
        expect(isNewAdmin).to.equal(true, 'New admin should be added')
      })

      it('should revert if the caller is not a owner', async () => {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await expect(contract.connect(attacker).setAdmin(newAdmin, true)).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })

      it('should revert setting admin with zero address', async function () {
        const { contract, admin } = await loadFixture(deployFixture)

        await expect(
          contract.setAdmin(ethers.constants.AddressZero, true)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ZeroAddressNotAllowed')
      })
    })

    describe('removeAdmin', () => {
      it('should revoke the admin role from the specified account', async () => {
        const { contract, admin } = await loadFixture(deployFixture)
        expect(await contract.isAdmin(admin.address)).to.be.true

        await contract.setAdmin(admin.address, false)
        expect(await contract.isAdmin(admin.address)).to.be.false
      })

      it('should revert if the caller is not a owner', async () => {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await expect(contract.connect(attacker).setAdmin(newAdmin, false)).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })
    })

    describe('addIssuer', () => {
      it('should grant the issuer role to the specified account', async () => {
        const { contract } = await loadFixture(deployFixture)

        const newIssuer = ethers.Wallet.createRandom().address

        await contract.setIssuer(newIssuer, true)

        const isNewIssuer = await contract.isIssuer(newIssuer)
        expect(isNewIssuer).to.equal(true, 'New issuer should be added')
      })

      it('should revert if the caller is not a deployer', async () => {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newIssuer = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(attacker).setIssuer(newIssuer, true)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotAnAdmin')
      })

      it('should revert setting issuer with zero address', async function () {
        const { contract, admin } = await loadFixture(deployFixture)

        await expect(
          contract.connect(admin).setIssuer(ethers.constants.AddressZero, true)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ZeroAddressNotAllowed')
      })
    })

    describe('removeIssuer', () => {
      it('should revoke the issuer role from the specified account', async () => {
        const { contract, issuer } = await loadFixture(deployFixture)
        expect(await contract.isIssuer(issuer.address)).to.be.true

        await contract.setIssuer(issuer.address, false)
        expect(await contract.isIssuer(issuer.address)).to.be.false
      })

      it('should revert if the caller is not a deployer', async () => {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newIssuer = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(attacker).setIssuer(newIssuer, false)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotAnAdmin')
      })
    })

    // ------------------ MINTING ------------------

    describe('mint', function () {
      it('should allow an issuer to mint a token and add tokenId in _tokensByIssuer', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const tokenMetadata = await contract.getTokenMetadata(tokenCounter)

        expect(tokenMetadata.issuer).to.equal(metadata.issuer)
        expect(tokenMetadata.tokenType).to.equal(metadata.tokenType)
        expect(tokenMetadata.name).to.equal(metadata.name)
        expect(tokenMetadata.desc).to.equal(metadata.desc)
        expect(tokenMetadata.imageURL).to.equal(metadata.imageURL)
        expect(tokenMetadata.isSoulBound).to.equal(metadata.isSoulBound)
        expect(tokenMetadata.redeemDate).to.equal(0)
        expect(tokenMetadata.expiryDate).to.equal(metadata.expiryDate)
        expect(tokenMetadata.points).to.equal(metadata.points)

        const ownerOfToken = await contract.ownerOf(tokenCounter)
        expect(ownerOfToken).to.equal(recipient.address)

        const tokens = await contract.getTokensByIssuer(issuer.address)
        const tokensIds = tokens.map((token) => token.toString())
        expect(tokensIds).to.include(tokenCounter.toString())
      })

      it('should not allow a non-issuer to mint a token', async function () {
        const { contract, issuer, attacker, recipient } = await loadFixture(deployFixture)

        const metadata = {
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        await expect(
          contract
            .connect(attacker)
            .mint(
              recipient.address,
              metadata.tokenType,
              metadata.name,
              metadata.desc,
              metadata.imageURL,
              metadata.isSoulBound,
              metadata.expiryDate,
              metadata.points,
              metadataJson
            )
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotAnIssuer')
      })

      it('should fail to mint POP or CERTIFICATE token if not soul-bound', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)

        const popMeta = {
          issuer: issuer.address,
          tokenType: 'POP',
          name: 'Test POP Token',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false, // Non-soul-bound

          expiryDate: 10_000_000_000,
          points: 100
        }

        const certificateMeta = {
          issuer: issuer.address,
          tokenType: 'CERTIFICATE',
          name: 'Test Certificate Token',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false, // Non-soul-bound

          expiryDate: 10_000_000_000,
          points: 100
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        await expect(
          contract
            .connect(issuer)
            .mint(
              recipient.address,
              popMeta.tokenType,
              popMeta.name,
              popMeta.desc,
              popMeta.imageURL,
              popMeta.isSoulBound,
              popMeta.expiryDate,
              popMeta.points,
              metadataJson
            )
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__TokenMustBeSoulBound')

        await expect(
          contract
            .connect(issuer)
            .mint(
              recipient.address,
              certificateMeta.tokenType,
              certificateMeta.name,
              certificateMeta.desc,
              certificateMeta.imageURL,
              certificateMeta.isSoulBound,
              certificateMeta.expiryDate,
              certificateMeta.points,
              metadataJson
            )
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__TokenMustBeSoulBound')
      })

      it('should revert minting with zero address', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        await expect(
          contract.connect(issuer).mint(
            ethers.constants.AddressZero, // Zero address
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ZeroAddressNotAllowed')
      })
    })

    describe('Reentrancy Test', function () {
      it('should prevent re-entrant calls to mint', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)

        const AttackerContract = await ethers.getContractFactory('AttackerContract')
        const attackerContract = await AttackerContract.deploy(contract.address)
        await attackerContract.deployed()
        // Make AttackerContract an issuer
        await contract.setIssuer(attackerContract.address, true)

        const tokenType = 'VOUCHER'
        const name = 'Test Voucher'
        const desc = 'Description'
        const imageURL = 'http://example.com/image.jpg'
        const isSoulBound = false
        const expiryDate = Date.now() + 1_000_000 // Some future timestamp
        const points = 100

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        // Attempt to attack using the attacker contract
        await expect(
          attackerContract.attack(
            recipient.address,
            tokenType,
            name,
            desc,
            imageURL,
            isSoulBound,
            expiryDate,
            points,
            metadataJson
          )
        ).to.be.revertedWith('ReentrancyGuard: reentrant call')
      })
    })

    describe('redeemVoucher', function () {
      it('should allow an issuer to redeem a voucher token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.connect(issuer).redeemVoucher(tokenCounter)

        const tokenMetadata = await contract.getTokenMetadata(tokenCounter)
        expect(tokenMetadata.redeemDate).to.not.equal(0)
      })

      it('should not allow a non-issuer to redeem a voucher token', async function () {
        const { contract, issuer, attacker, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(attacker).redeemVoucher(tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotAnIssuer')
      })

      it('should revert if the token is not a voucher', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: await issuer.address,
          tokenType: 'MEMBERSHIP',
          name: 'Test Membership',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(issuer).redeemVoucher(tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__InvalidTokenType')
      })

      it('should revert if the token is not redeemed by the issuer', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson,
          )

        await expect(
          contract.connect(deployer).redeemVoucher(tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotTokenIssuer')
      })

      it('should revert if the token is expired', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: 1000, // Set expiry in the past
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(issuer).redeemVoucher(tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ExpiredTokenCannotBeRedeemed')
      })

      it('should not allow a voucher to be redeemed more than once', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.connect(issuer).redeemVoucher(tokenCounter)

        const tokenMetadata = await contract.getTokenMetadata(tokenCounter)
        expect(tokenMetadata.redeemDate).to.not.equal(0)

        // Attempt to redeem the same voucher again
        await expect(
          contract.connect(issuer).redeemVoucher(tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__VoucherAlreadyRedeemed')
      })
    })

    describe('Transfer', function () {
      it('should revert if called when the contract is paused', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.setPause(true)

        const newRecipient = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(recipient).transferFrom(recipient.address, newRecipient, tokenCounter)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should not allow transfer of soulbound token', async function () {
        const { contract, admin, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          issuer: issuer.address,
          tokenType: 'MEMBERSHIP',
          name: 'Test Membership',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: true,
          expiryDate: 0,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            issuer.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const newRecipient = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(issuer).transferFrom(issuer.address, newRecipient, tokenCounter)
        ).to.be.revertedWithCustomError(
          contract,
          'BonuzTokens__SoulBoundTokenCannotBeTransferred'
        )
      })

      it('should not allow transfer of expired voucher tokens', async function () {
        const { contract, admin, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue',
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        //* Time travel
        // Transactions are sent using the first signer by default
        const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60
        const oneMonthInFuture = (await time.latest()) + ONE_MONTH_IN_SECS
        // console.log('oneMonthInFuture', new Date(oneMonthInFuture * 1000).toLocaleDateString())
        await time.increaseTo(oneMonthInFuture)

        // Attempt to transfer the expired voucher token
        const newRecipient = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(recipient).transferFrom(recipient.address, newRecipient, tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ExpiredTokenCannotBeTransferred')
      })

      it('should not allow transfer of redeemed voucher tokens', async function () {
        const { contract, admin, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.connect(issuer).redeemVoucher(tokenCounter)

        // Attempt to transfer the redeemed voucher token
        const newRecipient = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(recipient).transferFrom(recipient.address, newRecipient, tokenCounter)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__RedeemedTokenCannotBeTransferred')
      })

      it('should allow transfer of voucher tokens if not redeemed and expired', async function () {
        const { contract, admin, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          issuer: issuer.address,
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const newRecipient = ethers.Wallet.createRandom().address

        await expect(
          contract.connect(recipient).transferFrom(recipient.address, newRecipient, tokenCounter)
        ).to.not.be.reverted
      })
    })

    describe('addLoyaltyPoints', function () {
      it('should allow an issuer to add loyalty points to a loyalty token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.connect(issuer).addLoyaltyPoints(tokenCounter, 100)

        const tokenMetadata = await contract.getTokenMetadata(tokenCounter)
        expect(tokenMetadata.points).to.equal(100)
      })

      it('should not allow a non-issuer to add loyalty points to a loyalty token', async function () {
        const { contract, issuer, attacker, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(attacker).addLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotAnIssuer')
      })

      it('should revert if the token is not a loyalty token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'MEMBERSHIP',
          name: 'Test Membership',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(issuer).addLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__InvalidTokenType')
      })

      it('should revert if the points are added by a non-issuer', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(deployer).addLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotTokenIssuer')
      })

      it('should revert if the token is expired', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: 1000, // Set expiry in the past
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(issuer).addLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ExpiredTokenCannotBeRedeemed')
      })
    })

    describe('removeLoyaltyPoints', function () {
      it('should allow an issuer to remove loyalty points from a loyalty token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 100
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.connect(issuer).removeLoyaltyPoints(tokenCounter, 50)

        const tokenMetadata = await contract.getTokenMetadata(tokenCounter)
        expect(tokenMetadata.points).to.equal(50)
      })

      it('should not allow a non-issuer to remove loyalty points from a loyalty token', async function () {
        const { contract, issuer, attacker, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 100
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(attacker).removeLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotAnIssuer')
      })

      it('should set points to 0 if more points are removed than available', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 100
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await contract.connect(issuer).removeLoyaltyPoints(tokenCounter, 150)

        const tokenMetadata = await contract.getTokenMetadata(tokenCounter)
        expect(tokenMetadata.points).to.equal(0)
      })

      it('should revert if the token is not a loyalty token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'MEMBERSHIP',
          name: 'Test Membership',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(issuer).removeLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__InvalidTokenType')
      })

      it('should revert if the points are removed by a non-issuer', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(deployer).removeLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__NotTokenIssuer')
      })

      it('should revert if the token is expired', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          issuer: issuer.address,
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,

          expiryDate: 1000, // Set expiry in the past
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(
          contract.connect(issuer).removeLoyaltyPoints(tokenCounter, 100)
        ).to.be.revertedWithCustomError(contract, 'BonuzTokens__ExpiredTokenCannotBeRedeemed')
      })
    })

    describe('tokenURI', function () {
      it('should return the correct token URI for a voucher token', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const metadata = {
          tokenType: 'VOUCHER',
          name: 'Test Voucher',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: Math.floor(Date.now() / 1000) + 86_400, // One day from now,
          points: 0
        }
        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const tokenURI = await contract.tokenURI(tokenCounter)

        const json = Buffer.from(tokenURI.slice(29), 'base64').toString()
        const result = JSON.parse(json)

        const expectedObject = {
          name: 'VOUCHER #1 (Test Voucher)',
          description: 'Test Description (Test Description)',
          image: 'https://example.com/image.jpg',
          attributes: [
            {
              trait_type: 'Type',
              value: 'VOUCHER'
            },
            {
              trait_type: 'Redeemed At',
              value: '0',
              display_type: 'text'
            },
            {
              trait_type: 'Expiry Date',
              value: metadata.expiryDate.toString(),
              display_type: 'date'
            }
          ]
        }

        expect(result).to.deep.equal(expectedObject)
      })

      it('should return the correct token URI for a pop token', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const now = Math.floor(Date.now() / 1000)
        const metadata = {
          tokenType: 'POP',
          name: 'Test pop',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: true,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const tokenURI = await contract.tokenURI(tokenCounter)
        const json = Buffer.from(tokenURI.slice(29), 'base64').toString()
        const result = JSON.parse(json)

        const expectedObject = {
          name: 'POP #1 (Test pop)',
          description: 'Test Description (Test Description)',
          image: 'https://example.com/image.jpg',
          attributes: [
            {
              trait_type: 'Type',
              value: 'POP'
            },
            {
              trait_type: 'Redeemed At',
              value: '0',
              display_type: 'text'
            }
          ]
        }

        expect(result).to.deep.equal(expectedObject)
      })

      it('should return the correct token URI for a certificate token', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const now = Math.floor(Date.now() / 1000)
        const metadata = {
          tokenType: 'CERTIFICATE',
          name: 'Test certificate',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: true,
          expiryDate: 0,
          points: 100
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const tokenURI = await contract.tokenURI(tokenCounter)
        const json = Buffer.from(tokenURI.slice(29), 'base64').toString()
        const result = JSON.parse(json)

        const expectedObject = {
          name: 'CERTIFICATE #1 (Test certificate)',
          description: 'Test Description (Test Description)',
          image: 'https://example.com/image.jpg',
          attributes: [
            {
              trait_type: 'Type',
              value: 'CERTIFICATE'
            },
            {
              trait_type: 'Course Completed At',
              value: '0',
              display_type: 'text'
            }
          ]
        }

        expect(result).to.deep.equal(expectedObject)
      })

      it('should return the correct token URI for a loyalty token', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const now = Math.floor(Date.now() / 1000)
        const metadata = {
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: now + 86_400, // One day from now,
          points: 100
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const tokenURI = await contract.tokenURI(tokenCounter)
        const json = Buffer.from(tokenURI.slice(29), 'base64').toString()
        const result = JSON.parse(json)

        const expectedObject = {
          name: 'LOYALTY #1 (Test Loyalty)',
          description: 'Test Description (Test Description)',
          image: 'https://example.com/image.jpg',
          attributes: [
            {
              trait_type: 'Type',
              value: 'LOYALTY'
            },
            {
              trait_type: 'Last Redeemed At',
              value: '0',
              display_type: 'text'
            },
            {
              trait_type: 'Expiry Date',
              value: metadata.expiryDate.toString(),
              display_type: 'date'
            },
            {
              trait_type: 'Points Available',
              value: '100'
            }
          ]
        }

        expect(result).to.deep.equal(expectedObject)
      })

      it('should return the correct token URI for a membership token', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)
        const now = Math.floor(Date.now() / 1000)
        const metadata = {
          tokenType: 'MEMBERSHIP',
          name: 'Test membership',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: true,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const tokenURI = await contract.tokenURI(tokenCounter)
        const json = Buffer.from(tokenURI.slice(29), 'base64').toString()
        const result = JSON.parse(json)

        const expectedObject = {
          name: 'MEMBERSHIP #1 (Test membership)',
          description: 'Test Description (Test Description)',
          image: 'https://example.com/image.jpg',
          attributes: [
            {
              trait_type: 'Type',
              value: 'MEMBERSHIP'
            },
            {
              trait_type: 'is transferable',
              value: 'No'
            },
            {
              trait_type: 'Redeemed At',
              value: '0',
              display_type: 'text'
            }
          ]
        }
        expect(result).to.deep.equal(expectedObject)
      })

      it('should return empty metadata token URI for when token correct type', async function () {
        const { contract, deployer, issuer, recipient } = await loadFixture(deployFixture)

        const metadata = {
          tokenType: 'NotAvailableType',
          name: 'Test',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        await expect(contract.tokenURI(tokenCounter)).to.be.reverted
      })
    })

    describe('ERC165 Interface Compliance', function () {
      it('should correctly report interface support', async function () {
        const { contract } = await loadFixture(deployFixture)
        // Checking for custom interface IDs
        expect(await contract.supportsInterface('0xb45a3c0e')).to.be.true
        expect(await contract.supportsInterface('0x49064906')).to.be.true

        // Checking for standard interface IDs (e.g., ERC-721, ERC-165)
        expect(await contract.supportsInterface('0x80ac58cd')).to.be.true // ERC-721
        expect(await contract.supportsInterface('0x01ffc9a7')).to.be.true // ERC-165

        // Checking an unsupported interface ID
        expect(await contract.supportsInterface('0x00000000')).to.be.false
      })
    })

    describe('locked', function () {
      it('should return true for a soul-bound token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        // Mint a soul-bound token
        const metadata = {
          tokenType: 'MEMBERSHIP',
          name: 'Test membership',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: true,
          expiryDate: 0,
          points: 0
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const isLocked = await contract.locked(tokenCounter)
        expect(isLocked).to.be.true
      })

      it('should return false for a non-soul-bound token', async function () {
        const { contract, issuer, recipient } = await loadFixture(deployFixture)
        const now = Math.floor(Date.now() / 1000)

        // Mint a non-soul-bound token
        const metadata = {
          tokenType: 'LOYALTY',
          name: 'Test Loyalty',
          desc: 'Test Description',
          imageURL: 'https://example.com/image.jpg',
          isSoulBound: false,
          expiryDate: now + 86_400, // One day from now,
          points: 100
        }

        const metadataJson = JSON.stringify({
          exampleKey: 'exampleValue'
        })

        const tokenCounter = await contract.getTokenCounter()

        await contract
          .connect(issuer)
          .mint(
            recipient.address,
            metadata.tokenType,
            metadata.name,
            metadata.desc,
            metadata.imageURL,
            metadata.isSoulBound,
            metadata.expiryDate,
            metadata.points,
            metadataJson
          )

        const isLocked = await contract.locked(tokenCounter)
        expect(isLocked).to.be.false
      })
    })
  })
  : describe.skip
