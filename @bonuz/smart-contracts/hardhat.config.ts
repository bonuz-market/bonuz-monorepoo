/* eslint-disable simple-import-sort/imports */
import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy-ethers'
import 'dotenv/config'
import 'hardhat-contract-sizer'
// import '@nomiclabs/hardhat-solhint'

import '@nomicfoundation/hardhat-toolbox'
// * by importing hardhat-toolbox, we don't need to import these packages ==> https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox
// @nomiclabs/hardhat-ethers
// @nomiclabs/hardhat-etherscan
// hardhat-gas-reporter
// solidity-coverage
// @typechain/hardhat

//-------------------------------------------------------------

const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL ||
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  'https://eth-mainnet.alchemyapi.io/v2/your-api-key'

const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL || 'https://eth-goerli.alchemyapi.io/v2/your-api-key'

const POLYGON_MUMBAI_RPC_URL =
  process.env.POLYGON_MUMBAI_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/your-api-key'

const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-mainnet.alchemyapi.io/v2/your-api-key'

const PRIVATE_KEY = process.env.PRIVATE_KEY
// optional
// const MNEMONIC = process.env.MNEMONIC || 'your mnemonic'

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'Your etherscan API key'

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || 'Your polygonscan API key'

const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'
const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'

const CORE_BLOCKCHAIN_TESTNET_RPC_URL = process.env.CORE_BLOCKCHAIN_TESTNET_RPC_URL || 'https://rpc.testnet.core.blockchain.com'
const CORE_BLOCKCHAIN_MAINNET_RPC_URL = process.env.CORE_BLOCKCHAIN_MAINNET_RPC_URL || 'https://rpc.mainnet.core.blockchain.com'

const BASE_MAINNET_RPC_URL = process.env.BASE_MAINNET_RPC_URL || 'https://base.llamarpc.com'
const BASE_SEPOLIA_TESTNET_RPC_URL = process.env.BASE_SEPOLIA_TESTNET_RPC_URL || 'https://base.llamadev.com'

const REPORT_GAS = process.env.REPORT_GAS === 'true' //! BE CAREFUL: Turning on the gas report can make tests take longer. This is because Hardhat uses CoinMarketCap API for prices and compute gas costs for each function.
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'You coinmarketcap API key'
//-------------------------------------------------------------

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
      chainId: 31_337,
      allowUnlimitedContractSize: true // * This is to fix: trying to deploy a contract whose code is too large
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31_337
    },
    polygon_mumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      saveDeployments: true,
      chainId: 80_001
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      // accounts: {
      //   mnemonic: MNEMONIC
      // },
      saveDeployments: true,
      chainId: 5
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      //   accounts: {
      //     mnemonic: MNEMONIC,
      //   },
      saveDeployments: true,
      chainId: 1
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      // accounts: {
      //   mnemonic: MNEMONIC
      // },
      saveDeployments: true,
      chainId: 137
    },
    bsc: {
      url: BSC_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 56,
      saveDeployments: true,
    },
    bscTestnet: {
      url: BSC_TESTNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 97,
      saveDeployments: true,
    },
    arbitrum_one: {
      url: ARBITRUM_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 42_161,
      saveDeployments: true,
    },
    arbitrum_nova: {
      url: ARBITRUM_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 42_170,
      saveDeployments: true,
    },
    core_blockchain_testnet: {
      url: CORE_BLOCKCHAIN_TESTNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 1115,
      saveDeployments: true,
    },
    core_blockchain_mainnet: {
      url: CORE_BLOCKCHAIN_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 1116,
      saveDeployments: true,
    },
    base_mainnet: {
      url: BASE_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY],
      chainId: 8453,
      saveDeployments: true,
    },
    base_sepolia_testnet: {
      url: BASE_SEPOLIA_TESTNET_RPC_URL,
      accounts: PRIVATE_KEY === undefined ? [] : [PRIVATE_KEY
      ],
      chainId: 84_532,
      saveDeployments: true,
    }
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      rinkeby: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY, // Comment this when you don't want to send request to the coinmarketcap
    // token: 'ETH', // check price on Ethereum -- DEFAULT
    // token: 'MATIC', // to check price on Polygon,
    // token: 'BNB', // Binance

    // token: 'ARB_ETH', // Native currency of the Arbitrum Nova network, set to 'ETH' if it's the same as Ethereum
    // gasPriceApi: 'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice', // API endpoint for the gas price of Arbitrum Nova, if available
  },

  // solidity: "0.8.17",
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 20, // By increasing runs, you are telling the optimizer that the functions on the contract are going to be called very often, so the optimizer will try and make functions cheaper to call, even if this means it has to inline/repeat some code… resulting in a larger contract with higher one-time initial deployment gas cost. So what the OP wants to be doing here is the opposite, to lower runs, to encourage the optimizer to save on initial deployment gas — in order to lower this cost, the optimizer will try and make the contract bytecode smaller, which might bring it back below the limit ==> https://ethereum.stackexchange.com/a/129308
          },
          // viaIR: true,
        },
      },
      {
        version: '0.6.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 20, // By increasing runs, you are telling the optimizer that the functions on the contract are going to be called very often, so the optimizer will try and make functions cheaper to call, even if this means it has to inline/repeat some code… resulting in a larger contract with higher one-time initial deployment gas cost. So what the OP wants to be doing here is the opposite, to lower runs, to encourage the optimizer to save on initial deployment gas — in order to lower this cost, the optimizer will try and make the contract bytecode smaller, which might bring it back below the limit ==> https://ethereum.stackexchange.com/a/129308

          }
        }
      }
    ],

  },

  // namedAccounts: {
  //   deployer: {
  //     default: 0, // here this will by default take the first account as deployer
  //     1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
  //   },

  //   bob: {
  //     default: 1,
  //     1: 1,
  //   },
  //   alice: {
  //     default: 2,
  //     1: 2,
  //   },
  //   trudy: {
  //     default: 3,
  //     1: 3,
  //   },
  // },
  mocha: {
    timeout: 200_000 // 200 seconds max for running tests
  }
}

export default config
