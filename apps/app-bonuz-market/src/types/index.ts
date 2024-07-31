export * from './login'
export * from './socialAccounts'
export * from './user'
export * from './common'

// -------------------------
export enum NewPartnerStatus {
  IN_REVIEW = 'IN_REVIEW',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

// -------------------------
export enum TokenType {
  VOUCHER = 'VOUCHER',
  POP = 'POP',
  LOYALTY = 'LOYALTY',
  CERTIFICATE = 'CERTIFICATE',
  MEMBERSHIP = 'MEMBERSHIP',
}
// -------------------------

export enum PartnerStatus {
  In_Review = 'In_Review',
  Active = 'ACTIVE',
  Revoked = 'REVOKED',
}

// -------------------------

type SocialLink = {}

type Connection = {}

type Owner = {
  id: number
  walletAddress: string
  smartAccountAddress: string
  handle: string
  socialsLinks: SocialLink[]
  connections: Connection[]
  updatedAt: string
  createdAt: string
}

type ImageSize = {
  url: string | null
  width: number | null
  height: number | null
  mimeType: string | null
  filesize: number | null
  filename: string | null
}

type Image = {
  id: string
  alt: string | null
  updatedAt: string
  createdAt: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  width: number
  height: number
  focalX: number
  focalY: number
  sizes: {
    thumbnail: ImageSize
    card: ImageSize
    tablet: ImageSize
  }
}

type Banner = {
  id: string
  alt: string | null
  updatedAt: string
  createdAt: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  width: number
  height: number
  focalX: number
  focalY: number
  sizes: {
    thumbnail: ImageSize
    card: ImageSize
    tablet: ImageSize
  }
}

export interface CheckIns {
  id: string
  createdAt: string
  user: {
    id: string
    walletAddress: string
    smartAccountAddress: string
    handle: string
    createdAt: string
  }
}

type Quest = {}

type ItemType = 'WEB' | 'DAPP'

type TokenGating = 'YES' | 'NO'

export type App = {
  id: number
  name: string
  owner: Owner
  image: Image
  banner: Banner
  link: string
  type: ItemType
  check_ins: CheckIns[]
  tokenGating: TokenGating
  tokenGatingAmount: number
  contractAddress: string | null
  network: string
  quests: Quest[]
  updatedAt: string
  createdAt: string
}

export type Apps = App[] 
