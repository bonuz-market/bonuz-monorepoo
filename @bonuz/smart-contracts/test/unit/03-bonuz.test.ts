import { assert, expect } from 'chai'
import { deployments, ethers, getNamedAccounts, network } from 'hardhat'
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers'

import { developmentChains } from '../../helper-hardhat-config'
import { Bonuz } from '../../typechain-types'
import { tokens } from '../../utils/helper'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

developmentChains.includes(network.name)
  ? describe('BONUZ', function () {
    async function deployFixture() {
      const accounts = await ethers.getSigners() // could also do with getNamedAccounts
      // const namedAccounts = await getNamedAccounts()

      await deployments.fixture(['Bonuz'])

      const contract: Bonuz = await ethers.getContract('Bonuz')

      const [deployer, issuer, user, attacker] = accounts

      return {
        deployer,
        issuer,
        user,
        attacker,
        contract,
        ether: tokens
      }
    }

    it('Should have the correct setup', async function () {
      const { contract, deployer } = await loadFixture(deployFixture)

      const tokenName = await contract.name()
      const tokenSymbol = await contract.symbol()
      const tokenDecimals = await contract.decimals()
      const supply = await contract.totalSupply()
      const ownerBalance = await contract.balanceOf('0xB00Da7Ab600F076a753b3cE8ba53Ec96E4d89d37')

      const INITIAL_SUPPLY = '1000000000000000000000000000'

      assert.equal(
        supply.toString(),
        ownerBalance.toString(),
        'Owner has not all tokens at beginning'
      )
      assert.equal(
        supply.toString(),
        INITIAL_SUPPLY,
        'Contract has not the correct initial supply'
      )
      assert.equal(tokenName, 'Bonuz', 'Contract has not the correct name')
      assert.equal(tokenSymbol, 'BONUZ', 'Contract has not the correct symbol')
      assert.equal(tokenDecimals, 18, 'Contract decimals is not correct')
    })
  })
  : describe.skip
