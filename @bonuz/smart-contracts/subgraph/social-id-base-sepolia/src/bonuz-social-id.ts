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
  UserNameSet,
  UserProfile,
  SocialLink
} from "../generated/schema"


// Ensure a UserProfile entity exists and return it
function createUserProfileIfNotExists(userId: string): UserProfile {
  let userProfile = UserProfile.load(userId);
  if (!userProfile) {
    userProfile = new UserProfile(userId);
    userProfile.save();
  }
  return userProfile as UserProfile;
}

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

// export function handleSocialLinksSet(event: SocialLinksSetEvent): void {
//   let entity = new SocialLinksSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.user = event.params.user
//   entity.platforms = event.params.platforms
//   entity.links = event.params.links

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

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

// export function handleUserHandleSet(event: UserHandleSetEvent): void {
//   let entity = new UserHandleSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.user = event.params.user
//   entity.handle = event.params.handle

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleUserImageSet(event: UserImageSetEvent): void {
//   let entity = new UserImageSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.user = event.params.user
//   entity.profileImage = event.params.profileImage

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleUserNameSet(event: UserNameSetEvent): void {
//   let entity = new UserNameSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.user = event.params.user
//   entity.name = event.params.name

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// User profile and social links handling as previously described
export function handleUserHandleSet(event: UserHandleSetEvent): void {
  let userProfile = createUserProfileIfNotExists(event.params.user.toHexString());
  userProfile.handle = event.params.handle;
  userProfile.save();
}

export function handleUserImageSet(event: UserImageSetEvent): void {
  let userProfile = createUserProfileIfNotExists(event.params.user.toHexString());
  userProfile.profileImage = event.params.profileImage;
  userProfile.save();
}

export function handleUserNameSet(event: UserNameSetEvent): void {
  let userProfile = createUserProfileIfNotExists(event.params.user.toHexString());
  userProfile.name = event.params.name;
  userProfile.save();
}

// export function handleSocialLinksSet(event: SocialLinksSetEvent): void {
//   let userAddress = event.params.user.toHexString();
//   let platforms = event.params.platforms;
//   let links = event.params.links;
//   for (let i = 0; i < platforms.length; i++) {
//     let id = userAddress + "-" + platforms[i] + "-" + i.toString(); // Unique ID for each SocialLink
//     let socialLink = new SocialLink(id);
//     socialLink.user = createUserProfileIfNotExists(userAddress).id;
//     socialLink.platform = platforms[i];
//     socialLink.link = links[i];
//     socialLink.save();
//   }
// }

export function handleSocialLinksSet(event: SocialLinksSetEvent): void {
  let userAddress = event.params.user.toHexString();
  let platforms = event.params.platforms;
  let links = event.params.links;

  for (let i = 0; i < platforms.length; i++) {
    let socialLinkId = userAddress + "-" + platforms[i];
    let socialLink = SocialLink.load(socialLinkId);

    // If the social link does not exist or the event's timestamp is newer, update or create the link
    if (!socialLink || socialLink.lastUpdated < event.block.timestamp) {
      if (!socialLink) {
        socialLink = new SocialLink(socialLinkId);
      }

      socialLink.user = userAddress;
      socialLink.platform = platforms[i];
      socialLink.link = links[i];
      socialLink.lastUpdated = event.block.timestamp;
      socialLink.save();
    }
  }
}
