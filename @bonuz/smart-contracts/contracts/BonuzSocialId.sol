// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// 1. Pragma statements
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract BonuzSocialId is Ownable, Pausable {
  // 2. Type declarations
  struct UserProfile {
    string name;
    string profileImage;
    string handle;
    mapping(string => string) socialLinks;
  }

  // 3. State variables
  mapping(address => UserProfile) private userProfiles;
  mapping(address => bool) private issuers;
  mapping(address => bool) private admins;
  mapping(string => bool) private allowedSocialLinks;

  // 4. Events
  event IssuerSet(address indexed account, bool isIssuer);
  event AdminSet(address indexed account, bool isAdmin);
  event UserNameSet(address indexed user, string name);
  event UserImageSet(address indexed user, string profileImage);
  event UserHandleSet(address indexed user, string handle);
  event SocialLinkSet(address indexed user, string platform, string link);
  event AllowedSocialLinkSet(string indexed platform, bool allowed);
  event SocialLinksSet(address indexed user, string[] platforms, string[] links);

  // 5. Constructor
  constructor(address[] memory _initialIssuers, string[] memory _initialAllowedPlatforms) {
    admins[_msgSender()] = true;
    issuers[_msgSender()] = true;

    for (uint256 i = 0; i < _initialIssuers.length; i++) {
      if (_initialIssuers[i] != address(0)) issuers[_initialIssuers[i]] = true;
    }

    for (uint256 i = 0; i < _initialAllowedPlatforms.length; i++) {
      allowedSocialLinks[_initialAllowedPlatforms[i]] = true;
    }
  }

  // 6. Modifiers
  modifier onlyAdmin() {
    require(admins[_msgSender()] == true, "Only the admin can call this function");
    _;
  }

  modifier onlyIssuer() {
    require(issuers[_msgSender()] == true, "Only the issuer can call this function");
    _;
  }

  modifier onlyAllowedSocialLink(string memory _platform) {
    require(allowedSocialLinks[_platform], "This social link platform is not allowed");
    _;
  }

  modifier notZeroAddress(address _address) {
    require(_address != address(0), "Zero address is not allowed");
    _;
  }

  // 7. Functions

  // 7.1 External functions
  function setPause(bool _switch) external onlyOwner {
    if (_switch) {
      _pause();
    } else {
      _unpause();
    }
  }

  function setAdmin(address _user, bool _state) external notZeroAddress(_user) onlyOwner {
    admins[_user] = _state;
    emit AdminSet(_user, _state);
  }

  function setIssuer(address _user, bool _switch) external notZeroAddress(_user) onlyAdmin {
    issuers[_user] = _switch;
    emit IssuerSet(_user, _switch);
  }

  function setAllowedSocialLink(string memory _platform, bool _allowed) external onlyAdmin {
    allowedSocialLinks[_platform] = _allowed;
    emit AllowedSocialLinkSet(_platform, _allowed);
  }

  function setUserName(
    address _user,
    string memory _name
  ) external notZeroAddress(_user) onlyIssuer whenNotPaused {
    UserProfile storage userProfile = userProfiles[_user];
    userProfile.name = _name;
    emit UserNameSet(_user, _name);
  }

  function setUserImage(
    address _user,
    string memory _profileImage
  ) external notZeroAddress(_user) onlyIssuer whenNotPaused {
    UserProfile storage userProfile = userProfiles[_user];
    userProfile.profileImage = _profileImage;
    emit UserImageSet(_user, _profileImage);
  }

  function setUserHandle(
    address _user,
    string memory _handle
  ) external notZeroAddress(_user) onlyIssuer whenNotPaused {
    UserProfile storage userProfile = userProfiles[_user];
    userProfile.handle = _handle;
    emit UserHandleSet(_user, _handle);
  }

  function setUserProfile(
    address _user,
    string memory _name,
    string memory _handle,
    string memory _profileImage
  ) external notZeroAddress(_user) onlyIssuer whenNotPaused {
    UserProfile storage userProfile = userProfiles[_user];
    userProfile.name = _name;
    userProfile.handle = _handle;
    userProfile.profileImage = _profileImage;
    
    emit UserNameSet(_user, _name);
    emit UserImageSet(_user, _profileImage);
    emit UserHandleSet(_user, _handle);
  }

  function setSocialLink(
    string memory _platform,
    string memory _link,
    address _user
  ) external notZeroAddress(_user) onlyIssuer whenNotPaused onlyAllowedSocialLink(_platform) {
    userProfiles[_user].socialLinks[_platform] = _link;
    emit SocialLinkSet(_user, _platform, _link);
  }

  function setSocialLinks(
    string[] memory _platforms,
    string[] memory _links,
    address _user
  ) external notZeroAddress(_user) onlyIssuer whenNotPaused {
    require(_platforms.length == _links.length, "The number of platforms and links must be equal");

    for (uint256 i = 0; i < _platforms.length; i++) {
      if (allowedSocialLinks[_platforms[i]]) {
        userProfiles[_user].socialLinks[_platforms[i]] = _links[i];
      }
    }

    emit SocialLinksSet(_user, _platforms, _links);
  }

  // 7.3 View and pure functions
  function getUserProfileAndSocialLinks(
    address _user,
    string[] memory _platforms
  ) external view returns (string memory, string memory, string memory, string[] memory) {
    UserProfile storage userProfile = userProfiles[_user];
    string[] memory links = new string[](_platforms.length);

    for (uint256 i = 0; i < _platforms.length; i++) {
      if (allowedSocialLinks[_platforms[i]]) {
        links[i] = userProfile.socialLinks[_platforms[i]];
      }
    }

    return (userProfile.name, userProfile.profileImage, userProfile.handle, links);
  }

  function getAllowedSocialLinks(string[] memory _platforms) external view returns (bool[] memory) {
    bool[] memory allowed = new bool[](_platforms.length);

    for (uint256 i = 0; i < _platforms.length; i++) {
      allowed[i] = allowedSocialLinks[_platforms[i]];
    }

    return allowed;
  }

  function isAdmin(address _account) external view returns (bool) {
    return admins[_account];
  }

  function isIssuer(address _account) external view returns (bool) {
    return issuers[_account];
  }
}
