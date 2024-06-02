export const NETWORKS = {
  ALL: 0,
  BSC: 56,
  POLYGON: 137,
  AURORA: 1_313_161_554,
  ARBITRUM: 42_161,
  ARBITRUM_NOVA: 42_170,
  AVALANCHE: 43_114,
  ETHEREUM: 1,
  OPTIMISM: 10,
  POLYGON_MUMBAI: 80_001,
  BASE: 8453,
  BITCOIN: -1,
  CORE: 1116,
} as const;

export const NETWORK_NAMES = {
  [NETWORKS.ALL]: 'All networks',
  [NETWORKS.ETHEREUM]: 'Ethereum',
  [NETWORKS.POLYGON]: 'Polygon',
  [NETWORKS.BSC]: 'BNB Smart Chain',
  [NETWORKS.AVALANCHE]: 'Avalanche',
  [NETWORKS.OPTIMISM]: 'Optimism',
  [NETWORKS.ARBITRUM]: 'Arbitrum',
  [NETWORKS.ARBITRUM_NOVA]: 'Arbitrum Nova',
  [NETWORKS.AURORA]: 'Aurora',
  [NETWORKS.POLYGON_MUMBAI]: 'Polygon Mumbai',
  [NETWORKS.BASE]: 'Base',
  [NETWORKS.BITCOIN]: 'Bitcoin',
  [NETWORKS.CORE]: 'Core',
} as const;

export const PROVIDERS = {
  [NETWORKS.ETHEREUM]:
    'https://rpc.ankr.com/eth/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.POLYGON]:
    'https://rpc.ankr.com/polygon/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.BSC]:
    'https://rpc.ankr.com/bsc/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.AVALANCHE]:
    'https://rpc.ankr.com/avalanche/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.OPTIMISM]:
    'https://rpc.ankr.com/optimism/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.ARBITRUM]:
    'https://rpc.ankr.com/arbitrum/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.ARBITRUM_NOVA]:
    'https://rpc.ankr.com/arbitrumnova/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.AURORA]: 'https://mainnet.aurora.dev',
  [NETWORKS.POLYGON_MUMBAI]:
    'https://rpc.ankr.com/polygon_mumbai/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.BASE]:
    'https://rpc.ankr.com/base/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
  [NETWORKS.CORE]:
    'https://rpc.ankr.com/core/1d437c5abdc444927602dcb076eb9489ab9c6563ff8983b7430e128c0a84f7fb',
} as { [networkId: number]: string };
