type SocialLink = {
  platform: string;
  link: string | null;
  lastUpdated: string;
};

type UserProfile = {
  wallet: string;
  handle: string;
  name: string;
  profileImage: string;
  socialLinks: SocialLink[];
};

export type SocialIdSubGraphResponse = {
  userProfiles: UserProfile[];
};
