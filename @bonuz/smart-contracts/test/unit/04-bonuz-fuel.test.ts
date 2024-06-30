import { assert } from 'chai'
import { deployments, ethers, getNamedAccounts, network } from 'hardhat'

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { developmentChains } from '../../helper-hardhat-config'
import { Bfuel } from '../../typechain-types'
import { tokens } from '../../utils/helper'

developmentChains.includes(network.name)
  ? describe('BONUZ', function () {
    async function deployFixture() {
      const accounts = await ethers.getSigners() // could also do with getNamedAccounts
      // const namedAccounts = await getNamedAccounts()

      await deployments.fixture(['Bfuel'])

      const contract: Bfuel = await ethers.getContract('Bfuel')

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
      assert.equal(supply.toString(), INITIAL_SUPPLY, 'Contract has not the correct initial supply')
      assert.equal(tokenName, 'BonuzFuel', 'Contract has not the correct name')
      assert.equal(tokenSymbol, 'BFUEL', 'Contract has not the correct symbol')
      assert.equal(tokenDecimals, 18, 'Contract decimals is not correct')
    })
  })
  : describe.skip
