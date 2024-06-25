/* eslint-disable unicorn/consistent-function-scoping */
import { useLazyQuery as useLazyApolloQuery } from '@apollo/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CryptoES from 'crypto-es';
import { ImagePickerAsset } from 'expo-image-picker';
import { HTTPError } from 'ky';
import { Address } from 'viem';

import {
  DecentralizedIdentifiersType,
  Link,
  MessagingAppType,
  SocialAccount,
  SocialIdUser,
  SUPPORTED_PLATFORMS,
  User,
  WalletType,
} from '@/entities';
import { Wallet } from '@/entities/wallet';
import {
  getUserByHandle,
  getUserConnections,
  getUserInfo,
  updateUserInfo,
} from '@/services/backend';
import { useUserStore } from '@/store';
import { viemPublicClients } from '@/store/smartAccounts';

import { uploadImageToIPFS } from '../nftStorage';
import { socialIdAbi } from './abi';
import { SOCIAL_ID_ADDRESS, SOCIAL_ID_CHAIN_ID } from './bonuz.config';
import { GET_USER_PROFILES_BY_HANDLES } from './subgraphs/socialId/socialId.queries';
import { socialIdSubgraphApolloClient } from './subgraphs/socialId/socialId.subgraph';
import { SocialIdSubGraphResponse } from './subgraphs/socialId/socialId.types';

const getPublicData = (link: string) => ({
  link: link?.startsWith('p_') ? link.slice(2) : '',
  isPublic: !!link?.startsWith('p_'),
});

/** 
   // ! IF YOU GET ERROR WHILE CALLING THE FUNCTION 
   ContractFunctionExecutionError: The contract function "isAdmin" returned no data ("0x").
  
  This could be due to any of the following:
    - The contract does not have the function "isAdmin",
    - The parameters passed to the contract function may be invalid, or
    - The address is not a contract.
   
  // * then make sure your have chain configureChains in root layout.tsx
   */
// ----------------------------------------------------

export const useQueryGetUserProfileAndSocialLinks = () => {
  const { address, privateKey } = useUserStore((state) => ({
    address: (state.wallet as Wallet).address,
    privateKey: (state.wallet as Wallet).privateKey,
  }));

  const queryKey = ['getUserProfileAndSocialLinks'];
  const queryFn = async () => {
    const contractData = await viemPublicClients[SOCIAL_ID_CHAIN_ID]?.readContract({
      abi: socialIdAbi,
      address: SOCIAL_ID_ADDRESS,
      functionName: 'getUserProfileAndSocialLinks',
      args: [address, SUPPORTED_PLATFORMS],
    });
    const user = await getUserInfo();

    return {
      contractData,
      privateKey,
      user,
    };
  };

  return useQuery({
    queryKey,
    queryFn,
    select: ({ contractData, privateKey, user: userData }) => {
      const [name, profileImage, _handle, links] = contractData;

      const decryptLink = (link: string) => {
        if (link.startsWith('e_')) {
          return {
            link: CryptoES.AES.decrypt(link.slice(2), privateKey).toString(CryptoES.enc.Utf8),
            isPublic: false,
          };
        } else if (link.startsWith('p_')) {
          return {
            link: link.slice(2),
            isPublic: true,
          };
        }

        return {
          link,
          isPublic: true,
        };
      };

      const [
        s_x,
        s_instagram,
        s_facebook,
        s_linkedin,
        s_tiktok,
        s_snapchat,
        s_discord,
        s_pinterest,
        s_twitch,
        s_reddit,
        s_mastadon,
        s_youmeme,
        s_rumble,
        s_youtube,
        s_vk,
        s_qq,
        w_near,
        w_sui,
        w_aptos,
        w_cosmos,
        w_cardano,
        w_solana,
        w_icp,
        w_btc,
        w_doge,
        w_polkadot,
        w_lukso,
        w_algorand,
        w_tron,
        w_ton,
        w_wallet1,
        w_wallet2,
        w_wallet3,
        w_wallet4,
        w_wallet5,
        m_telegram,
        m_whatsapp,
        m_signal,
        m_weChat,
        d_ens,
        d_worldId,
        d_lens,
        d_bnb,
        d_anima,
        d_demos,
      ] = links.map((element) => decryptLink(element));

      const socialsLinksMap: Record<string, { type: string; isVerified: boolean }> = {};

      for (const link of userData.socialsLinks) {
        socialsLinksMap[link.type] = link;
      }

      const userSocials = {
        facebook: {
          handle: s_facebook.link,
          isPublic: s_facebook.isPublic,
          type: 'facebook',
          isVerified: socialsLinksMap.facebook?.isVerified,
        },
        instagram: {
          handle: s_instagram.link,
          isPublic: s_instagram.isPublic,
          type: 'instagram',
          isVerified: socialsLinksMap.instagram?.isVerified,
        },
        x: {
          handle: s_x.link,
          isPublic: s_x.isPublic,
          type: 'x',
          isVerified: socialsLinksMap.x?.isVerified,
        },
        tiktok: {
          handle: s_tiktok.link,
          isPublic: s_tiktok.isPublic,
          type: 'tiktok',
          isVerified: socialsLinksMap.tiktok?.isVerified,
        },
        snapchat: {
          handle: s_snapchat.link,
          isPublic: s_snapchat.isPublic,
          type: 'snapchat',
          isVerified: socialsLinksMap.snapchat?.isVerified,
        },
        linkedin: {
          handle: s_linkedin.link,
          isPublic: s_linkedin.isPublic,
          type: 'linkedin',
          isVerified: socialsLinksMap.linkedin?.isVerified,
        },
        discord: {
          handle: s_discord.link,
          isPublic: s_discord.isPublic,
          type: 'discord',
          isVerified: socialsLinksMap.discord?.isVerified,
        },
        pinterest: {
          handle: s_pinterest.link,
          isPublic: s_pinterest.isPublic,
          type: 'pinterest',
          isVerified: socialsLinksMap.pinterest?.isVerified,
        },
        twitch: {
          handle: s_twitch.link,
          isPublic: s_twitch.isPublic,
          type: 'twitch',
          isVerified: socialsLinksMap.twitch?.isVerified,
        },
        reddit: {
          handle: s_reddit.link,
          isPublic: s_reddit.isPublic,
          type: 'reddit',
          isVerified: socialsLinksMap.reddit?.isVerified,
        },
        mastadon: {
          handle: s_mastadon.link,
          isPublic: s_mastadon.isPublic,
          type: 'mastadon',
          isVerified: socialsLinksMap.mastadon?.isVerified,
        },
        youmeme: {
          handle: s_youmeme.link,
          isPublic: s_youmeme.isPublic,
          type: 'youmeme',
          isVerified: socialsLinksMap.youmeme?.isVerified,
        },
        rumble: {
          handle: s_rumble.link,
          isPublic: s_rumble.isPublic,
          type: 'rumble',
          isVerified: socialsLinksMap.rumble?.isVerified,
        },
        youtube: {
          handle: s_youtube.link,
          isPublic: s_youtube.isPublic,
          type: 'youtube',
          isVerified: socialsLinksMap.youtube?.isVerified,
        },
        vk: {
          handle: s_vk.link,
          isPublic: s_vk.isPublic,
          type: 'vk',
          isVerified: socialsLinksMap.vk?.isVerified,
        },
        qq: {
          handle: s_qq.link,
          isPublic: s_qq.isPublic,
          type: 'qq',
          isVerified: socialsLinksMap.qq?.isVerified,
        },
      } satisfies Record<SocialAccount, Link>;
      const userMessagingApps = {
        whatsapp: {
          handle: m_whatsapp.link,
          isPublic: m_whatsapp.isPublic,
          type: 'whatsapp',
          isVerified: socialsLinksMap.whatsapp?.isVerified,
        },
        telegram: {
          handle: m_telegram.link,
          isPublic: m_telegram.isPublic,
          type: 'telegram',
          isVerified: socialsLinksMap.telegram?.isVerified,
        },
        signal: {
          handle: m_signal.link,
          isPublic: m_signal.isPublic,
          type: 'signal',
          isVerified: socialsLinksMap.signal?.isVerified,
        },
        weChat: {
          handle: m_weChat.link,
          isPublic: m_weChat.isPublic,
          type: 'weChat',
          isVerified: socialsLinksMap.weChat?.isVerified,
        },
      } satisfies Record<MessagingAppType, Link>;
      const userWallets = {
        solana: {
          handle: w_solana.link,
          isPublic: w_solana.isPublic,
          type: 'solana',
          isVerified: socialsLinksMap.solana?.isVerified,
        },
        btc: {
          handle: w_btc.link,
          isPublic: w_btc.isPublic,
          type: 'btc',
          isVerified: socialsLinksMap.btc?.isVerified,
        },
        near: {
          handle: w_near.link,
          isPublic: w_near.isPublic,
          type: 'near',
          isVerified: socialsLinksMap.near?.isVerified,
        },
        cardano: {
          handle: w_cardano.link,
          isPublic: w_cardano.isPublic,
          type: 'cardano',
          isVerified: socialsLinksMap.cardano?.isVerified,
        },
        // venom: {
        //   handle: w_venom.link,
        //   isPublic: w_venom.isPublic,
        //   type: 'venom',
        // },

        aptos: {
          handle: w_aptos.link,
          isPublic: w_aptos.isPublic,
          type: 'aptos',
          isVerified: socialsLinksMap.aptos?.isVerified,
        },
        cosmos: {
          handle: w_cosmos.link,
          isPublic: w_cosmos.isPublic,
          type: 'cosmos',
          isVerified: socialsLinksMap.cosmos?.isVerified,
        },
        sui: {
          handle: w_sui.link,
          isPublic: w_sui.isPublic,
          type: 'sui',
          isVerified: socialsLinksMap.sui?.isVerified,
        },
        icp: {
          handle: w_icp.link,
          isPublic: w_icp.isPublic,
          type: 'icp',
          isVerified: socialsLinksMap.icp?.isVerified,
        },
        doge: {
          handle: w_doge.link,
          isPublic: w_doge.isPublic,
          type: 'doge',
          isVerified: socialsLinksMap.doge?.isVerified,
        },
        lukso: {
          handle: w_lukso.link,
          isPublic: w_lukso.isPublic,
          type: 'lukso',
          isVerified: socialsLinksMap.lukso?.isVerified,
        },
        polkadot: {
          handle: w_polkadot.link,
          isPublic: w_polkadot.isPublic,
          type: 'polkadot',
          isVerified: socialsLinksMap.polkadot?.isVerified,
        },
        algorand: {
          handle: w_algorand.link,
          isPublic: w_algorand.isPublic,
          type: 'algorand',
          isVerified: socialsLinksMap.algorand?.isVerified,
        },
        tron: {
          handle: w_tron.link,
          isPublic: w_tron.isPublic,
          type: 'tron',
          isVerified: socialsLinksMap.tron?.isVerified,
        },
        ton: {
          handle: w_ton.link,
          isPublic: w_ton.isPublic,
          type: 'ton',
          isVerified: socialsLinksMap.ton?.isVerified,
        },
        wallet1: {
          handle: w_wallet1.link,
          isPublic: w_wallet1.isPublic,
          type: 'wallet1',
          isVerified: true,
        },
        wallet2: {
          handle: w_wallet2.link,
          isPublic: w_wallet2.isPublic,
          type: 'wallet2',
          isVerified: true,
        },
        wallet3: {
          handle: w_wallet3.link,
          isPublic: w_wallet3.isPublic,
          type: 'wallet3',
          isVerified: true,
        },
        wallet4: {
          handle: w_wallet4.link,
          isPublic: w_wallet4.isPublic,
          type: 'wallet4',
          isVerified: true,
        },
        wallet5: {
          handle: w_wallet5.link,
          isPublic: w_wallet5.isPublic,
          type: 'wallet5',
          isVerified: true,
        },
      } satisfies Partial<Record<WalletType, Link>>;

      const decentralizedIdentifiers = {
        anima: {
          handle: d_anima.link,
          isPublic: d_anima.isPublic,
          type: 'anima',
          isVerified: socialsLinksMap.anima?.isVerified,
        },
        worldId: {
          handle: d_worldId.link,
          isPublic: d_worldId.isPublic,
          type: 'worldId',
          isVerified: socialsLinksMap.worldId?.isVerified,
        },
        lens: {
          handle: d_lens.link,
          isPublic: d_lens.isPublic,
          type: 'lens',
          isVerified: socialsLinksMap.lens?.isVerified,
        },
        ens: {
          handle: d_ens.link,
          isPublic: d_ens.isPublic,
          type: 'ens',
          isVerified: socialsLinksMap.ens?.isVerified,
        },
        bnbNameService: {
          handle: d_bnb.link,
          isPublic: d_bnb.isPublic,
          type: 'bnbNameService',
          isVerified: socialsLinksMap.bnbNameService?.isVerified,
        },

        demos: {
          handle: d_demos.link,
          isPublic: d_anima.isPublic,
          type: 'demos',
          isVerified: socialsLinksMap.demos?.isVerified,
        },
      } satisfies Record<DecentralizedIdentifiersType, Link>;
      return {
        name,
        handle: _handle,
        profilePicture: profileImage,
        socials: userSocials,
        messagingApps: userMessagingApps,
        wallets: userWallets,
        decentralizedIdentifiers,
      } satisfies Partial<User>;
    },
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useQueryGetUserProfileAndSocialLinksByHandle = ({ handle }: { handle?: string }) => {
  const [getUsers] = useLazyApolloQuery<SocialIdSubGraphResponse>(GET_USER_PROFILES_BY_HANDLES, {
    client: socialIdSubgraphApolloClient,
  });
  // console.log('userConnections');

  return useQuery<SocialIdUser & { address: string; isCurrentConnection: boolean }>({
    queryKey: ['user', handle],
    queryFn: async () => {
      const user = await getUserByHandle(handle!);

      const { data: userData } = await getUsers({
        variables: {
          handles: [user.handle],
        },
      });

      const socials = {} as Record<string, Link>;
      const messagingApps = {} as Record<string, Link>;
      const wallets = {} as Record<string, Link>;
      const decentralizedIdentifiers = {} as Record<string, Link>;

      const userSocialId = userData?.userProfiles[0]!;
      // eslint-disable-next-line unicorn/no-array-reduce
      for (const link of userSocialId.socialLinks) {
        if (!link.link?.startsWith('p_')) {
          continue;
        }
        const type = link.platform.slice(2);
        const handle = link.link.slice(2);

        if (link.platform.startsWith('s_')) {
          socials[type] = {
            handle: handle,
            isPublic: true,
            type,
          };
        }

        if (link.platform.startsWith('m_')) {
          messagingApps[type] = {
            handle: handle,
            isPublic: true,
            type,
          };
        }

        if (link.platform.startsWith('w_')) {
          wallets[type] = {
            handle: handle,
            isPublic: true,
            type,
          };
        }

        if (link.platform.startsWith('d_')) {
          decentralizedIdentifiers[type] = {
            handle: handle,
            isPublic: true,
            type,
          };
        }
      }

      return {
        id: user.id,
        isCurrentConnection: user.isCurrentConnection,
        name: userSocialId.name,
        profilePicture: userSocialId.profileImage,
        handle: userSocialId.handle,
        address: userSocialId.wallet,
        socials,
        messagingApps,
        wallets,
        decentralizedIdentifiers,
      };
    },
    staleTime: 0,
    enabled: !!handle,
  });
};
// export const useQueryGetUserProfileAndSocialLinksByHandle = (handle: string | null) => {
//   const queryKey = ['getPublicUserProfileAndSocialLinks', handle];

//   const token = useAuthStore((state) => state.token);
//   const queryFn = async () => {
//     const bonuzSocialIdContractRead = new ethers.Contract(
//       SOCIAL_ID_ADDRESS,
//       BonuzSocialIdAbi,
//       bonuzSmartAccountSigner,
//     );

//     const user = await getUserByHandle(handle!, token!);
//     const address = user.smartAccountAddress;

//     const contractData = await bonuzSocialIdContractRead?.getUserProfileAndSocialLinks(
//       address,
//       SUPPORTED_PLATFORMS,
//     );

//     return {
//       user,
//       contractData,
//     };
//   };

//   return useQuery(queryKey, queryFn, {
//     select: ({ contractData, user }) => {
//       if (!contractData || !user) return null;

//       const [name, profileImage, links] = contractData;

//       const [
//         s_x,
//         s_instagram,
//         s_facebook,
//         s_linkedin,
//         s_tiktok,
//         s_snapchat,
//         s_discord,
//         s_pinterest,
//         s_twitch,
//         s_reddit,
//         s_mastadon,
//         s_youmeme,
//         s_rumble,
//         s_youtube,
//         s_vk,
//         s_qq,
//         w_near,
//         w_sui,
//         w_aptos,
//         w_cosmos,
//         w_cardano,
//         w_solana,
//         w_icp,
//         w_btc,
//         w_doge,
//         w_polkadot,
//         w_lukso,
//         w_algorand,
//         w_tron,
//         w_ton,
//         w_wallet1,
//         w_wallet2,
//         w_wallet3,
//         w_wallet4,
//         w_wallet5,
//         m_telegram,
//         m_whatsapp,
//         m_signal,
//         m_weChat,
//         d_ens,
//         d_worldId,
//         d_lens,
//         d_bnb,
//         d_anima,
//         d_demos,
//       ] = links.map(getPublicData);

//       const socialsLinksMap = user.socialsLinks.reduce(
//         (acc, link) => {
//           acc[link.type] = link;
//           return acc;
//         },
//         {} as Record<string, { type: string; isVerified: boolean }>,
//       );

//       const userSocials = {
//         facebook: {
//           handle: s_facebook.link,
//           isPublic: s_facebook.isPublic,
//           type: 'facebook',
//           isVerified: socialsLinksMap.facebook?.isVerified,
//         },
//         instagram: {
//           handle: s_instagram.link,
//           isPublic: s_instagram.isPublic,
//           type: 'instagram',
//           isVerified: socialsLinksMap.instagram?.isVerified,
//         },
//         x: {
//           handle: s_x.link,
//           isPublic: s_x.isPublic,
//           type: 'x',
//           isVerified: socialsLinksMap.x?.isVerified,
//         },
//         tiktok: {
//           handle: s_tiktok.link,
//           isPublic: s_tiktok.isPublic,
//           type: 'tiktok',
//           isVerified: socialsLinksMap.tiktok?.isVerified,
//         },
//         snapchat: {
//           handle: s_snapchat.link,
//           isPublic: s_snapchat.isPublic,
//           type: 'snapchat',
//           isVerified: socialsLinksMap.snapchat?.isVerified,
//         },
//         linkedin: {
//           handle: s_linkedin.link,
//           isPublic: s_linkedin.isPublic,
//           type: 'linkedin',
//           isVerified: socialsLinksMap.linkedin?.isVerified,
//         },
//         discord: {
//           handle: s_discord.link,
//           isPublic: s_discord.isPublic,
//           type: 'discord',
//           isVerified: socialsLinksMap.discord?.isVerified,
//         },
//         pinterest: {
//           handle: s_pinterest.link,
//           isPublic: s_pinterest.isPublic,
//           type: 'pinterest',
//           isVerified: socialsLinksMap.pinterest?.isVerified,
//         },
//         twitch: {
//           handle: s_twitch.link,
//           isPublic: s_twitch.isPublic,
//           type: 'twitch',
//           isVerified: socialsLinksMap.twitch?.isVerified,
//         },
//         reddit: {
//           handle: s_reddit.link,
//           isPublic: s_reddit.isPublic,
//           type: 'reddit',
//           isVerified: socialsLinksMap.reddit?.isVerified,
//         },
//         mastadon: {
//           handle: s_mastadon.link,
//           isPublic: s_mastadon.isPublic,
//           type: 'mastadon',
//           isVerified: socialsLinksMap.mastadon?.isVerified,
//         },
//         youmeme: {
//           handle: s_youmeme.link,
//           isPublic: s_youmeme.isPublic,
//           type: 'youmeme',
//           isVerified: socialsLinksMap.youmeme?.isVerified,
//         },
//         rumble: {
//           handle: s_rumble.link,
//           isPublic: s_rumble.isPublic,
//           type: 'rumble',
//           isVerified: socialsLinksMap.rumble?.isVerified,
//         },
//         youtube: {
//           handle: s_youtube.link,
//           isPublic: s_youtube.isPublic,
//           type: 'youtube',
//           isVerified: socialsLinksMap.youtube?.isVerified,
//         },
//         vk: {
//           handle: s_vk.link,
//           isPublic: s_vk.isPublic,
//           type: 'vk',
//           isVerified: socialsLinksMap.vk?.isVerified,
//         },
//         qq: {
//           handle: s_qq.link,
//           isPublic: s_qq.isPublic,
//           type: 'qq',
//           isVerified: socialsLinksMap.qq?.isVerified,
//         },
//       } satisfies Record<SocialAccount, UserLink>;
//       const userMessagingApps = {
//         whatsapp: {
//           handle: m_whatsapp.link,
//           isPublic: m_whatsapp.isPublic,
//           type: 'whatsapp',
//           isVerified: socialsLinksMap.whatsapp?.isVerified,
//         },
//         telegram: {
//           handle: m_telegram.link,
//           isPublic: m_telegram.isPublic,
//           type: 'telegram',
//           isVerified: socialsLinksMap.telegram?.isVerified,
//         },
//         signal: {
//           handle: m_signal.link,
//           isPublic: m_signal.isPublic,
//           type: 'signal',
//           isVerified: socialsLinksMap.signal?.isVerified,
//         },
//         weChat: {
//           handle: m_weChat.link,
//           isPublic: m_weChat.isPublic,
//           type: 'weChat',
//           isVerified: socialsLinksMap.weChat?.isVerified,
//         },
//       } satisfies Record<MessagingAppType, UserLink>;
//       const userWallets = {
//         solana: {
//           handle: w_solana.link,
//           isPublic: w_solana.isPublic,
//           type: 'solana',
//           isVerified: socialsLinksMap.solana?.isVerified,
//         },
//         btc: {
//           handle: w_btc.link,
//           isPublic: w_btc.isPublic,
//           type: 'btc',
//           isVerified: socialsLinksMap.btc?.isVerified,
//         },
//         near: {
//           handle: w_near.link,
//           isPublic: w_near.isPublic,
//           type: 'near',
//           isVerified: socialsLinksMap.near?.isVerified,
//         },
//         cardano: {
//           handle: w_cardano.link,
//           isPublic: w_cardano.isPublic,
//           type: 'cardano',
//           isVerified: socialsLinksMap.cardano?.isVerified,
//         },
//         // venom: {
//         //   handle: w_venom.link,
//         //   isPublic: w_venom.isPublic,
//         //   type: 'venom',
//         // },

//         aptos: {
//           handle: w_aptos.link,
//           isPublic: w_aptos.isPublic,
//           type: 'aptos',
//           isVerified: socialsLinksMap.aptos?.isVerified,
//         },
//         cosmos: {
//           handle: w_cosmos.link,
//           isPublic: w_cosmos.isPublic,
//           type: 'cosmos',
//           isVerified: socialsLinksMap.cosmos?.isVerified,
//         },
//         sui: {
//           handle: w_sui.link,
//           isPublic: w_sui.isPublic,
//           type: 'sui',
//           isVerified: socialsLinksMap.sui?.isVerified,
//         },
//         icp: {
//           handle: w_icp.link,
//           isPublic: w_icp.isPublic,
//           type: 'icp',
//           isVerified: socialsLinksMap.icp?.isVerified,
//         },
//         doge: {
//           handle: w_doge.link,
//           isPublic: w_doge.isPublic,
//           type: 'doge',
//           isVerified: socialsLinksMap.doge?.isVerified,
//         },
//         lukso: {
//           handle: w_lukso.link,
//           isPublic: w_lukso.isPublic,
//           type: 'lukso',
//           isVerified: socialsLinksMap.lukso?.isVerified,
//         },
//         polkadot: {
//           handle: w_polkadot.link,
//           isPublic: w_polkadot.isPublic,
//           type: 'polkadot',
//           isVerified: socialsLinksMap.polkadot?.isVerified,
//         },
//         algorand: {
//           handle: w_algorand.link,
//           isPublic: w_algorand.isPublic,
//           type: 'algorand',
//           isVerified: socialsLinksMap.algorand?.isVerified,
//         },
//         tron: {
//           handle: w_tron.link,
//           isPublic: w_tron.isPublic,
//           type: 'tron',
//           isVerified: socialsLinksMap.tron?.isVerified,
//         },
//         ton: {
//           handle: w_ton.link,
//           isPublic: w_ton.isPublic,
//           type: 'ton',
//           isVerified: socialsLinksMap.ton?.isVerified,
//         },
//         wallet1: {
//           handle: w_wallet1.link,
//           isPublic: w_wallet1.isPublic,
//           type: 'wallet1',
//           isVerified: true,
//         },
//         wallet2: {
//           handle: w_wallet2.link,
//           isPublic: w_wallet2.isPublic,
//           type: 'wallet2',
//           isVerified: true,
//         },
//         wallet3: {
//           handle: w_wallet3.link,
//           isPublic: w_wallet3.isPublic,
//           type: 'wallet3',
//           isVerified: true,
//         },
//         wallet4: {
//           handle: w_wallet4.link,
//           isPublic: w_wallet4.isPublic,
//           type: 'wallet4',
//           isVerified: true,
//         },
//         wallet5: {
//           handle: w_wallet5.link,
//           isPublic: w_wallet5.isPublic,
//           type: 'wallet5',
//           isVerified: true,
//         },
//       } satisfies Partial<Record<WalletType, UserLink>>;

//       const decentralizedIdentifiers = {
//         anima: {
//           handle: d_anima.link,
//           isPublic: d_anima.isPublic,
//           type: 'anima',
//           isVerified: socialsLinksMap.anima?.isVerified,
//         },
//         worldId: {
//           handle: d_worldId.link,
//           isPublic: d_worldId.isPublic,
//           type: 'worldId',
//           isVerified: socialsLinksMap.worldId?.isVerified,
//         },
//         lens: {
//           handle: d_lens.link,
//           isPublic: d_lens.isPublic,
//           type: 'lens',
//           isVerified: socialsLinksMap.lens?.isVerified,
//         },
//         ens: {
//           handle: d_ens.link,
//           isPublic: d_ens.isPublic,
//           type: 'ens',
//           isVerified: socialsLinksMap.ens?.isVerified,
//         },
//         bnbNameService: {
//           handle: d_bnb.link,
//           isPublic: d_bnb.isPublic,
//           type: 'bnbNameService',
//           isVerified: socialsLinksMap.bnbNameService?.isVerified,
//         },

//         demos: {
//           handle: d_demos.link,
//           isPublic: d_anima.isPublic,
//           type: 'demos',
//           isVerified: socialsLinksMap.demos?.isVerified,
//         },
//       } satisfies Record<DecentralizedIdentifiersType, UserLink>;
//       return {
//         id: user.id,
//         createdAt: user.createdAt,
//         handle: user.handle,
//         smartAccountAddress: user.smartAccountAddress,
//         walletAddress: user.walletAddress,
//         name,
//         profilePicture: profileImage,
//         socials: userSocials,
//         messagingApps: userMessagingApps,
//         wallets: userWallets,
//         decentralizedIdentifiers,
//         socialsLinks: user.socialsLinks,
//         isCurrentConnection: user.isCurrentConnection,
//       } satisfies Partial<Connection>;
//     },
//     staleTime: 0,
//     cacheTime: 0,
//     enabled: !!handle,
//   });
// };
// export const useQueryGetUserConnections = () => {
//   const token = useAuthStore((state) => state.token);
//   const queryKey = ['connections'];
//   const queryFn = async () => {
//     const bonuzSocialIdContractRead = new ethers.Contract(
//       SOCIAL_ID_ADDRESS,
//       BonuzSocialIdAbi,
//       bonuzSmartAccountSigner,
//     );

//     const { data: connections } = await getConnections(token!);

//     const promises = connections.map(async (connection) => {
//       return bonuzSocialIdContractRead?.getUserProfileAndSocialLinks(
//         connection.smartAccountAddress,
//         SUPPORTED_PLATFORMS,
//       );
//     });

//     const contractData = await Promise.all(promises);

//     return {
//       connections,
//       contractData,
//     };
//   };

//   return useQuery(queryKey, queryFn, {
//     select: ({ contractData, connections }) => {
//       if (!contractData || !connections) return null;

//       return contractData.map((contractData, index) => {
//         const [name, profileImage, handle, links] = contractData;
//         const user = connections[index];
//         const [
//           s_x,
//           s_instagram,
//           s_facebook,
//           s_linkedin,
//           s_tiktok,
//           s_snapchat,
//           s_discord,
//           s_pinterest,
//           s_twitch,
//           s_reddit,
//           s_mastadon,
//           s_youmeme,
//           s_rumble,
//           s_youtube,
//           s_vk,
//           s_qq,
//           w_near,
//           w_sui,
//           w_aptos,
//           w_cosmos,
//           w_cardano,
//           w_solana,
//           w_icp,
//           w_btc,
//           w_doge,
//           w_polkadot,
//           w_lukso,
//           w_algorand,
//           w_tron,
//           w_ton,
//           w_wallet1,
//           w_wallet2,
//           w_wallet3,
//           w_wallet4,
//           w_wallet5,
//           m_telegram,
//           m_whatsapp,
//           m_signal,
//           m_weChat,
//           d_ens,
//           d_worldId,
//           d_lens,
//           d_bnb,
//           d_anima,
//           d_demos,
//         ] = links.map(getPublicData);

//         const socialsLinksMap = user.socialsLinks.reduce(
//           (acc, link) => {
//             acc[link.type] = link;
//             return acc;
//           },
//           {} as Record<string, { type: string; isVerified: boolean }>,
//         );

//         const userSocials = {
//           facebook: {
//             handle: s_facebook.link,
//             isPublic: s_facebook.isPublic,
//             type: 'facebook',
//             isVerified: socialsLinksMap.facebook?.isVerified,
//           },
//           instagram: {
//             handle: s_instagram.link,
//             isPublic: s_instagram.isPublic,
//             type: 'instagram',
//             isVerified: socialsLinksMap.instagram?.isVerified,
//           },
//           x: {
//             handle: s_x.link,
//             isPublic: s_x.isPublic,
//             type: 'x',
//             isVerified: socialsLinksMap.x?.isVerified,
//           },
//           tiktok: {
//             handle: s_tiktok.link,
//             isPublic: s_tiktok.isPublic,
//             type: 'tiktok',
//             isVerified: socialsLinksMap.tiktok?.isVerified,
//           },
//           snapchat: {
//             handle: s_snapchat.link,
//             isPublic: s_snapchat.isPublic,
//             type: 'snapchat',
//             isVerified: socialsLinksMap.snapchat?.isVerified,
//           },
//           linkedin: {
//             handle: s_linkedin.link,
//             isPublic: s_linkedin.isPublic,
//             type: 'linkedin',
//             isVerified: socialsLinksMap.linkedin?.isVerified,
//           },
//           discord: {
//             handle: s_discord.link,
//             isPublic: s_discord.isPublic,
//             type: 'discord',
//             isVerified: socialsLinksMap.discord?.isVerified,
//           },
//           pinterest: {
//             handle: s_pinterest.link,
//             isPublic: s_pinterest.isPublic,
//             type: 'pinterest',
//             isVerified: socialsLinksMap.pinterest?.isVerified,
//           },
//           twitch: {
//             handle: s_twitch.link,
//             isPublic: s_twitch.isPublic,
//             type: 'twitch',
//             isVerified: socialsLinksMap.twitch?.isVerified,
//           },
//           reddit: {
//             handle: s_reddit.link,
//             isPublic: s_reddit.isPublic,
//             type: 'reddit',
//             isVerified: socialsLinksMap.reddit?.isVerified,
//           },
//           mastadon: {
//             handle: s_mastadon.link,
//             isPublic: s_mastadon.isPublic,
//             type: 'mastadon',
//             isVerified: socialsLinksMap.mastadon?.isVerified,
//           },
//           youmeme: {
//             handle: s_youmeme.link,
//             isPublic: s_youmeme.isPublic,
//             type: 'youmeme',
//             isVerified: socialsLinksMap.youmeme?.isVerified,
//           },
//           rumble: {
//             handle: s_rumble.link,
//             isPublic: s_rumble.isPublic,
//             type: 'rumble',
//             isVerified: socialsLinksMap.rumble?.isVerified,
//           },
//           youtube: {
//             handle: s_youtube.link,
//             isPublic: s_youtube.isPublic,
//             type: 'youtube',
//             isVerified: socialsLinksMap.youtube?.isVerified,
//           },
//           vk: {
//             handle: s_vk.link,
//             isPublic: s_vk.isPublic,
//             type: 'vk',
//             isVerified: socialsLinksMap.vk?.isVerified,
//           },
//           qq: {
//             handle: s_qq.link,
//             isPublic: s_qq.isPublic,
//             type: 'qq',
//             isVerified: socialsLinksMap.qq?.isVerified,
//           },
//         } satisfies Record<SocialAccount, UserLink>;
//         const userMessagingApps = {
//           whatsapp: {
//             handle: m_whatsapp.link,
//             isPublic: m_whatsapp.isPublic,
//             type: 'whatsapp',
//             isVerified: socialsLinksMap.whatsapp?.isVerified,
//           },
//           telegram: {
//             handle: m_telegram.link,
//             isPublic: m_telegram.isPublic,
//             type: 'telegram',
//             isVerified: socialsLinksMap.telegram?.isVerified,
//           },
//           signal: {
//             handle: m_signal.link,
//             isPublic: m_signal.isPublic,
//             type: 'signal',
//             isVerified: socialsLinksMap.signal?.isVerified,
//           },
//           weChat: {
//             handle: m_weChat.link,
//             isPublic: m_weChat.isPublic,
//             type: 'weChat',
//             isVerified: socialsLinksMap.weChat?.isVerified,
//           },
//         } satisfies Record<MessagingAppType, UserLink>;
//         const userWallets = {
//           solana: {
//             handle: w_solana.link,
//             isPublic: w_solana.isPublic,
//             type: 'solana',
//             isVerified: socialsLinksMap.solana?.isVerified,
//           },
//           btc: {
//             handle: w_btc.link,
//             isPublic: w_btc.isPublic,
//             type: 'btc',
//             isVerified: socialsLinksMap.btc?.isVerified,
//           },
//           near: {
//             handle: w_near.link,
//             isPublic: w_near.isPublic,
//             type: 'near',
//             isVerified: socialsLinksMap.near?.isVerified,
//           },
//           cardano: {
//             handle: w_cardano.link,
//             isPublic: w_cardano.isPublic,
//             type: 'cardano',
//             isVerified: socialsLinksMap.cardano?.isVerified,
//           },
//           // venom: {
//           //   handle: w_venom.link,
//           //   isPublic: w_venom.isPublic,
//           //   type: 'venom',
//           // },

//           aptos: {
//             handle: w_aptos.link,
//             isPublic: w_aptos.isPublic,
//             type: 'aptos',
//             isVerified: socialsLinksMap.aptos?.isVerified,
//           },
//           cosmos: {
//             handle: w_cosmos.link,
//             isPublic: w_cosmos.isPublic,
//             type: 'cosmos',
//             isVerified: socialsLinksMap.cosmos?.isVerified,
//           },
//           sui: {
//             handle: w_sui.link,
//             isPublic: w_sui.isPublic,
//             type: 'sui',
//             isVerified: socialsLinksMap.sui?.isVerified,
//           },
//           icp: {
//             handle: w_icp.link,
//             isPublic: w_icp.isPublic,
//             type: 'icp',
//             isVerified: socialsLinksMap.icp?.isVerified,
//           },
//           doge: {
//             handle: w_doge.link,
//             isPublic: w_doge.isPublic,
//             type: 'doge',
//             isVerified: socialsLinksMap.doge?.isVerified,
//           },
//           lukso: {
//             handle: w_lukso.link,
//             isPublic: w_lukso.isPublic,
//             type: 'lukso',
//             isVerified: socialsLinksMap.lukso?.isVerified,
//           },
//           polkadot: {
//             handle: w_polkadot.link,
//             isPublic: w_polkadot.isPublic,
//             type: 'polkadot',
//             isVerified: socialsLinksMap.polkadot?.isVerified,
//           },
//           algorand: {
//             handle: w_algorand.link,
//             isPublic: w_algorand.isPublic,
//             type: 'algorand',
//             isVerified: socialsLinksMap.algorand?.isVerified,
//           },
//           tron: {
//             handle: w_tron.link,
//             isPublic: w_tron.isPublic,
//             type: 'tron',
//             isVerified: socialsLinksMap.tron?.isVerified,
//           },
//           ton: {
//             handle: w_ton.link,
//             isPublic: w_ton.isPublic,
//             type: 'ton',
//             isVerified: socialsLinksMap.ton?.isVerified,
//           },
//           wallet1: {
//             handle: w_wallet1.link,
//             isPublic: w_wallet1.isPublic,
//             type: 'wallet1',
//             isVerified: true,
//           },
//           wallet2: {
//             handle: w_wallet2.link,
//             isPublic: w_wallet2.isPublic,
//             type: 'wallet2',
//             isVerified: true,
//           },
//           wallet3: {
//             handle: w_wallet3.link,
//             isPublic: w_wallet3.isPublic,
//             type: 'wallet3',
//             isVerified: true,
//           },
//           wallet4: {
//             handle: w_wallet4.link,
//             isPublic: w_wallet4.isPublic,
//             type: 'wallet4',
//             isVerified: true,
//           },
//           wallet5: {
//             handle: w_wallet5.link,
//             isPublic: w_wallet5.isPublic,
//             type: 'wallet5',
//             isVerified: true,
//           },
//         } satisfies Partial<Record<WalletType, UserLink>>;

//         const decentralizedIdentifiers = {
//           anima: {
//             handle: d_anima.link,
//             isPublic: d_anima.isPublic,
//             type: 'anima',
//             isVerified: socialsLinksMap.anima?.isVerified,
//           },
//           worldId: {
//             handle: d_worldId.link,
//             isPublic: d_worldId.isPublic,
//             type: 'worldId',
//             isVerified: socialsLinksMap.worldId?.isVerified,
//           },
//           lens: {
//             handle: d_lens.link,
//             isPublic: d_lens.isPublic,
//             type: 'lens',
//             isVerified: socialsLinksMap.lens?.isVerified,
//           },
//           ens: {
//             handle: d_ens.link,
//             isPublic: d_ens.isPublic,
//             type: 'ens',
//             isVerified: socialsLinksMap.ens?.isVerified,
//           },
//           bnbNameService: {
//             handle: d_bnb.link,
//             isPublic: d_bnb.isPublic,
//             type: 'bnbNameService',
//             isVerified: socialsLinksMap.bnbNameService?.isVerified,
//           },

//           demos: {
//             handle: d_demos.link,
//             isPublic: d_anima.isPublic,
//             type: 'demos',
//             isVerified: socialsLinksMap.demos?.isVerified,
//           },
//         } satisfies Record<DecentralizedIdentifiersType, UserLink>;
//         return {
//           id: user.id,
//           createdAt: user.createdAt,
//           handle: user.handle,
//           smartAccountAddress: user.smartAccountAddress,
//           walletAddress: user.walletAddress,
//           name,
//           profilePicture: profileImage,
//           socials: userSocials,
//           messagingApps: userMessagingApps,
//           wallets: userWallets,
//           decentralizedIdentifiers,
//           isCurrentConnection: user.isCurrentConnection,
//         } satisfies Partial<Connection>;
//       });
//     },
//     cacheTime: 0,
//   });
// };
// export const useQueryGetUserMessages = () => {
//   const token = useAuthStore((state) => state.token);
//   const queryKey = ['messages'];

//   return useInfiniteQuery({
//     queryKey,
//     queryFn: async ({ pageParam }) => {
//       const bonuzSocialIdContractRead = new ethers.Contract(
//         SOCIAL_ID_ADDRESS,
//         BonuzSocialIdAbi,
//         bonuzSmartAccountSigner,
//       );

//       const { data } = await getMessages({ accessToken: token!, page: pageParam });

//       const promises = data.messages.data.map(async (message) => {
//         return bonuzSocialIdContractRead?.getUserProfileAndSocialLinks(
//           message.user.smartAccountAddress,
//           SUPPORTED_PLATFORMS,
//         );
//       });

//       const contractData = await Promise.all(promises);
//       return {
//         messages: data,
//         contractData,
//       };
//     },

//     select: ({ pages, pageParams }) => {
//       const newPages = pages.map(({ contractData, messages }) => {
//         return {
//           messages: {
//             data: contractData.map((contractData, index) => {
//               const [name, profileImage] = contractData;
//               const originalMessage = messages.messages.data[index];

//               return {
//                 ...originalMessage,
//                 user: {
//                   id: originalMessage.user.id,
//                   handle: originalMessage.user.handle,
//                   name,
//                   profilePicture: profileImage,
//                 },
//               };
//             }) as Message[],
//             pageCount: messages.messages.pageCount,
//             next: messages.messages.next,
//           },
//         };
//       });
//       return {
//         pages: newPages,
//         pageParams,
//       };
//     },
//     getNextPageParam: (lastPage) => {
//       return lastPage.messages?.messages?.next ?? undefined;
//     },
//     cacheTime: 0,
//     staleTime: 1000 * 60,
//   });
// };

// export const useQueryGetUserMessagesWithoutUsersData = () => {
//   const token = useAuthStore((state) => state.token);
//   const queryKey = ['messages'];

//   return useInfiniteQuery({
//     queryKey,
//     queryFn: async ({ pageParam }) => {
//       const { data } = await getMessages({ accessToken: token!, page: pageParam });

//       return {
//         messages: data,
//       };
//     },

//     select: ({ pages, pageParams }) => {
//       const newPages = pages.map(({ messages }) => {
//         return {
//           messages: {
//             data: messages.messages.data,
//             pageCount: messages.messages.pageCount,
//             next: messages.messages.next,
//           },
//         };
//       });
//       return {
//         pages: newPages,
//         pageParams,
//       };
//     },
//     getNextPageParam: (lastPage) => {
//       return lastPage.messages?.messages?.next ?? undefined;
//     },
//     cacheTime: 0,
//     staleTime: 1000 * 60,
//   });
// };

// // ----------------------------------------------------

// interface CreateUserProfileMutationArgs {
//   name: string;
//   profilePicture: ImagePickerAsset | string | null;
//   handle: string;
// }
// export const useMutationCreateUserProfile = (
//   handelOnSuccess: (data: any) => void,
//   handleOnError: (data: any) => void,
// ) => {
//   const queryClient = useQueryClient();
//   const token = useAuthStore((state) => state.token);

//   const mutationFn = async (userData: CreateUserProfileMutationArgs) => {
//     if (typeof userData.profilePicture !== 'string' && userData.profilePicture !== null) {
//       const imageUrl = await uploadImageToIPFS(userData.profilePicture);

//       userData.profilePicture = imageUrl!;
//     }

//     return await createUser(token!, {
//       name: userData.name,
//       profileImage: userData.profilePicture ?? '',
//       handle: userData.handle,
//     });
//   };

//   return useMutation(mutationFn, {
//     onSuccess(data) {
//       queryClient.invalidateQueries({
//         queryKey: ['getUserProfileAndSocialLinks'],
//         exact: true,
//       });

//       handelOnSuccess(data);
//     },
//     onError(error) {
//       handleOnError(error);
//     },
//   });
// };
interface SetUserProfileMutationArgs {
  name?: string;
  profilePicture?: ImagePickerAsset;
  handle?: string;
  socials: Record<SocialAccount, Link>;
  messagingApps: Record<MessagingAppType, Link>;
  wallets: Record<WalletType, Link>;
  decentralizedIdentifiers: Record<DecentralizedIdentifiersType, Link>;
}
export const useMutationSetUserProfile = (
  handelOnSuccess: (data: any) => void,
  handleOnError: (error: { message: string }) => void,
) => {
  const privateKey = useUserStore((state) => (state.wallet as Wallet).privateKey);
  const mutationFn = async (userData: SetUserProfileMutationArgs) => {
    let newProfilePicture;

    if (userData.profilePicture) {
      const imageUrl = await uploadImageToIPFS(userData.profilePicture);
      console.log('imageUrl', imageUrl);

      newProfilePicture = imageUrl;
    }

    const updateUser = async ({
      socials = {},
      messagingApps = {},
      wallets = {},
      decentralizedIdentifiers = {},
      handle,
      name,
      profilePicture,
    }: {
      socials: Record<string, Link>;
      messagingApps: Record<string, Link>;
      wallets: Record<string, Link>;
      decentralizedIdentifiers: Record<string, Link>;
      handle?: string;
      name?: string;
      profilePicture?: string;
      validations?: Partial<Record<SocialAccount, any>>;
    }) => {
      const prepareLink = (link: Link) => {
        let newLink;

        if (link.isPublic) {
          newLink = `p_${link.handle}`;
        } else {
          console.log('link.handle', link.handle, privateKey);

          const encrypted = CryptoES.AES.encrypt(link.handle, privateKey).toString();
          newLink = `e_${encrypted}`;
        }

        return newLink;
      };

      const socialLinksCombined: {
        platforms: string[];
        links: string[];
      } = {
        platforms: [],
        links: [],
      };

      const socialPlatforms = Object.keys(socials).map((platform) => `s_${platform}`);
      const socialLinks = Object.values(socials).map((element) => prepareLink(element));

      const messagePlatforms = Object.keys(messagingApps).map((platform) => `m_${platform}`);
      const messageLinks = Object.values(messagingApps).map((element) => prepareLink(element));

      const walletPlatforms = Object.keys(wallets).map((platform) => `w_${platform}`);
      const walletLinks = Object.values(wallets).map((element) => prepareLink(element));

      const decentralizedIdentifiersPlatforms = Object.keys(decentralizedIdentifiers).map(
        (platform) => `d_${platform}`,
      );
      const decentralizedIdentifiersLinks = Object.values(decentralizedIdentifiers).map((element) =>
        prepareLink(element),
      );

      socialLinksCombined.platforms = [
        ...socialPlatforms,
        ...messagePlatforms,
        ...walletPlatforms,
        ...decentralizedIdentifiersPlatforms,
      ];

      socialLinksCombined.links = [
        ...socialLinks,
        ...messageLinks,
        ...walletLinks,
        ...decentralizedIdentifiersLinks,
      ];

      const data = {
        socialLinks: socialLinksCombined,
        ...(handle && { handle }),
        ...(name && { name }),
        ...(profilePicture && { profileImage: profilePicture }),
      };
      console.log('data', data);

      return updateUserInfo(data);
    };

    try {
      await updateUser({
        handle: userData.handle,
        name: userData.name,
        profilePicture: newProfilePicture,
        socials: userData.socials,
        messagingApps: userData.messagingApps,
        wallets: userData.wallets,
        decentralizedIdentifiers: userData.decentralizedIdentifiers,
      });
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateUser'],
    mutationFn,
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ['getUserProfileAndSocialLinks'],
        exact: true,
      });

      handelOnSuccess(data);
    },
    onError(error) {
      const _error = error as HTTPError;

      handleOnError({ message: _error.message });
    },
  });
};

export const useUserConnections = (options?: any) => {
  const [getConnections] = useLazyApolloQuery<SocialIdSubGraphResponse>(
    GET_USER_PROFILES_BY_HANDLES,
    { client: socialIdSubgraphApolloClient },
  );
  // console.log('userConnections');

  return useQuery<(SocialIdUser & { address: string })[]>({
    queryKey: ['userConnections'],
    queryFn: async () => {
      const userConnections = await getUserConnections();

      const handlesToFetch = userConnections.map((connection) => connection.handle);

      const { data: connectionsData } = await getConnections({
        variables: {
          handles: handlesToFetch,
        },
      });

      return connectionsData?.userProfiles.map((connection) => {
        const socials = {} as Record<string, Link>;
        const messagingApps = {} as Record<string, Link>;
        const wallets = {} as Record<string, Link>;
        const decentralizedIdentifiers = {} as Record<string, Link>;

        // eslint-disable-next-line unicorn/no-array-reduce
        for (const link of connection.socialLinks) {
          if (!link.link?.startsWith('p_')) {
            continue;
          }
          const type = link.platform.slice(2);
          const handle = link.link.slice(2);

          if (link.platform.startsWith('s_')) {
            socials[type] = {
              handle: handle,
              isPublic: true,
              type,
            };
          }

          if (link.platform.startsWith('m_')) {
            messagingApps[type] = {
              handle: handle,
              isPublic: true,
              type,
            };
          }

          if (link.platform.startsWith('w_')) {
            wallets[type] = {
              handle: handle,
              isPublic: true,
              type,
            };
          }

          if (link.platform.startsWith('d_')) {
            decentralizedIdentifiers[type] = {
              handle: handle,
              isPublic: true,
              type,
            };
          }
        }

        return {
          id: userConnections.find((user) => user.handle === connection.handle)?.id,
          name: connection.name,
          profilePicture: connection.profileImage,
          handle: connection.handle,
          address: connection.wallet,
          socials,
          messagingApps,
          wallets,
          decentralizedIdentifiers,
        };
      });
    },
    staleTime: 0,
    ...options,
  });
};
