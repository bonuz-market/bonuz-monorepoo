export interface Link {
  type: string;
  baseUrl: string;
  handle: string;
  verified: boolean;
  isPublic: boolean;
}

export const platformsBaseUrlMap = {
  twitter: 'https://twitter.com/',
  facebook: 'https://facebook.com/',
  whatsapp: 'https://wa.me/',
  telegram: 'https://t.me/',
  linkedin: 'https://linkedin.com/in/',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/@',
  snapchat: 'https://snapchat.com/add/',
};
