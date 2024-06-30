import {
  AdminSet as AdminSetEvent,
  AllowedSocialLinkSet as AllowedSocialLinkSetEvent,
  IssuerSet as IssuerSetEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  SocialLinkSet as SocialLinkSetEvent,
  SocialLinksSet as SocialLinksSetEvent,
  Unpaused as UnpausedEvent,
  UserHandleSet as UserHandleSetEvent,
  UserImageSet as UserImageSetEvent,
  UserNameSet as UserNameSetEvent
} from "../generated/BonuzSocialId/BonuzSocialId"
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
} from "../generated/schema"

export function handleAdminSet(event: AdminSetEvent): void {
  let entity = new AdminSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.isAdmin = event.params.isAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAllowedSocialLinkSet(
  event: AllowedSocialLinkSetEvent
): void {
  let entity = new AllowedSocialLinkSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.platform = event.params.platform.toString()
  entity.allowed = event.params.allowed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIssuerSet(event: IssuerSetEvent): void {
  let entity = new IssuerSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.isIssuer = event.params.isIssuer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSocialLinkSet(event: SocialLinkSetEvent): void {
  let entity = new SocialLinkSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.platform = event.params.platform
  entity.link = event.params.link

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSocialLinksSet(event: SocialLinksSetEvent): void {
  let entity = new SocialLinksSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.platforms = event.params.platforms
  entity.links = event.params.links

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserHandleSet(event: UserHandleSetEvent): void {
  let entity = new UserHandleSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.handle = event.params.handle

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserImageSet(event: UserImageSetEvent): void {
  let entity = new UserImageSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.profileImage = event.params.profileImage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserNameSet(event: UserNameSetEvent): void {
  let entity = new UserNameSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
