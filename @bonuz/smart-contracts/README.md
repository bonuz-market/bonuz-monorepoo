
# Bonuz Smart Contracts

## Introduction

This repository contains the Solidity smart contract for Bonuz. It also includes a set of tests to ensure the correctness of the contract's functionality.

_1. SocialID Module Overview_

The SocialID module facilitates the association of smart wallet addresses with on-chain data. This data includes key-value pairs, a username handle, and a picture URL. The primary authority over the module is vested in the deployer, who has the capability to appoint or revoke administrative privileges. These administrators are empowered to manage issuers, who are then responsible for manipulating user data via a front-end admin panel.

Key functionalities enabled by the module include:

- _Image Upload and Profile Management_: Images are uploaded to IPFS for profile picture setting.
- _Username Validation and Assignment_: Usernames are verified for uniqueness against our database before being assigned to specific wallet addresses.
- _Social Link Verification_: Social links are authenticated and, if validated, linked to the user as part of the key-value pairs.
- _Customization of Key-Value Pairs_: Issuers have the discretion to define the types of keys permissible within the key-value pairs.

Additionally, the module allows public access for retrieving stored user data through their wallet addresses.

_2. BonuzTokens System_

The BonuzTokens system operates under a hierarchical structure beginning with an owner, who appoints administrators. These administrators can subsequently designate issuers with the authority to mint NFTs. Our NFTs conform to the ERC721 standard, incorporating the metadata extension, the on-chain metadata update extension, and the soul-bound extension.

Key aspects of the BonuzTokens system include:

- _NFT Metadata Storage and Retrieval_: Metadata is stored on-chain, with the `tokenURI` function generating a dynamic JSON base64 upon each request.
- _NFT Attributes and Transferability_: Attributes of NFTs include 'isSoulBound' and 'expiryDate'. If an NFT is soul-bound or past its expiry date, the transfer function is disabled.
- _NFT Attribute Modification_: Issuers retain the ability to modify the attributes of NFTs they have minted, including adding or removing points, or redeeming the NFT.

This system ensures a structured and secure approach to NFT management and distribution.


## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/bonuz-market/BonuzSmartContracts.git
   

2. Install the required dependencies:

   `cd BonuzSmartContracts  `

   `npm install`

## Project Structure

- `contracts/`: Contains the smart contract source code written in Solidity.
- `test/`: Contains the tests for the smart contracts.
- `scripts/`: Contains scripts for managing the deployment and interaction with the smart contracts.
- `hardhat.config.js`: Configuration file for Hardhat, where you can set up networks (e.g., local, testnet, mainnet) and other project-specific settings.

## Available Scripts

The project provides the following scripts to help with development and testing:

- **clean**: Cleans the project build artifacts. Run `npm run clean`.
- **compile**: Compiles the Solidity contracts. Run `npm run compile`.
- **node**: Runs a local Hardhat node. Run `npm run node`.
- **console**: Opens a Hardhat console connected to the local development network. Run `npm run console`.
- **all:deploy:local**: Deploys all contracts to the local network. Run `npm run all:deploy:local`.
- **all:deploy:goerli**: Deploys all contracts to the Goerli network. Run `npm run all:deploy:goerli`.
- **all:deploy:polygon_mumbai**: Deploys all contracts to the Polygon Mumbai network. Run `npm run all:deploy:polygon_mumbai`.
- **all:test:local**: Runs all unit tests in the local environment. Run `npm run all:test:local`.
- **all:test:local:verbose**: Runs all unit tests in the local environment with verbose output. Run `npm run all:test:local:verbose`.
- **all:test2:local**: Runs specific unit tests in the local environment. Run `npm run all:test2:local`.
- **bonuzSocialId:deploy:local**: Deploys the BonuzSocialId contracts to the local network. Run `npm run bonuzSocialId:deploy:local`.
- **bonuzSocialId:deploy:hardhat**: Deploys the BonuzSocialId contracts to the Hardhat network. Run `npm run bonuzSocialId:deploy:hardhat`.
- **bonuzSocialId:deploy:polygon_mumbai**: Deploys the BonuzSocialId contracts to the Polygon Mumbai network. Run `npm run bonuzSocialId:deploy:polygon_mumbai`.
- **bonuzSocialId:scripts:polygon_mumbai**: Runs specific script for BonuzSocialId on the Polygon Mumbai network. Run `npm run bonuzSocialId:scripts:polygon_mumbai`.
- **bonuzSocialId:test:local**: Runs unit tests for the BonuzSocialId contracts in the local environment. Run `npm run bonuzSocialId:test:local`.
- **bonuzTokens:deploy:local**: Deploys the BonuzTokens contracts to the local network. Run `npm run bonuzTokens:deploy:local`.
- **bonuzTokens:deploy:goerli**: Deploys the BonuzTokens contracts to the Goerli network. Run `npm run bonuzTokens:deploy:goerli`.
- **bonuzTokens:deploy:polygon_mumbai**: Deploys the BonuzTokens contracts to the Polygon Mumbai network. Run `npm run bonuzTokens:deploy:polygon_mumbai`.
- **bonuzTokens:test:local**: Runs unit tests for the BonuzTokens contracts in the local environment. Run `npm run bonuzTokens:test:local`.
- **bonuzTokens:test:local:verbose**: Runs unit tests for the BonuzTokens contracts in the local environment with verbose output. Run `npm run bonuzTokens:test:local:verbose`.
- **bonuzTokens:scripts:local**: Runs specific script for BonuzTokens in the local environment. Run `npm run bonuzTokens:scripts:local`.
- **bonuzTokens:scripts:deploy:mint:polygon_mumbai**: Deploys the BonuzTokens contracts to the Polygon Mumbai network and runs minting script. Run `npm run bonuzTokens:scripts:deploy:mint:polygon_mumbai`.
- **bonuzTokens:scripts:polygon_mumbai**: Runs specific script for BonuzTokens on the Polygon Mumbai network. Run `npm run bonuzTokens:scripts:polygon_mumbai`.
- **lint**: Runs the Solhint linter on the Solidity contracts. Run `npm run lint`.
- **lint:fix**: Runs Solhint linter on the Solidity contracts and auto-fixes fixable issues. Run `npm run lint:fix`.
- **format**: Formats the project code using Prettier. Run `npm run format`.
- **coverage**: Runs code coverage analysis using Hardhat Coverage plugin. Run `npm run coverage`.
- **coverage2**: Runs code coverage analysis using Hardhat Coverage plugin and specific configuration file. Run `npm run coverage2`.
- **typechain**: Generates TypeScript typings for Ethereum smart contracts using TypeChain. Run `npm run typechain`.
- **prettier:solidity**: Formats the Solidity contracts using Prettier. Run `npm run prettier:solidity`.
- **flatten**: Flattens the Solidity contracts into a single file. Run `npm run flatten`.
- **flatten:bonuz**: Flattens the BONUZ.sol contract into a flattened file. Run `npm run flatten:bonuz`.
- **flatten:vesting**: Flattens the vesting.sol contract into a flattened file. Run `npm run flatten:vesting`.
- **size**: Measures the compiled size of the contracts. Run `npm run size`.

## Environment Variables

To run the project, you need to set up the environment variables.

To set up the environment variables, you can follow these steps:

1. Check `.env.example` file 

2. Create a new file named `.env` in the root directory of the project.

3. Open the `.env.example` file and copy the variables.

4. Paste the variables into the `.env` file.

5. Replace the placeholder values with the actual values for the project.

6. Save the .env file.

## Configuration

You can configure the project-specific settings in the `hardhat.config.js` file. For example, you can modify the network configuration, enable specific plugins, or customize task settings.

## Useful Links

- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development Tutorial](https://ethereum.org/greeter)