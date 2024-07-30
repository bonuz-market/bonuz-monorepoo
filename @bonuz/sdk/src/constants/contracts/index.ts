// Import the JSON
import BonuzTokensJson from './abis/BonuzTokens.json';
import BonuzSocialIdJson from './abis/BonuzSocialId.json';

import SmartAccountJson from './abis/SmartAccount.json';
import _contractAddresses from './contractAddresses.json'

// The type of HexString
type HexString = `0x${string}`;

// The type of ContractAddresses
type ContractAddresses = {
  [key: string]: {
    [key: string]: HexString;
  };
}

// Assert the imported object as the ContractAddresses type
export const contractAddresses = _contractAddresses as unknown as ContractAddresses;

// Export BonuzTokensDraft2
export const BonuzTokens = BonuzTokensJson;
export const BonuzSocialId = BonuzSocialIdJson
export const SmartAccountAbi = SmartAccountJson.abi;
