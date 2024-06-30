import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AdminSet,
  AllowedSocialLinkSet,
  IssuerSet,
  OwnershipTransferred,
  Paused,
  SocialLinkSet,
  SocialLinksSet,
  Unpaused,
  UserHandleSet,
  UserImageSet,
  UserNameSet
} from "../generated/BonuzSocialId/BonuzSocialId"

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

export function createAllowedSocialLinkSetEvent(
  platform: string,
  allowed: boolean
): AllowedSocialLinkSet {
  let allowedSocialLinkSetEvent = changetype<AllowedSocialLinkSet>(
    newMockEvent()
  )

  allowedSocialLinkSetEvent.parameters = new Array()

  allowedSocialLinkSetEvent.parameters.push(
    new ethereum.EventParam("platform", ethereum.Value.fromString(platform))
  )
  allowedSocialLinkSetEvent.parameters.push(
    new ethereum.EventParam("allowed", ethereum.Value.fromBoolean(allowed))
  )

  return allowedSocialLinkSetEvent
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

export function createSocialLinkSetEvent(
  user: Address,
  platform: string,
  link: string
): SocialLinkSet {
  let socialLinkSetEvent = changetype<SocialLinkSet>(newMockEvent())

  socialLinkSetEvent.parameters = new Array()

  socialLinkSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  socialLinkSetEvent.parameters.push(
    new ethereum.EventParam("platform", ethereum.Value.fromString(platform))
  )
  socialLinkSetEvent.parameters.push(
    new ethereum.EventParam("link", ethereum.Value.fromString(link))
  )

  return socialLinkSetEvent
}

export function createSocialLinksSetEvent(
  user: Address,
  platforms: Array<string>,
  links: Array<string>
): SocialLinksSet {
  let socialLinksSetEvent = changetype<SocialLinksSet>(newMockEvent())

  socialLinksSetEvent.parameters = new Array()

  socialLinksSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  socialLinksSetEvent.parameters.push(
    new ethereum.EventParam(
      "platforms",
      ethereum.Value.fromStringArray(platforms)
    )
  )
  socialLinksSetEvent.parameters.push(
    new ethereum.EventParam("links", ethereum.Value.fromStringArray(links))
  )

  return socialLinksSetEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}

export function createUserHandleSetEvent(
  user: Address,
  handle: string
): UserHandleSet {
  let userHandleSetEvent = changetype<UserHandleSet>(newMockEvent())

  userHandleSetEvent.parameters = new Array()

  userHandleSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userHandleSetEvent.parameters.push(
    new ethereum.EventParam("handle", ethereum.Value.fromString(handle))
  )

  return userHandleSetEvent
}

export function createUserImageSetEvent(
  user: Address,
  profileImage: string
): UserImageSet {
  let userImageSetEvent = changetype<UserImageSet>(newMockEvent())

  userImageSetEvent.parameters = new Array()

  userImageSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userImageSetEvent.parameters.push(
    new ethereum.EventParam(
      "profileImage",
      ethereum.Value.fromString(profileImage)
    )
  )

  return userImageSetEvent
}

export function createUserNameSetEvent(
  user: Address,
  name: string
): UserNameSet {
  let userNameSetEvent = changetype<UserNameSet>(newMockEvent())

  userNameSetEvent.parameters = new Array()

  userNameSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userNameSetEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return userNameSetEvent
}
