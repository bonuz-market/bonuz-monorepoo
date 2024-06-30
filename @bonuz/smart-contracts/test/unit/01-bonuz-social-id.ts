/* eslint-disable sonarjs/no-duplicate-string */
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { deployments, ethers, getNamedAccounts, network } from 'hardhat'

import { developmentChains, SUPPORTED_PLATFORMS } from '../../helper-hardhat-config'
import { BonuzSocialId } from '../../typechain-types'
import { tokens } from '../../utils/helper'

developmentChains.includes(network.name)
  ? describe('BonuzSocialId', function () {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    async function deployFixture() {
      const accounts = await ethers.getSigners() // could also do with getNamedAccounts
      // const namedAccounts = await getNamedAccounts()

      await deployments.fixture(['BonuzSocialId'])

      const contract: BonuzSocialId = await ethers.getContract('BonuzSocialId')

      const [deployer, issuer, user, attacker] = accounts

      await contract.setIssuer(issuer.address, true)

      return {
        deployer,
        issuer,
        user,
        attacker,
        contract,
        ether: tokens
      }
    }

    describe('constructor', () => {
      it('should deploy the BonuzSocialId successfully', async () => {
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

      it('should correctly set admin, issuer and allowed links', async function () {
        const { contract, deployer } = await loadFixture(deployFixture)
        const initialIssuers = [deployer.address]
        const initialAllowedPlatforms = SUPPORTED_PLATFORMS

        expect(await contract.isAdmin(deployer.address)).to.equal(true)
        expect(await contract.isIssuer(deployer.address)).to.equal(true)

        const allowed = await contract.getAllowedSocialLinks(initialAllowedPlatforms)

        for (const [i, allowedPlatform] of initialAllowedPlatforms.entries()) {
          expect(allowed[i]).to.equal(true, `${allowedPlatform} should be allowed`)
        }
      })

      it('should ignore zero addresses when initializing issuers', async function () {
        const { deployer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const initialIssuers = [deployer.address, zeroAddress]

        const BonuzSocialIdFactory = await ethers.getContractFactory('BonuzSocialId')
        const contract = await BonuzSocialIdFactory.deploy(initialIssuers, SUPPORTED_PLATFORMS)
        await contract.deployed()

        expect(await contract.isIssuer(deployer.address)).to.equal(true)
        expect(await contract.isIssuer(zeroAddress)).to.equal(false)
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

    describe('Admin Role Management', function () {
      it('should add a new admin', async function () {
        const { contract, deployer } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await contract.setAdmin(newAdmin, true)
        expect(await contract.isAdmin(newAdmin)).to.equal(true)
      })

      it('should remove an admin', async function () {
        const { contract, deployer } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await contract.setAdmin(newAdmin, true)
        await contract.setAdmin(newAdmin, false)
        expect(await contract.isAdmin(newAdmin)).to.equal(false)
      })

      it('should revert when a non-owner tries to add an admin', async function () {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await expect(contract.connect(attacker).setAdmin(newAdmin, true)).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })

      it('should revert when a non-owner tries to remove an admin', async function () {
        const { contract, deployer, attacker } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await contract.setAdmin(newAdmin, true) // First, add a new admin

        await expect(contract.connect(attacker).setAdmin(newAdmin, false)).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })

      it('should revert when setting admin with zero address', async function () {
        const { contract } = await loadFixture(deployFixture)

        await expect(contract.setAdmin(ethers.constants.AddressZero, true)).to.be.revertedWith(
          'Zero address is not allowed'
        )
      })

      it('should revert when setting a zero address as admin', async function () {
        const { contract } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero

        await expect(contract.setAdmin(zeroAddress, true)).to.be.revertedWith(
          'Zero address is not allowed'
        )
      })
    })

    //  ------------------ Issuer ------------------

    describe('add issuer', () => {
      it('should grant the issuer role to the specified account', async () => {
        const { contract } = await loadFixture(deployFixture)

        const newIssuer = ethers.Wallet.createRandom().address

        await contract.setIssuer(newIssuer, true)

        const tx = await contract.setIssuer(newIssuer, true)
        tx.wait()
        const isIssuer = await contract.isIssuer(newIssuer)
        expect(isIssuer).to.equal(true, 'New issuer should be added')
      })

      it('should revert if the caller is not a admin', async () => {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newAdmin = ethers.Wallet.createRandom().address

        await expect(contract.connect(attacker).setIssuer(newAdmin, true)).to.be.revertedWith(
          'Only the admin can call this function'
        )
      })

      it('should revert when setting issuer with zero address', async function () {
        const { contract, deployer: admin } = await loadFixture(deployFixture)

        await expect(
          contract.connect(admin).setIssuer(ethers.constants.AddressZero, true)
        ).to.be.revertedWith('Zero address is not allowed')
      })

      it('should revert when setting a zero address as issuer', async function () {
        const { contract } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero

        await expect(contract.setIssuer(zeroAddress, true)).to.be.revertedWith(
          'Zero address is not allowed'
        )
      })
    })

    describe('remove issuer', () => {
      it('should revoke the issuer role from the specified account', async () => {
        const { contract, issuer } = await loadFixture(deployFixture)
        expect(await contract.isIssuer(issuer.address)).to.be.true

        await contract.setIssuer(issuer.address, false)
        expect(await contract.isIssuer(issuer.address)).to.be.false
      })

      it('should revert if the caller is not a admin', async () => {
        const { contract, attacker } = await loadFixture(deployFixture)
        const newIssuer = ethers.Wallet.createRandom().address

        await expect(contract.connect(attacker).setIssuer(newIssuer, false)).to.be.revertedWith(
          'Only the admin can call this function'
        )
      })
    })

    describe('Get Issuer', () => {
      it('should return true if account is an issuer', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)

        const isIssuer = await contract.isIssuer(issuer.address)
        expect(isIssuer).to.equal(true, 'Account should be an issuer')
      })

      it('should return false if account is not an issuer', async function () {
        const { contract, attacker } = await loadFixture(deployFixture)

        const isIssuer = await contract.isIssuer(attacker.address)
        expect(isIssuer).to.equal(false, 'Account should not be an issuer')
      })
    })

    describe('Allowed Social Links', () => {
      it('should return true for allowed social links', async function () {
        const { contract } = await loadFixture(deployFixture)

        const allowedPlatforms = ['s_x', 's_linkedin']
        const allowed = await contract.getAllowedSocialLinks(allowedPlatforms)

        for (const [i, allowedPlatform] of allowedPlatforms.entries()) {
          expect(allowed[i]).to.equal(true, `${allowedPlatform} should be allowed`)
        }
      })

      it('should return false for disallowed social links', async function () {
        const { contract } = await loadFixture(deployFixture)

        const disallowedPlatforms = ['instagram', 'pinterest']
        const allowed = await contract.getAllowedSocialLinks(disallowedPlatforms)

        for (const [i, disallowedPlatform] of disallowedPlatforms.entries()) {
          expect(allowed[i]).to.equal(false, `${disallowedPlatform} should not be allowed`)
        }
      })
    })

    describe('Allowed Social Links Management', () => {
      it('should add a new allowed social link', async function () {
        const { contract, deployer } = await loadFixture(deployFixture)

        const newPlatform = 'instagram'
        await contract.setAllowedSocialLink(newPlatform, true)

        const [isAllowed] = await contract.getAllowedSocialLinks([newPlatform])
        expect(isAllowed).to.equal(true, `${newPlatform} should be allowed`)
      })

      it('should remove an allowed social link', async function () {
        const { contract, deployer } = await loadFixture(deployFixture)

        const platformToRemove = 's_x'
        await contract.setAllowedSocialLink(platformToRemove, false)

        const [isAllowed] = await contract.getAllowedSocialLinks([platformToRemove])
        expect(isAllowed).to.equal(false, `${platformToRemove} should not be allowed`)
      })

      it('should revert when adding allowed social link by non-admin', async function () {
        const { contract, attacker } = await loadFixture(deployFixture)

        const newPlatform = 's_facebook'

        await expect(
          contract.connect(attacker).setAllowedSocialLink(newPlatform, true)
        ).to.be.revertedWith('Only the admin can call this function')
      })

      it('should revert when removing allowed social link by non-admin', async function () {
        const { contract, attacker } = await loadFixture(deployFixture)

        const platformToRemove = 's_x'

        await expect(
          contract.connect(attacker).setAllowedSocialLink(platformToRemove, true)
        ).to.be.revertedWith('Only the admin can call this function')
      })
    })

    describe('setSocialLink function', function () {
      it('should add a social link for a user', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const platform = 's_x'
        const link = 'https://x.com/user_handle'

        await contract.setAllowedSocialLink(platform, true)

        await contract.connect(issuer).setSocialLink(platform, link, user.address)
        const [name, image, handle, links] = await contract.getUserProfileAndSocialLinks(
          user.address,
          [platform]
        )
        expect(links[0]).to.equal(link)
      })

      it('should remove a social link for a user', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const platform = 's_x'
        const link = ''

        await contract.setAllowedSocialLink(platform, true)

        await contract.connect(issuer).setSocialLink(platform, link, user.address)
        const [name, image, handle, links] = await contract.getUserProfileAndSocialLinks(
          user.address,
          [platform]
        )
        expect(links[0]).to.equal(link)
      })

      it('should revert when a non-issuer tries to add a social link', async function () {
        const { contract, attacker, user } = await loadFixture(deployFixture)
        const platform = 's_x'
        const link = 'https://x.com/user_handle'

        await expect(
          contract.connect(attacker).setSocialLink(platform, link, user.address)
        ).to.be.revertedWith('Only the issuer can call this function')
      })

      it('should revert when adding a non-allowed social link', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const invalidPlatform = 'non_allowed_platform'
        const link = 'https://nonallowed.com/user_handle'

        await expect(
          contract.connect(issuer).setSocialLink(invalidPlatform, link, user.address)
        ).to.be.revertedWith('This social link platform is not allowed')
      })

      it('should revert when trying to set a social link if contract is paused', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const platform = 's_twitter'
        const link = 'https://twitter.com/user_handle'

        await contract.setAllowedSocialLink(platform, true)

        await contract.setPause(true)

        await expect(
          contract.connect(issuer).setSocialLink(platform, link, user.address)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should revert when setting a social link with a zero address user', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const platform = 's_x'
        const link = 'https://x.com/user_handle'

        await expect(
          contract.connect(issuer).setSocialLink(platform, link, zeroAddress)
        ).to.be.revertedWith('Zero address is not allowed')
      })
    })

    describe('setUserName Function', function () {
      it('should set the user\'s name', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const newName = 'Alice'

        await contract.connect(issuer).setUserName(user.address, newName)

        const [name, image, handle, links] = await contract.getUserProfileAndSocialLinks(
          user.address,
          []
        )
        expect(name).to.equal(newName)
      })

      it('should revert if a non-issuer tries to set the user\'s name', async function () {
        const { contract, attacker, user } = await loadFixture(deployFixture)
        const newName = 'Alice'

        await expect(
          contract.connect(attacker).setUserName(user.address, newName)
        ).to.be.revertedWith('Only the issuer can call this function')
      })

      it('should revert when trying to set user\'s name if contract is paused', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const newName = 'NewUserName'

        await contract.setPause(true)

        await expect(
          contract.connect(issuer).setUserName(user.address, newName)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should revert when setting a user\'s name for a zero address user', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const newName = 'Alice'

        await expect(
          contract.connect(issuer).setUserName(zeroAddress, newName)
        ).to.be.revertedWith('Zero address is not allowed')
      })
    })

    describe('setUserImage Function', function () {
      it('should set the user\'s profile image', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const newImage = 'http://example.com/newimage.jpg'

        await contract.connect(issuer).setUserImage(user.address, newImage)

        const [, profileImage, ,] = await contract.getUserProfileAndSocialLinks(user.address, [])
        expect(profileImage).to.equal(newImage)
      })

      it('should revert if a non-issuer tries to set the user\'s profile image', async function () {
        const { contract, attacker, user } = await loadFixture(deployFixture)
        const newImage = 'http://example.com/newimage.jpg'

        await expect(
          contract.connect(attacker).setUserImage(user.address, newImage)
        ).to.be.revertedWith('Only the issuer can call this function')
      })

      it('should revert when trying to set user\'s profile image if contract is paused', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const newImage = 'http://example.com/newimage.jpg'

        await contract.setPause(true)

        await expect(
          contract.connect(issuer).setUserImage(user.address, newImage)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should revert when setting a user image for a zero address user', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const newImage = 'http://example.com/newimage.jpg'

        await expect(
          contract.connect(issuer).setUserImage(zeroAddress, newImage)
        ).to.be.revertedWith('Zero address is not allowed')
      })
    })

    describe('setUserHandle Function', function () {
      it('should set the user\'s handle', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const newHandle = 'newUserHandle'

        await contract.connect(issuer).setUserHandle(user.address, newHandle)

        const handle = (await contract.getUserProfileAndSocialLinks(user.address, []))[2]
        expect(handle).to.equal(newHandle)
      })

      it('should revert if a non-issuer tries to set the user\'s handle', async function () {
        const { contract, attacker, user } = await loadFixture(deployFixture)
        const newHandle = 'newUserHandle'

        await expect(
          contract.connect(attacker).setUserHandle(user.address, newHandle)
        ).to.be.revertedWith('Only the issuer can call this function')
      })

      it('should revert when trying to set user\'s handle if contract is paused', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const newHandle = 'newUserHandle'

        await contract.setPause(true)

        await expect(
          contract.connect(issuer).setUserHandle(user.address, newHandle)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should revert when setting a user handle for a zero address user', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const newHandle = 'newUserHandle'

        await expect(
          contract.connect(issuer).setUserHandle(zeroAddress, newHandle)
        ).to.be.revertedWith('Zero address is not allowed')
      })
    })

    describe('setSocialLinks Function', function () {
      it('should set multiple social links for a user', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const _platforms = ['s_x', 's_facebook']
        const _links = ['https://x.com/user_handle', 'https://facebook.com/user_handle']

        await contract.connect(issuer).setSocialLinks(_platforms, _links, user.address)

        const [name, image, handle, links] = await contract.getUserProfileAndSocialLinks(
          user.address,
          _platforms
        )

        expect(links).to.deep.equal(_links)
      })

      it('should revert if a non-issuer tries to set multiple social links', async function () {
        const { contract, attacker, user } = await loadFixture(deployFixture)
        const platforms = ['s_x', 's_facebook']
        const links = ['https://x.com/user_handle', 'https://facebook.com/user_handle']

        await expect(
          contract.connect(attacker).setSocialLinks(platforms, links, user.address)
        ).to.be.revertedWith('Only the issuer can call this function')
      })

      it('should revert if called when the contract is paused', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        await contract.setPause(true)

        const platforms = ['s_x', 's_facebook']
        const links = ['https://x.com/user_handle', 'https://facebook.com/user_handle']

        await expect(
          contract.connect(issuer).setSocialLinks(platforms, links, user.address)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should revert if the number of platforms and links are not equal', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const platforms = ['s_x', 's_facebook']
        const links = ['https://x.com/user_handle']

        await expect(
          contract.connect(issuer).setSocialLinks(platforms, links, user.address)
        ).to.be.revertedWith('The number of platforms and links must be equal')
      })

      it('should set social links for allowed platforms', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const platforms = ['notAllowedPlatform', 's_facebook']
        const links = [
          'https://notAllowedPlatform.com/user_handle',
          'https://facebook.com/user_handle'
        ]

        await contract.connect(issuer).setSocialLinks(platforms, links, user.address)

        const userLinks = (
          await contract.getUserProfileAndSocialLinks(user.address, platforms)
        )[3]
        expect(userLinks).to.deep.equal(['', links[1]])
      })

      it('should revert when setting social links with a zero address user', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const platforms = ['s_x', 's_facebook']
        const links = ['https://x.com/user_handle', 'https://facebook.com/user_handle']

        await expect(
          contract.connect(issuer).setSocialLinks(platforms, links, zeroAddress)
        ).to.be.revertedWith('Zero address is not allowed')
      })
    })

    describe('setUserProfile Function', function () {
      it('should set the user profile details', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        const _name = 'New Name'
        const _handle = 'NewHandle'
        const profileImage = 'http://example.com/newimage.jpg'

        await contract.connect(issuer).setUserProfile(user.address, _name, _handle, profileImage)

        const [name, image, handle, links] = await contract.getUserProfileAndSocialLinks(
          user.address,
          []
        )
        expect(name).to.equal(_name)
        expect(handle).to.equal(_handle)
        expect(profileImage).to.equal(profileImage)
      })

      it('should revert if a non-issuer tries to set the user profile', async function () {
        const { contract, attacker, user } = await loadFixture(deployFixture)
        const name = 'New Name'
        const handle = 'NewHandle'
        const profileImage = 'http://example.com/newimage.jpg'

        await expect(
          contract.connect(attacker).setUserProfile(user.address, name, handle, profileImage)
        ).to.be.revertedWith('Only the issuer can call this function')
      })

      it('should revert if called when the contract is paused', async function () {
        const { contract, issuer, user } = await loadFixture(deployFixture)
        await contract.setPause(true)

        const name = 'New Name'
        const handle = 'NewHandle'
        const profileImage = 'http://example.com/newimage.jpg'

        await expect(
          contract.connect(issuer).setUserProfile(user.address, name, handle, profileImage)
        ).to.be.revertedWith('Pausable: paused')
      })

      it('should revert when setting a user profile for a zero address user', async function () {
        const { contract, issuer } = await loadFixture(deployFixture)
        const zeroAddress = ethers.constants.AddressZero
        const name = 'New Name'
        const handle = 'NewHandle'
        const profileImage = 'http://example.com/newimage.jpg'

        await expect(
          contract.connect(issuer).setUserProfile(zeroAddress, name, handle, profileImage)
        ).to.be.revertedWith('Zero address is not allowed')
      })
    })
  })
  : describe.skip
