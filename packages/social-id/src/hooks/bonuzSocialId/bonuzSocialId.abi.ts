export const BonuzSocialIdAbi = [
	'function getAllowedSocialLinks(string[] _platforms) view returns (bool[])',
	'function getUserProfileAndSocialLinks(address _user, string[] _platforms) view returns (string, string, string, string[])',
	'function isAdmin(address _account) view returns (bool)',
	'function isIssuer(address _account) view returns (bool)',
	'function owner() view returns (address)',
	'function paused() view returns (bool)',
	'function renounceOwnership()',
	'function setAdmin(address _user, bool _state)',
	'function setAllowedSocialLink(string _platform, bool _allowed)',
	'function setIssuer(address _user, bool _switch)',
	'function setIssuer(address _user, bool _switch)',
	'function setPause(bool _switch)',
	'function setSocialLink(string _platform, string _link, address _user)',
	'function setSocialLinks(string[] _platforms, string[] _links, address _user)',
	'function setUserHandle(address _user, string _handle)',
	'function setUserImage(address _user, string _profileImage)',
	'function setUserName(address _user, string _name)',
	'function setUserProfile(address _user, string _name, string _handle, string _profileImage)',
	'function transferOwnership(address newOwner)'
] as const