// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// 1. Pragma statements
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bfuel is ERC20, Ownable {
    constructor(address wallet) ERC20("BonuzFuel", "BFUEL") {
        _mint(wallet, 1000000000 * 10 ** decimals());
    }
}