import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AdminSet } from "../generated/schema"
import { AdminSet as AdminSetEvent } from "../generated/BonuzTokens/BonuzTokens"
import { handleAdminSet } from "../src/bonuz-tokens"
import { createAdminSetEvent } from "./bonuz-tokens-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let account = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let isAdmin = "boolean Not implemented"
    let newAdminSetEvent = createAdminSetEvent(account, isAdmin)
    handleAdminSet(newAdminSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AdminSet created and stored", () => {
    assert.entityCount("AdminSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AdminSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "account",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AdminSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "isAdmin",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
