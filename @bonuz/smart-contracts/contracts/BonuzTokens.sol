// solhint-disable reason-string
// solhint-disable not-rely-on-time
// solhint-disable quotes

// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

// Pragma statements
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Error Codes
error BonuzTokens__NotAnAdmin();
error BonuzTokens__NotAnIssuer();
error BonuzTokens__NotTokenIssuer();
error BonuzTokens__SoulBoundTokenCannotBeTransferred();
error BonuzTokens__ExpiredTokenCannotBeTransferred();
error BonuzTokens__RedeemedTokenCannotBeTransferred();
error BonuzTokens__VoucherAlreadyRedeemed();
error BonuzTokens__ExpiredTokenCannotBeRedeemed();
error BonuzTokens__InvalidTokenType();
error BonuzTokens__TokenMustBeSoulBound();
error BonuzTokens__ZeroAddressNotAllowed();

// Interfaces

// Libraries

// Contracts
contract BonuzTokens is ERC721, Pausable, Ownable, ReentrancyGuard {
  using Strings for uint256;

  // Type declarations
  struct Metadata {
    address issuer;
    string tokenType;
    string name;
    string desc;
    string imageURL;
    bool isSoulBound;
    uint256 redeemDate;
    uint256 expiryDate;
    uint256 points;
    string metadataJson;
  }

  // State variables
  mapping(uint256 => Metadata) private _token;
  mapping(address => bool) private _issuer;
  mapping(address => bool) private _admin;
  mapping(address => uint256[]) private _tokensByIssuer;

  uint256 private _tokenIdCounter = 1;

  bytes32 private constant VOUCHER_HASH = keccak256(abi.encodePacked("VOUCHER"));
  bytes32 private constant POP = keccak256(abi.encodePacked("POP"));
  bytes32 private constant LOYALTY_HASH = keccak256(abi.encodePacked("LOYALTY"));
  bytes32 private constant CERTIFICATE_HASH = keccak256(abi.encodePacked("CERTIFICATE"));
  bytes32 private constant MEMBERSHIP_HASH = keccak256(abi.encodePacked("MEMBERSHIP"));

  // Events
  //----------------- EIP-721 Metadata Update Extension -----------------//

  /// @dev This event emits when the metadata of a token is changed.
  /// So that the third-party platforms such as NFT market could
  /// timely update the images and related attributes of the NFT.
  event MetadataUpdate(uint256 _tokenId);

  /// @dev This event emits when the metadata of a range of tokens is changed.
  /// So that the third-party platforms such as NFT market could
  /// timely update the images and related attributes of the NFTs.
  event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);

  //----------------- ERC-5192 SoulBound Token -----------------//

  /// @notice Emitted when the locking status is changed to locked.
  /// @dev If a token is minted and the status is locked, this event should be emitted.
  /// @param tokenId The identifier for a token.
  event Locked(uint256 tokenId);

  /// @notice Emitted when the locking status is changed to unlocked.
  /// @dev If a token is minted and the status is unlocked, this event should be emitted.
  /// @param tokenId The identifier for a token.
  event Unlocked(uint256 tokenId);

  event TokenMinted(
    address indexed issuer,
    address indexed owner,
    uint256 tokenId,
    string tokenType,
    string name,
    string desc,
    string imageURL,
    bool isSoulBound,
    uint256 expiryDate,
    uint256 points,
    string metadataJson
  );
  event TokenRedeemed(address indexed issuer, uint256 tokenId);
  event LoyaltyPointsAdded(address indexed issuer, uint256 tokenId, uint256 points);
  event LoyaltyPointsRemoved(address indexed issuer, uint256 tokenId, uint256 points);
  event IssuerSet(address indexed account, bool isIssuer);
  event AdminSet(address indexed account, bool isAdmin);

  // Constructor
  constructor() ERC721("BonuzTokens", "BNZTN") {
    _admin[_msgSender()] = true;
    _issuer[_msgSender()] = true;
  }

  // Modifiers
  modifier onlyAdmin() {
    if (_admin[_msgSender()] == false) revert BonuzTokens__NotAnAdmin();
    _;
  }

  modifier onlyIssuer() {
    if (_issuer[_msgSender()] == false) revert BonuzTokens__NotAnIssuer();
    _;
  }

  modifier notZeroAddress(address _address) {
    if (_address == address(0)) revert BonuzTokens__ZeroAddressNotAllowed();
    _;
  }

  // Functions Order
  // External functions
  function mint(
    address _account,
    string memory _tokenType,
    string memory _name,
    string memory _desc,
    string memory _imageURL,
    bool _isSoulBound,
    uint256 _expiryDate,
    uint256 _points,
    string memory _metadataJson
  ) public notZeroAddress(_account) onlyIssuer nonReentrant {
    bytes32 tokenTypeHash = keccak256(abi.encodePacked(_tokenType));
    if ((tokenTypeHash == POP || tokenTypeHash == CERTIFICATE_HASH) && !_isSoulBound) {
      revert BonuzTokens__TokenMustBeSoulBound();
    }
    if (_isSoulBound) {
      emit Locked(_tokenIdCounter);
    }

    _token[_tokenIdCounter] = Metadata({
      issuer: _msgSender(),
      tokenType: _tokenType,
      name: _name,
      desc: _desc,
      imageURL: _imageURL,
      isSoulBound: _isSoulBound,
      redeemDate: 0,
      expiryDate: _expiryDate,
      points: _points,
      metadataJson: _metadataJson
    });

    _tokensByIssuer[_msgSender()].push(_tokenIdCounter);

    _safeMint(_account, _tokenIdCounter);

    emit TokenMinted(
      _msgSender(),
      _account,
      _tokenIdCounter,
      _tokenType,
      _name,
      _desc,
      _imageURL,
      _isSoulBound,
      _expiryDate,
      _points,
      _metadataJson
    );

    _tokenIdCounter++;
  }

  function redeemVoucher(uint256 tokenId) external onlyIssuer {
    Metadata memory metadata = _token[tokenId];
    if (keccak256(abi.encodePacked(metadata.tokenType)) != VOUCHER_HASH)
      revert BonuzTokens__InvalidTokenType();
    if (metadata.issuer != _msgSender()) revert BonuzTokens__NotTokenIssuer();
    if (metadata.expiryDate <= block.timestamp) revert BonuzTokens__ExpiredTokenCannotBeRedeemed();
    if (metadata.redeemDate != 0) revert BonuzTokens__VoucherAlreadyRedeemed();

    _token[tokenId].redeemDate = block.timestamp;
    emit MetadataUpdate(tokenId);
    emit TokenRedeemed(_msgSender(), tokenId);
  }

  function addLoyaltyPoints(uint256 tokenId, uint256 points) external onlyIssuer {
    Metadata memory metadata = _token[tokenId];
    if (keccak256(abi.encodePacked(metadata.tokenType)) != LOYALTY_HASH)
      revert BonuzTokens__InvalidTokenType();
    if (metadata.issuer != _msgSender()) revert BonuzTokens__NotTokenIssuer();
    if (metadata.expiryDate <= block.timestamp) revert BonuzTokens__ExpiredTokenCannotBeRedeemed();
    _token[tokenId].points += points;
    emit MetadataUpdate(tokenId);
    emit LoyaltyPointsAdded(_msgSender(), tokenId, points);
  }

  function removeLoyaltyPoints(uint256 tokenId, uint256 points) external onlyIssuer {
    Metadata memory metadata = _token[tokenId];
    if (keccak256(abi.encodePacked(metadata.tokenType)) != LOYALTY_HASH)
      revert BonuzTokens__InvalidTokenType();
    if (metadata.issuer != _msgSender()) revert BonuzTokens__NotTokenIssuer();
    if (metadata.expiryDate <= block.timestamp) revert BonuzTokens__ExpiredTokenCannotBeRedeemed();
    if (metadata.points >= points) {
      _token[tokenId].points -= points;
    } else {
      _token[tokenId].points = 0;
    }
    emit MetadataUpdate(tokenId);
    emit LoyaltyPointsRemoved(_msgSender(), tokenId, points);
  }

  function setAdmin(address _account, bool _state) external notZeroAddress(_account) onlyOwner {
    _admin[_account] = _state;
    emit AdminSet(_account, _state);
  }

  function setIssuer(address _account, bool _state) external notZeroAddress(_account) onlyAdmin {
    _issuer[_account] = _state;
    emit IssuerSet(_account, _state);
  }

  function setPause(bool _switch) external onlyOwner {
    if (_switch) {
      _pause();
    } else {
      _unpause();
    }
  }

  /// @dev ERC-5192
  /// @notice Returns the locking status of an Soulbound Token
  /// @dev SBTs assigned to zero address are considered invalid, and queries
  /// about them do throw.
  /// @param tokenId The identifier for an SBT.
  function locked(uint256 tokenId) external view returns (bool) {
    return _token[tokenId].isSoulBound;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override whenNotPaused {
    Metadata memory metadata = _token[tokenId];
    if (from != address(0)) {
      if (metadata.isSoulBound) {
        revert BonuzTokens__SoulBoundTokenCannotBeTransferred();
      }
      if (metadata.expiryDate != 0 && metadata.expiryDate <= block.timestamp) {
        revert BonuzTokens__ExpiredTokenCannotBeTransferred();
      }
      if (metadata.redeemDate != 0 && metadata.redeemDate <= block.timestamp) {
        revert BonuzTokens__RedeemedTokenCannotBeTransferred();
      }
    }
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  /// @dev IERC165-supportsInterface
  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == bytes4(0xb45a3c0e) ||
      interfaceId == bytes4(0x49064906) ||
      super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    Metadata storage metadata = _token[tokenId];

    string memory typeName = "";
    string memory specificName = "";
    string memory specificDesc = "";
    string[] memory attributes;

    bytes32 typeHash = keccak256(abi.encodePacked(metadata.tokenType));

    if (typeHash == VOUCHER_HASH) {
      typeName = "VOUCHER";
      specificName = metadata.name;
      specificDesc = metadata.desc;
      attributes = new string[](3);
      attributes[0] = string(abi.encodePacked('{"trait_type":"Type", "value":"', typeName, '"}'));
      attributes[1] = string(
        abi.encodePacked(
          '{"trait_type":"Redeemed At", "value":"',
          metadata.redeemDate.toString(),
          '","display_type":"',
          metadata.redeemDate == 0 ? "text" : "date",
          '"}'
        )
      );
      attributes[2] = string(
        abi.encodePacked(
          '{"trait_type":"Expiry Date", "value":"',
          metadata.expiryDate.toString(),
          '","display_type":"',
          metadata.expiryDate == 0 ? "text" : "date",
          '"}'
        )
      );
    } else if (typeHash == POP) {
      typeName = "POP";
      specificName = metadata.name;
      specificDesc = metadata.desc;
      attributes = new string[](2);
      attributes[0] = string(abi.encodePacked('{"trait_type":"Type", "value":"', typeName, '"}'));
      attributes[1] = string(
        abi.encodePacked(
          '{"trait_type":"Redeemed At", "value":"',
          metadata.redeemDate.toString(),
          '","display_type":"',
          metadata.redeemDate == 0 ? "text" : "date",
          '"}'
        )
      );
    } else if (typeHash == CERTIFICATE_HASH) {
      typeName = "CERTIFICATE";
      specificName = metadata.name;
      specificDesc = metadata.desc;
      attributes = new string[](2);
      attributes[0] = string(abi.encodePacked('{"trait_type":"Type", "value":"', typeName, '"}'));
      attributes[1] = string(
        abi.encodePacked(
          '{"trait_type":"Course Completed At", "value":"',
          metadata.redeemDate.toString(),
          '","display_type":"',
          metadata.redeemDate == 0 ? "text" : "date",
          '"}'
        )
      );
    } else if (typeHash == LOYALTY_HASH) {
      typeName = "LOYALTY";
      specificName = metadata.name;
      specificDesc = metadata.desc;
      attributes = new string[](4);
      attributes[0] = string(abi.encodePacked('{"trait_type":"Type", "value":"', typeName, '"}'));
      attributes[1] = string(
        abi.encodePacked(
          '{"trait_type":"Last Redeemed At", "value":"',
          metadata.redeemDate.toString(),
          '","display_type":"',
          metadata.redeemDate == 0 ? "text" : "date",
          '"}'
        )
      );
      attributes[2] = string(
        abi.encodePacked(
          '{"trait_type":"Expiry Date", "value":"',
          metadata.expiryDate.toString(),
          '","display_type":"',
          metadata.expiryDate == 0 ? "text" : "date",
          '"}'
        )
      );
      attributes[3] = string(
        abi.encodePacked(
          '{"trait_type":"Points Available", "value":"',
          metadata.points.toString(),
          '"}'
        )
      );
    } else if (typeHash == MEMBERSHIP_HASH) {
      typeName = "MEMBERSHIP";
      specificName = metadata.name;
      specificDesc = metadata.desc;
      attributes = new string[](3);
      attributes[0] = string(abi.encodePacked('{"trait_type":"Type", "value":"', typeName, '"}'));
      attributes[1] = string(
        abi.encodePacked(
          '{"trait_type":"is transferable", "value":"',
          metadata.isSoulBound ? "No" : "Yes",
          '"}'
        )
      );
      attributes[2] = string(
        abi.encodePacked(
          '{"trait_type":"Redeemed At", "value":"',
          metadata.redeemDate.toString(),
          '","display_type":"',
          metadata.redeemDate == 0 ? "text" : "date",
          '"}'
        )
      );
    }

    string memory attributesJson = joinStrings(", ", attributes);
    string memory nftName = string(
      abi.encodePacked(typeName, " #", Strings.toString(tokenId), " (", specificName, ")")
    );
    string memory description = string(abi.encodePacked(metadata.desc, " (", specificDesc, ")"));

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            nftName,
            '", "description": "',
            description,
            '", "image": "',
            metadata.imageURL,
            '", "attributes": [',
            attributesJson,
            "]}"
          )
        )
      )
    );

    string memory _dataUri = "data:application/json;base64,";

    return string(abi.encodePacked(_dataUri, json));
  }

  function joinStrings(
    string memory separator,
    string[] memory data
  ) internal pure returns (string memory) {
    string memory _tmpValue = data[0];
    for (uint i = 1; i < data.length; i++) {
      _tmpValue = string(abi.encodePacked(_tmpValue, separator, data[i]));
    }
    return _tmpValue;
  }

  function getTokenMetadata(uint256 _tokenId) external view returns (Metadata memory) {
    return _token[_tokenId];
  }

  function getTokensByIssuer(address _issuerAdd) external view returns (uint256[] memory) {
    return _tokensByIssuer[_issuerAdd];
  }

  function getTokenCounter() external view returns (uint256) {
    return _tokenIdCounter;
  }

  function isAdmin(address _account) external view returns (bool) {
    return _admin[_account];
  }

  function isIssuer(address _account) external view returns (bool) {
    return _issuer[_account];
  }
}
