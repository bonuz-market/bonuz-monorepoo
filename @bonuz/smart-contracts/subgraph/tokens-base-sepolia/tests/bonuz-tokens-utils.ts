import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AdminSet,
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  IssuerSet,
  Locked,
  LoyaltyPointsAdded,
  LoyaltyPointsRemoved,
  MetadataUpdate,
  OwnershipTransferred,
  Paused,
  TokenMinted,
  TokenRedeemed,
  Transfer,
  Unlocked,
  Unpaused
} from "../generated/BonuzTokens/BonuzTokens"

export function createAdminSetEvent(
  account: Address,
  isAdmin: boolean
): AdminSet {
  let adminSetEvent = changetype<AdminSet>(newMockEvent())

  adminSetEvent.parameters = new Array()

  adminSetEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  adminSetEvent.parameters.push(
    new ethereum.EventParam("isAdmin", ethereum.Value.fromBoolean(isAdmin))
  )

  return adminSetEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createIssuerSetEvent(
  account: Address,
  isIssuer: boolean
): IssuerSet {
  let issuerSetEvent = changetype<IssuerSet>(newMockEvent())

  issuerSetEvent.parameters = new Array()

  issuerSetEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  issuerSetEvent.parameters.push(
    new ethereum.EventParam("isIssuer", ethereum.Value.fromBoolean(isIssuer))
  )

  return issuerSetEvent
}

export function createLockedEvent(tokenId: BigInt): Locked {
  let lockedEvent = changetype<Locked>(newMockEvent())

  lockedEvent.parameters = new Array()

  lockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return lockedEvent
}

export function createLoyaltyPointsAddedEvent(
  issuer: Address,
  tokenId: BigInt,
  points: BigInt
): LoyaltyPointsAdded {
  let loyaltyPointsAddedEvent = changetype<LoyaltyPointsAdded>(newMockEvent())

  loyaltyPointsAddedEvent.parameters = new Array()

  loyaltyPointsAddedEvent.parameters.push(
    new ethereum.EventParam("issuer", ethereum.Value.fromAddress(issuer))
  )
  loyaltyPointsAddedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  loyaltyPointsAddedEvent.parameters.push(
    new ethereum.EventParam("points", ethereum.Value.fromUnsignedBigInt(points))
  )

  return loyaltyPointsAddedEvent
}

export function createLoyaltyPointsRemovedEvent(
  issuer: Address,
  tokenId: BigInt,
  points: BigInt
): LoyaltyPointsRemoved {
  let loyaltyPointsRemovedEvent = changetype<LoyaltyPointsRemoved>(
    newMockEvent()
  )

  loyaltyPointsRemovedEvent.parameters = new Array()

  loyaltyPointsRemovedEvent.parameters.push(
    new ethereum.EventParam("issuer", ethereum.Value.fromAddress(issuer))
  )
  loyaltyPointsRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  loyaltyPointsRemovedEvent.parameters.push(
    new ethereum.EventParam("points", ethereum.Value.fromUnsignedBigInt(points))
  )

  return loyaltyPointsRemovedEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createTokenMintedEvent(
  issuer: Address,
  owner: Address,
  tokenId: BigInt,
  tokenType: string,
  name: string,
  desc: string,
  imageURL: string,
  isSoulBound: boolean,
  expiryDate: BigInt,
  points: BigInt,
  metadataJson: string
): TokenMinted {
  let tokenMintedEvent = changetype<TokenMinted>(newMockEvent())

  tokenMintedEvent.parameters = new Array()

  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("issuer", ethereum.Value.fromAddress(issuer))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("tokenType", ethereum.Value.fromString(tokenType))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("desc", ethereum.Value.fromString(desc))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("imageURL", ethereum.Value.fromString(imageURL))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "isSoulBound",
      ethereum.Value.fromBoolean(isSoulBound)
    )
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "expiryDate",
      ethereum.Value.fromUnsignedBigInt(expiryDate)
    )
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam("points", ethereum.Value.fromUnsignedBigInt(points))
  )
  tokenMintedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataJson",
      ethereum.Value.fromString(metadataJson)
    )
  )

  return tokenMintedEvent
}

export function createTokenRedeemedEvent(
  issuer: Address,
  tokenId: BigInt
): TokenRedeemed {
  let tokenRedeemedEvent = changetype<TokenRedeemed>(newMockEvent())

  tokenRedeemedEvent.parameters = new Array()

  tokenRedeemedEvent.parameters.push(
    new ethereum.EventParam("issuer", ethereum.Value.fromAddress(issuer))
  )
  tokenRedeemedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenRedeemedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUnlockedEvent(tokenId: BigInt): Unlocked {
  let unlockedEvent = changetype<Unlocked>(newMockEvent())

  unlockedEvent.parameters = new Array()

  unlockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return unlockedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
