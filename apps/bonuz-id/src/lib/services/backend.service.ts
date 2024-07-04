import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { NFT } from '../../services/blockchain';
import { useSessionStore } from '../../store/sessionStore';
import { useUserStore } from '../../store/userStore';
import {
  SocialLink,
  TokenType,
  User,
  UserProfileData,
  UserProfileUpdateData,
} from '../../types';

export const BACKEND_ENDPOINT =
  process.env.NEXT_PUBLIC_BASE_URL ?? '<BASE_URL> must be set as env var';

export const instance = axios.create();

export const setupUserInterceptor = (navigate: any) => {
  const { token } = useSessionStore.getState();
  if (!token) return

  const decoded = jwtDecode(token ?? '') as { exp: number };
  const currentTime = Math.floor(Date.now() / 1000);

  if (decoded.exp < currentTime) {
    localStorage.clear();
    window.location.reload();
  }

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useSessionStore.getState().resetToken();
        useUserStore.getState().resetUser();
        navigate('/auth/signin');
        localStorage.clear();
        window.location.reload();

      }
    },
  );
};
// ---------------------------------------------

export const getUserInfo = async (accessToken: string) => {
  const res = await axios.get(`${BACKEND_ENDPOINT}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status !== 200 || res.data === null) {
    throw new Error(`Failed to get user info: ${res.status}`);
  }

  return res.data;
};
// ---------------------------------------------

export const updateUserLink = async (data: {
  platform: string;
  link: string;
}) => {
  const res = await instance.patch<User>(
    `${BACKEND_ENDPOINT}/api/users/me/link?chainId=42170`,
    {
      data,
    },
  );

  return res.data;
};

export const getUser = async (handle: string) => {
  const url = `${BACKEND_ENDPOINT}/api/users/${handle}`;

  const res = await instance.get(url);

  return res?.data;
};

export const updateUser = async (data: Partial<UserProfileUpdateData>, chainId: string | number) => {
  const res = await instance.patch(
    `${BACKEND_ENDPOINT}/api/users/me?chainId=${chainId}`,
    data,
  );

  return res.data;
};

export const uploadFile = async (data: any) => {
  const res = await instance.post(`${BACKEND_ENDPOINT}/api/media`, data);

  return res.data;
};

// ---------------------------------------------------------

export const getUserPartnersNew = async () =>
  instance.get(`${BACKEND_ENDPOINT}/api/partners/all`);

// ---------------------------------------------------------
export const postMintedNft = async (data: {
  minterWalletAddress: string;
  user: string;
  userWalletAddress: string;
  txHash: string;
  partner: Number;
  tokenId: Number;
  tokenType: TokenType;
}) => instance.post(`${BACKEND_ENDPOINT}/api/nfts`, data);

// ---------------------------------------------------------

export const createUser = async (
  data: {
    handle: string;
    name?: string;
    profileImage?: string;
  },
  token: string,
) => {
  const res = await axios.post<{
    token: string;
    user: User;
    // todo: pass chainid as parameter
  }>(`${BACKEND_ENDPOINT}/api/users?chainId=${1116}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUserNFTs = async (address: string, chainId: number | string) => {
  const res = await instance.get<{
    data: {
      nfts: NFT[];
    };
  }>(`${BACKEND_ENDPOINT}/api/users/wallet/${address}/nfts?chainId=${chainId}`);

  return res.data;
};

export const getAuthMessage = (walletAddress: string) =>
  instance.post<{
    message: string;
  }>(`${BACKEND_ENDPOINT}/api/users/auth/sign`, {
    walletAddress,
  });

export const authenticate = (
  walletAddress: string,
  signature: string,
  smartAccountAddress: string,
) =>
  instance.post<{
    token: string;
    role?: 'guest';
  }>(`${BACKEND_ENDPOINT}/api/users/auth`, {
    walletAddress,
    signature,
    smartAccountAddress,
  });

export const addConnection = async (targetUserId: number) =>
  instance.post(`${BACKEND_ENDPOINT}/api/users/me/connections`, {
    targetUserId,
  });

export const removeConnection = async (targetUserId: number) =>
  instance.delete(
    `${BACKEND_ENDPOINT}/api/users/me/connections/${targetUserId}`,
  );

export const updatePartnerStatus = async (
  id: string,
  partnerStatus: string,
  smartContractKey?: number,
) =>
  instance.post(`${BACKEND_ENDPOINT}/api/discover`, {
    id,
    partnerStatus,
    smartContractKey,
  });

export const addPartner = async (data: any) =>
  instance.post(`${BACKEND_ENDPOINT}/api/partners`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getCheckedInUsersByEventId = async (eventId: string, page = 1) => {
  const res = await instance.get<{
    eventUsers: {
      walletAddress: string;
      checkInAt: Date;
      user: {
        handle: string;
      };
    }[];
    pageCount: number;
  }>(`${BACKEND_ENDPOINT}/api/events/${eventId}/users?page=${page}`);

  return res.data;
};

export const uploadEventMintImage = async (
  eventId: string,
  base64Image: string,
) => {
  const res = await instance.post<{
    image: string;
  }>(`${BACKEND_ENDPOINT}/api/events/${eventId}/upload`, {
    base64Image,
  });

  return res.data;
};

export const manualCheckInEvent = async (
  eventId: string,
  data: {
    walletAddress?: string;
    handle?: string;
  },
) => {
  const res = await instance.post(
    `${BACKEND_ENDPOINT}/api/events/${eventId}/check-in`,
    data,
  );

  return res.data;
};

export const manualCheckInMembership = async (
  partnerId: string,
  data: {
    handle?: string;
  },
) => {
  const res = await instance.post(
    `${BACKEND_ENDPOINT}/api/partners/${partnerId}/memberships`,
    data,
  );

  return res.data;
};

export const manualCheckInVoucher = async (
  partnerId: string,
  data: {
    handle?: string;
  },
) => {
  const res = await instance.post(
    `${BACKEND_ENDPOINT}/api/partners/${partnerId}/vouchers`,
    data,
  );

  return res.data;
};

export const registerMembership = async (
  data: {
    handle?: string;
  },
) => {
  const res = await instance.post(
    `${BACKEND_ENDPOINT}/api/register/memberships`,
    data,
  );

  return res.data;
};

// export const registerVoucher = async (
//   data: {
//     handle?: string;
//   },
// ) => {
//   const res = await instance.post(
//     `${BACKEND_ENDPOINT}/api/register/vouchers`,
//     data,
//   );

//   return res.data;
// };

export const enrollCourse = async (
  courseId: string,
  data: {
    walletAddress?: string;
    handle?: string;
  },
) => {
  const res = await instance.post(
    `${BACKEND_ENDPOINT}/api/courses/${courseId}/enrollments`,
    data,
  );

  return res.data;
};

export const getCourseEnrollments = async (courseId: string, page = 1) => {
  const res = await instance.get<{
    enrollments: {
      walletAddress: string;
      completedAt: Date;
      user: {
        handle: string;
      };
    }[];
    pageCount: number;
  }>(`${BACKEND_ENDPOINT}/api/courses/${courseId}/enrollments?page=${page}`);

  return res.data;
};

export const createVoucher = async (
  voucherId: string,
  data: {
    walletAddress?: string;
    handle?: string;
  },
) => {
  const res = await instance.post(
    `${BACKEND_ENDPOINT}/api/vouchers/${voucherId}`,
    data,
  );

  return res.data;
};

export const getCreatedVouchers = async (voucherId: string, page = 1) => {
  const res = await instance.get<{
    vouchers: {
      walletAddress: string;
      user: {
        handle: string;
      };
      createdAt: string;
    }[];
    pageCount: number;
  }>(`${BACKEND_ENDPOINT}/api/vouchers/${voucherId}?page=${page}`);

  return res.data;
};

export const uploadCourseMintImage = async (
  courseId: string,
  base64Image: string,
) => {
  const res = await instance.post<{
    image: string;
  }>(`${BACKEND_ENDPOINT}/api/courses/${courseId}/upload`, {
    base64Image,
  });

  return res.data;
};

// -----------------------------------------------------
export const verifySocialLink = async (
  userAccessToken: string,
  data: {
    type: string;
    accessToken?: string;
    code?: {
      code: string;
      codeVerifier: string;
      redirectUri: string;
    };
  }
) => {
  const res = await axios.post<{
    token: string;
    user: User;
  }>(
    `${BACKEND_ENDPOINT}/api/users/verify`,
    data,
    {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    }
  );

  if (res.status !== 200) {
    throw new Error(`Failed to create user: ${res.status}`);
  }

  return res.data;
};
