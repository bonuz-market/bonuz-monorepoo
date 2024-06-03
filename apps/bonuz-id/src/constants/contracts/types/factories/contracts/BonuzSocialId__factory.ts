/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  BonuzSocialId,
  BonuzSocialIdInterface,
} from "../../contracts/BonuzSocialId";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "platform",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "allowed",
        type: "bool",
      },
    ],
    name: "AllowedSocialLinkSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isIssuer",
        type: "bool",
      },
    ],
    name: "IssuerSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "platform",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "link",
        type: "string",
      },
    ],
    name: "SocialLinkSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "platforms",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "links",
        type: "string[]",
      },
    ],
    name: "SocialLinksSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "handle",
        type: "string",
      },
    ],
    name: "UserHandleSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "profileImage",
        type: "string",
      },
    ],
    name: "UserImageSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "UserNameSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "_platforms",
        type: "string[]",
      },
    ],
    name: "getAllowedSocialLinks",
    outputs: [
      {
        internalType: "bool[]",
        name: "",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getIssuer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "string[]",
        name: "_platforms",
        type: "string[]",
      },
    ],
    name: "getUserProfileAndSocialLinks",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_initialIssuers",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "_initialAllowedPlatforms",
        type: "string[]",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_platform",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_allowed",
        type: "bool",
      },
    ],
    name: "setAllowedSocialLink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_switch",
        type: "bool",
      },
    ],
    name: "setIssuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_switch",
        type: "bool",
      },
    ],
    name: "setPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userProfiles",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "profileImage",
        type: "string",
      },
      {
        internalType: "string",
        name: "handle",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611433806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a45760003560e01c80631939475f146100a9578063332d56d7146100d2578063495289be146100f45780635c975abb146101095780635f61a2d414610120578063715018a6146101335780638da5cb5b1461013b578063bedb86fb14610150578063cc16f51514610163578063e043684214610186578063f2fde38b14610199578063fef03da3146101ac575b600080fd5b6100bc6100b7366004610f78565b6101d8565b6040516100c99190610fb4565b60405180910390f35b6100e56100e0366004611016565b6102a9565b6040516100c993929190611088565b6101076101023660046110db565b610463565b005b60655460ff165b60405190151581526020016100c9565b61010761012e36600461110e565b6104cb565b610107610549565b61014361055d565b6040516100c99190611152565b61010761015e366004611166565b61056c565b610176610171366004611181565b61058d565b6040516100c994939291906111ce565b61010761019436600461126a565b610902565b6101076101a7366004611016565b610b0d565b6101106101ba366004611016565b6001600160a01b031660009081526098602052604090205460ff1690565b6060600082516001600160401b038111156101f5576101f5610e11565b60405190808252806020026020018201604052801561021e578160200160208202803683370190505b50905060005b83518110156102a25760998482815181106102415761024161131f565b60200260200101516040516102569190611335565b90815260405190819003602001902054825160ff909116908390839081106102805761028061131f565b911515602092830291909101909101528061029a81611351565b915050610224565b5092915050565b6097602052600090815260409020805481906102c490611378565b80601f01602080910402602001604051908101604052809291908181526020018280546102f090611378565b801561033d5780601f106103125761010080835404028352916020019161033d565b820191906000526020600020905b81548152906001019060200180831161032057829003601f168201915b50505050509080600101805461035290611378565b80601f016020809104026020016040519081016040528092919081815260200182805461037e90611378565b80156103cb5780601f106103a0576101008083540402835291602001916103cb565b820191906000526020600020905b8154815290600101906020018083116103ae57829003601f168201915b5050505050908060020180546103e090611378565b80601f016020809104026020016040519081016040528092919081815260200182805461040c90611378565b80156104595780601f1061042e57610100808354040283529160200191610459565b820191906000526020600020905b81548152906001019060200180831161043c57829003601f168201915b5050505050905083565b61046b610b83565b6001600160a01b038216600081815260986020908152604091829020805460ff191685151590811790915591519182527fc6aeabbc4fc4eb208b2b4cec7249245167cb6191c47e2e6f82a3cd59a89ce7e191015b60405180910390a25050565b6104d3610b83565b806099836040516104e49190611335565b908152604051908190036020018120805492151560ff1990931692909217909155610510908390611335565b6040519081900381208215158252907fd5662bad1c854950e881e09f82279544bf44c05fc3774a508824a7678fe9a4a8906020016104bf565b610551610b83565b61055b6000610be2565b565b6033546001600160a01b031690565b610574610b83565b801561058557610582610c34565b50565b610582610c88565b6001600160a01b03821660009081526097602052604081208251606092839283928392906001600160401b038111156105c8576105c8610e11565b6040519080825280602002602001820160405280156105fb57816020015b60608152602001906001900390816105e65790505b50905060005b875181101561073d57609988828151811061061e5761061e61131f565b60200260200101516040516106339190611335565b9081526040519081900360200190205460ff161561072b57826003018882815181106106615761066161131f565b60200260200101516040516106769190611335565b9081526020016040518091039020805461068f90611378565b80601f01602080910402602001604051908101604052809291908181526020018280546106bb90611378565b80156107085780601f106106dd57610100808354040283529160200191610708565b820191906000526020600020905b8154815290600101906020018083116106eb57829003601f168201915b505050505082828151811061071f5761071f61131f565b60200260200101819052505b8061073581611351565b915050610601565b508160000182600101836002018383805461075790611378565b80601f016020809104026020016040519081016040528092919081815260200182805461078390611378565b80156107d05780601f106107a5576101008083540402835291602001916107d0565b820191906000526020600020905b8154815290600101906020018083116107b357829003601f168201915b505050505093508280546107e390611378565b80601f016020809104026020016040519081016040528092919081815260200182805461080f90611378565b801561085c5780601f106108315761010080835404028352916020019161085c565b820191906000526020600020905b81548152906001019060200180831161083f57829003601f168201915b5050505050925081805461086f90611378565b80601f016020809104026020016040519081016040528092919081815260200182805461089b90611378565b80156108e85780601f106108bd576101008083540402835291602001916108e8565b820191906000526020600020905b8154815290600101906020018083116108cb57829003601f168201915b505050505091509550955095509550505092959194509250565b600054610100900460ff16158080156109225750600054600160ff909116105b8061093c5750303b15801561093c575060005460ff166001145b6109a45760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff1916600117905580156109c7576000805461ff0019166101001790555b6109cf610cc1565b6109d7610cf0565b336000908152609860205260408120805460ff191660011790555b8351811015610a5757600160986000868481518110610a1357610a1361131f565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905580610a4f81611351565b9150506109f2565b5060005b8251811015610ac15760016099848381518110610a7a57610a7a61131f565b6020026020010151604051610a8f9190611335565b908152604051908190036020019020805491151560ff1990921691909117905580610ab981611351565b915050610a5b565b508015610b08576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050565b610b15610b83565b6001600160a01b038116610b7a5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161099b565b61058281610be2565b33610b8c61055d565b6001600160a01b03161461055b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161099b565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b610c3c610d1f565b6065805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610c713390565b604051610c7e9190611152565b60405180910390a1565b610c90610d65565b6065805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa33610c71565b600054610100900460ff16610ce85760405162461bcd60e51b815260040161099b906113b2565b61055b610dae565b600054610100900460ff16610d175760405162461bcd60e51b815260040161099b906113b2565b61055b610dde565b60655460ff161561055b5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b604482015260640161099b565b60655460ff1661055b5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b604482015260640161099b565b600054610100900460ff16610dd55760405162461bcd60e51b815260040161099b906113b2565b61055b33610be2565b600054610100900460ff16610e055760405162461bcd60e51b815260040161099b906113b2565b6065805460ff19169055565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715610e4f57610e4f610e11565b604052919050565b60006001600160401b03821115610e7057610e70610e11565b5060051b60200190565b600082601f830112610e8b57600080fd5b81356001600160401b03811115610ea457610ea4610e11565b610eb7601f8201601f1916602001610e27565b818152846020838601011115610ecc57600080fd5b816020850160208301376000918101602001919091529392505050565b600082601f830112610efa57600080fd5b81356020610f0f610f0a83610e57565b610e27565b82815260059290921b84018101918181019086841115610f2e57600080fd5b8286015b84811015610f6d5780356001600160401b03811115610f515760008081fd5b610f5f8986838b0101610e7a565b845250918301918301610f32565b509695505050505050565b600060208284031215610f8a57600080fd5b81356001600160401b03811115610fa057600080fd5b610fac84828501610ee9565b949350505050565b6020808252825182820181905260009190848201906040850190845b81811015610fee578351151583529284019291840191600101610fd0565b50909695505050505050565b80356001600160a01b038116811461101157600080fd5b919050565b60006020828403121561102857600080fd5b61103182610ffa565b9392505050565b60005b8381101561105357818101518382015260200161103b565b50506000910152565b60008151808452611074816020860160208601611038565b601f01601f19169290920160200192915050565b60608152600061109b606083018661105c565b82810360208401526110ad818661105c565b905082810360408401526110c1818561105c565b9695505050505050565b8035801515811461101157600080fd5b600080604083850312156110ee57600080fd5b6110f783610ffa565b9150611105602084016110cb565b90509250929050565b6000806040838503121561112157600080fd5b82356001600160401b0381111561113757600080fd5b61114385828601610e7a565b925050611105602084016110cb565b6001600160a01b0391909116815260200190565b60006020828403121561117857600080fd5b611031826110cb565b6000806040838503121561119457600080fd5b61119d83610ffa565b915060208301356001600160401b038111156111b857600080fd5b6111c485828601610ee9565b9150509250929050565b6080815260006111e1608083018761105c565b6020838203818501526111f4828861105c565b91508382036040850152611208828761105c565b915083820360608501528185518084528284019150828160051b85010183880160005b8381101561125957601f1987840301855261124783835161105c565b9486019492509085019060010161122b565b50909b9a5050505050505050505050565b6000806040838503121561127d57600080fd5b82356001600160401b038082111561129457600080fd5b818501915085601f8301126112a857600080fd5b813560206112b8610f0a83610e57565b82815260059290921b840181019181810190898411156112d757600080fd5b948201945b838610156112fc576112ed86610ffa565b825294820194908201906112dc565b9650508601359250508082111561131257600080fd5b506111c485828601610ee9565b634e487b7160e01b600052603260045260246000fd5b60008251611347818460208701611038565b9190910192915050565b60006001820161137157634e487b7160e01b600052601160045260246000fd5b5060010190565b600181811c9082168061138c57607f821691505b6020821081036113ac57634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea2646970667358221220b11f4637cb11e24bfc2d4c931a9b93e512075aa0a0fcaa2e3c19aaaed0f0109464736f6c63430008110033";

type BonuzSocialIdConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BonuzSocialIdConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BonuzSocialId__factory extends ContractFactory {
  constructor(...args: BonuzSocialIdConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BonuzSocialId> {
    return super.deploy(overrides || {}) as Promise<BonuzSocialId>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): BonuzSocialId {
    return super.attach(address) as BonuzSocialId;
  }
  override connect(signer: Signer): BonuzSocialId__factory {
    return super.connect(signer) as BonuzSocialId__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BonuzSocialIdInterface {
    return new utils.Interface(_abi) as BonuzSocialIdInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BonuzSocialId {
    return new Contract(address, _abi, signerOrProvider) as BonuzSocialId;
  }
}
