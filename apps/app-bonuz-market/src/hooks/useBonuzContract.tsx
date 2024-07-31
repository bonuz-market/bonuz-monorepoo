// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ethers } from 'ethers'
import CryptoES from 'crypto-es'
import { ToastContainer, toast } from 'react-toastify'
import { BonuzSocialId, contractAddresses } from '../constants/contracts'
import {
  BLOCKCHAIN_WALLET_BASE_URLS,
  DIGITAL_IDENTIFIER_BASE_URLS,
  MESSAGING_APP_BASE_URLS,
  MESSAGING_APPS,
  SOCIAL_ACCOUNTS,
  SOCIAL_BASE_URLS,
  SUPPORTED_PLATFORMS,
} from '../types/socialAccounts'
import { User, UserProfileData } from '../types/user'
import { isWalletAddress } from '../utils'
import { backendBaseUrl, bonuzSocialIdChainId, RPC_URL } from '../../config'
import { getUserInfo, updateUser, updateUserLink } from '@/lib/services'
import { useBiconomyShallowStore } from './useBiconomyShallowStore'
import { useSessionStore } from '@/store/sessionStore'
import { shallow } from 'zustand/shallow'

export const useQueryGetPublicUserProfileAndSocialLinks = (handle: string) => {
  const queryKey = ['getPublicUserProfileAndSocialLinks', handle]
  const queryFn = async () => {
    const bonuzSocialIdContractAddress =
      contractAddresses[bonuzSocialIdChainId]?.BonuzSocialId
    const bonuzSocialIdRpcUrl = RPC_URL[bonuzSocialIdChainId]
    const bonuzSocialIdProvider = new ethers.providers.JsonRpcProvider(
      bonuzSocialIdRpcUrl
    )

    const bonuzSocialIdContractRead = new ethers.Contract(
      bonuzSocialIdContractAddress,
      BonuzSocialId.abi,
      bonuzSocialIdProvider
    )

    const isAddress = isWalletAddress(handle ?? '')
    let address = handle
    let user: User = {
      id: '',
      smartAccountAddress: address,
      walletAddress: address,
      connections: [],
      isCurrentConnection: false,
      email: null,
      name: null,
      handle: null,
      profilePicture: null,
      socialsLinks: null,
      links: [],
      wallets: {},
      messagingApps: {},
      createdAt: '',
    }

    // if (!isAddress) {
    const url = `${backendBaseUrl}/api/users/${handle}`
    const res = await axios.get<User>(url)
    const userInfo = res?.data
    console.log('userInfo ', userInfo)

    address = userInfo.smartAccountAddress
    user = userInfo
    // }

    const contractData =
      await bonuzSocialIdContractRead?.getUserProfileAndSocialLinks(
        address,
        SUPPORTED_PLATFORMS
      )

    return {
      user,
      contractData,
    }
  }

  return useQuery({
    queryKey,
    queryFn,
    // enabled: !!handle && !!bonuzSocialIdContract,
    select: ({ contractData, user }) => {
      if (!contractData || !user) return null

      const [name, profileImage, handle, links] = contractData

      const getPublicData = (link: string) => {
        if (link.startsWith('p_')) {
          return {
            link: link.slice(2), // Remove the "p_" prefix
            isPublic: true,
          }
        }

        return {
          link,
          isPublic: false,
        }
      }

      const socialsLinksMap = user?.socialsLinks?.reduce(
        (acc: any, link: any) => {
          acc[link.type] = link
          return acc
        },
        {} as Record<string, { type: string; isVerified: boolean }>
      )

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
        w_walletConnect,
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
        m_telegram,
        m_whatsapp,
        m_signal,
        m_weChat,
        d_ens,
        d_worldId,
        d_lens,
      ] = links.map(getPublicData)

      return {
        name,
        handle,
        id: user.id,
        connections: user.connections,
        smartAccountAddress: user.smartAccountAddress,
        walletAddress: user.walletAddress,
        isCurrentConnection: user.isCurrentConnection,
        profileImage,
        links: {
          socialMedias: {
            s_x: {
              link: s_x.link,
              isPublic: s_x.isPublic,
              icon: 'mdi:twitter',
              imgSrc: '/svg/social/Twitter.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_x],
              isVerified: socialsLinksMap.x?.isVerified,
              isTwitterVerified: socialsLinksMap.x?.isTwitterVerified,
              // isVerified: true
            },
            s_instagram: {
              link: s_instagram.link,
              isPublic: s_instagram.isPublic,
              icon: 'mdi:instagram',
              imgSrc: '/svg/social/Instagram.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_instagram],
              isVerified: socialsLinksMap.instagram?.isVerified,
            },
            s_facebook: {
              link: s_facebook.link,
              isPublic: s_facebook.isPublic,
              icon: 'mdi:facebook',
              imgSrc: '/svg/social/Facebook.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_facebook],
              isVerified: socialsLinksMap.facebook?.isVerified,
            },
            s_linkedin: {
              link: s_linkedin.link,
              isPublic: s_linkedin.isPublic,
              icon: 'mdi:linkedin',
              imgSrc: '/svg/social/Linkedin.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_linkedin],
              isVerified: socialsLinksMap.linkedin?.isVerified,
            },
            s_tiktok: {
              link: s_tiktok.link,
              isPublic: s_tiktok.isPublic,
              icon: 'ic:baseline-tiktok',
              imgSrc: '/svg/social/Tiktok.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_tiktok],
              isVerified: socialsLinksMap.tiktok?.isVerified,
            },
            s_snapchat: {
              link: s_snapchat.link,
              isPublic: s_snapchat.isPublic,
              icon: 'mdi:snapchat',
              imgSrc: '/svg/social/Snapchat.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_snapchat],
            },
            s_discord: {
              link: s_discord.link,
              isPublic: s_discord.isPublic,
              icon: 'mdi:discord',
              imgSrc: '/svg/social/Discord.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_discord],
              isVerified: socialsLinksMap.discord?.isVerified,
            },
            s_pinterest: {
              link: s_pinterest.link,
              isPublic: s_pinterest.isPublic,
              icon: 'mdi:pinterest',
              imgSrc: '/svg/social/Pinterest.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_pinterest],
              isVerified: socialsLinksMap.pinterest?.isVerified,
            },
            s_twitch: {
              link: s_twitch.link,
              isPublic: s_twitch.isPublic,
              icon: 'mdi:twitch',
              imgSrc: '/svg/social/Twitch.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_twitch],
              isVerified: socialsLinksMap.twitch?.isVerified,
            },
            s_reddit: {
              link: s_reddit.link,
              isPublic: s_reddit.isPublic,
              icon: 'mdi:reddit',
              imgSrc: '/svg/social/Reddit.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_reddit],
              isVerified: socialsLinksMap.reddit?.isVerified,
            },
            s_mastadon: {
              link: s_mastadon.link,
              isPublic: s_mastadon.isPublic,
              icon: 'mdi:mastodon',
              imgSrc: '/svg/social/Mastodon.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_mastadon],
              isVerified: socialsLinksMap.mastadon?.isVerified,
            },
            s_youmeme: {
              link: s_youmeme.link,
              isPublic: s_youmeme.isPublic,
              icon: '',
              imgSrc: '/svg/social/YouMeme.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_youmeme],
              isVerified: socialsLinksMap.youmeme?.isVerified,
            },
            s_rumble: {
              link: s_rumble.link,
              isPublic: s_rumble.isPublic,
              icon: 'simple-icons:rumble',
              imgSrc: '/svg/social/Rumble.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_rumble],
              isVerified: socialsLinksMap.rumble?.isVerified,
            },
            s_youtube: {
              link: s_youtube.link,
              isPublic: s_youtube.isPublic,
              icon: 'mdi:youtube',
              imgSrc: '/svg/social/Youtube.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_youtube],
              isVerified: socialsLinksMap.youtube?.isVerified,
            },
            s_vk: {
              link: s_vk.link,
              isPublic: s_vk.isPublic,
              icon: 'uil:vk',
              imgSrc: '/svg/social/VK.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_vk],
              isVerified: socialsLinksMap.vk?.isVerified,
            },
            s_qq: {
              link: s_qq.link,
              isPublic: s_qq.isPublic,
              icon: 'bi:tencent-qq',
              imgSrc: '/svg/social/QQ.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_qq],
              isVerified: socialsLinksMap.qq?.isVerified,
            },
          },
          blockchainsWallets: {
            w_walletConnect: {
              link: w_walletConnect.link,
              isPublic: w_walletConnect.isPublic,
              icon: 'simple-icons:walletconnect',
              imgSrc: '/svg/wallets/Walletconnect.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_walletconnect,
              isVerified: socialsLinksMap.walletConnect?.isVerified,
            },
            w_near: {
              link: w_near.link,
              isPublic: w_near.isPublic,
              icon: 'simple-icons:near',
              imgSrc: '/svg/wallets/Near.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_near,
              isVerified: socialsLinksMap.near?.isVerified,
            },
            w_sui: {
              link: w_sui.link,
              isPublic: w_sui.isPublic,
              icon: '',
              // imgSrc: '/svg/wallets/SUI.svg',
              imgSrc: '/svg/wallets/Cosmos.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_sui,
              isVerified: socialsLinksMap.sui?.isVerified,
            },
            w_aptos: {
              link: w_aptos.link,
              isPublic: w_aptos.isPublic,
              icon: '',
              imgSrc: '/svg/wallets/Aptos.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_aptos,
              isVerified: socialsLinksMap.aptos?.isVerified,
            },
            w_cosmos: {
              link: w_cosmos.link,
              isPublic: w_cosmos.isPublic,
              icon: '',
              imgSrc: '/svg/wallets/Cosmos.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_cosmos,
              isVerified: socialsLinksMap.cosmos?.isVerified,
            },
            w_cardano: {
              link: w_cardano.link,
              isPublic: w_cardano.isPublic,
              icon: 'formkit:cardano',
              imgSrc: '/svg/wallets/Cardano.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_cardano,
              isVerified: socialsLinksMap.cardano?.isVerified,
            },
            w_solana: {
              link: w_solana.link,
              isPublic: w_solana.isPublic,
              icon: 'formkit:solana',
              imgSrc: '/svg/wallets/Solana.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_solana,
              isVerified: socialsLinksMap.solana?.isVerified,
            },
            w_icp: {
              link: w_icp.link,
              isPublic: w_icp.isPublic,
              icon: 'cryptocurrency:icp',
              imgSrc: '/svg/wallets/ICP.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_icp,
              isVerified: socialsLinksMap.icp?.isVerified,
            },
            w_btc: {
              link: w_btc.link,
              isPublic: w_btc.isPublic,
              icon: 'cib:btc',
              imgSrc: '/svg/wallets/BTC.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_btc,
              isVerified: socialsLinksMap.btc?.isVerified,
            },
            w_doge: {
              link: w_doge.link,
              isPublic: w_doge.isPublic,
              icon: 'simple-icons:dogecoin',
              imgSrc: '/svg/wallets/Doge.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_doge,
              isVerified: socialsLinksMap.doge?.isVerified,
            },
            w_polkadot: {
              link: w_polkadot.link,
              isPublic: w_polkadot.isPublic,
              icon: 'simple-icons:polkadot',
              imgSrc: '/svg/wallets/Polkadot.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_polkadot,
              isVerified: socialsLinksMap.polkadot?.isVerified,
            },
            w_lukso: {
              link: w_lukso.link,
              isPublic: w_lukso.isPublic,
              icon: '',
              imgSrc: '/svg/wallets/Lukso.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_lukso,
              isVerified: socialsLinksMap.lukso?.isVerified,
            },
          },
          messengers: {
            m_telegram: {
              link: m_telegram.link,
              isPublic: m_telegram.isPublic,
              icon: 'ic:baseline-telegram',
              imgSrc: '/svg/social/Telegram.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_telegram],
              isVerified: socialsLinksMap.telegram?.isVerified,
            },
            m_whatsapp: {
              link: m_whatsapp.link,
              isPublic: m_whatsapp.isPublic,
              icon: 'mdi:whatsapp',
              imgSrc: '/svg/social/Whatsapp.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_whatsapp],
              isVerified: socialsLinksMap.whatsapp?.isVerified,
            },
            m_signal: {
              link: m_signal.link,
              isPublic: m_signal.isPublic,
              icon: 'bi:signal',
              imgSrc: '/svg/social/Signal.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_signal],
              isVerified: socialsLinksMap.signal?.isVerified,
            },
            m_weChat: {
              link: m_weChat.link,
              isPublic: m_weChat.isPublic,
              icon: 'mdi:wechat',
              imgSrc: '/svg/social/Wechat.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_weChat],
              isVerified: socialsLinksMap.weChat?.isVerified,
            },
          },

          digitalIdentifiers: {
            d_ens: {
              link: d_ens.link,
              isPublic: d_ens.isPublic,
              icon: 'mdi:ens',
              imgSrc: '/svg/digitalIdentifiers/Ens.svg',
              baseUrl: DIGITAL_IDENTIFIER_BASE_URLS.d_ens,
              isVerified: socialsLinksMap.ens?.isVerified,
            },
            d_lens: {
              link: d_lens.link,
              isPublic: d_lens.isPublic,
              // imgSrc: '/svg/lens.svg',
              imgSrc: '/svg/digitalIdentifiers/Lens.svg',
              baseUrl: DIGITAL_IDENTIFIER_BASE_URLS.d_lens,
              isVerified: socialsLinksMap.lens?.isVerified,
            },
            d_worldId: {
              link: d_worldId.link,
              isPublic: d_worldId.isPublic,
              // imgSrc: '/svg/world-coin.svg',
              imgSrc: '/svg/digitalIdentifiers/World ID.svg',
              baseUrl: DIGITAL_IDENTIFIER_BASE_URLS.d_worldId,
              isVerified: socialsLinksMap.worldId?.isVerified,
            },
          },
        },
      }
    },
  })
}

// -----------------------------------------
export const useQueryGetUserProfileAndSocialLinks = () => {
  const { web3auth, isConnected, smartAccount, bonuzSocialIdContract } =
    useBiconomyShallowStore()

  // const { token } = useSessionStore.getState();
  const { token, setToken } = useSessionStore(
    (state) => ({
      token: state.token,
      setToken: state.setToken,
      resetToken: state.resetToken,
    }),
    shallow
  )

  const queryKey = ['getUserProfileAndSocialLinks']

  //  console.log("isConnected && !!bonuzSocialIdContract && !!web3auth && !token, ", isConnected && !!bonuzSocialIdContract && !!web3auth && !token,);
  //  console.log({
  //   isConnected,
  //   bonuzSocialIdContract: !!bonuzSocialIdContract,
  //   web3auth: !!web3auth,
  //   token: !!token,
  //  })
  const queryFn = async () => {
    const address = await smartAccount?.getAccountAddress()

    const contractData =
      await bonuzSocialIdContract?.getUserProfileAndSocialLinks(
        address,
        SUPPORTED_PLATFORMS
      )

    const user = await getUserInfo(token!)

    const privateKey = await web3auth?.provider!.request({
      method: 'eth_private_key',
    })

    return {
      contractData,
      privateKey,
      user,
    }
  }

  return useQuery(queryKey, queryFn, {
    enabled: isConnected && !!bonuzSocialIdContract && !!web3auth && !!token,

    select: ({ contractData, privateKey, user: userData }) => {
      if (!contractData || !privateKey) return null

      const [name, profileImage, handle, links] = contractData

      const decryptLink = (link: string) => {
        if (link.startsWith('e_')) {
          return {
            link: CryptoES.AES.decrypt(
              link.slice(2),
              privateKey as string
            ).toString(CryptoES.enc.Utf8),
            isPublic: false,
          }
        }
        if (link.startsWith('p_')) {
          return {
            link: link.slice(2),
            isPublic: true,
          }
        }

        return {
          link,
          isPublic: true,
        }
      }

      const socialsLinksMap = userData?.socialsLinks?.reduce(
        (acc: any, link: any) => {
          acc[link.type] = link
          return acc
        },
        {} as Record<string, { type: string; isVerified: boolean }>
      )

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
        w_walletConnect,
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
        m_telegram,
        m_whatsapp,
        m_signal,
        m_weChat,
        d_ens,
        d_worldId,
        d_lens,
      ] = links.map(decryptLink)

      return {
        name,
        handle,
        profileImage,
        links: {
          socialMedias: {
            s_x: {
              link: s_x.link,
              isPublic: s_x.isPublic,
              icon: 'mdi:twitter',
              imgSrc: '/svg/social/Twitter.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_x],
              isVerified: socialsLinksMap.x?.isVerified,
              isTwitterVerified: socialsLinksMap.x?.isTwitterVerified,
              // isVerified: true,
              // isTwitterVerified: true,
            },
            s_instagram: {
              link: s_instagram.link,
              isPublic: s_instagram.isPublic,
              icon: 'mdi:instagram',
              imgSrc: '/svg/social/Instagram.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_instagram],
              isVerified: socialsLinksMap.instagram?.isVerified,
            },
            s_facebook: {
              link: s_facebook.link,
              isPublic: s_facebook.isPublic,
              icon: 'mdi:facebook',
              imgSrc: '/svg/social/Facebook.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_facebook],
              isVerified: socialsLinksMap.facebook?.isVerified,
            },
            s_linkedin: {
              link: s_linkedin.link,
              isPublic: s_linkedin.isPublic,
              icon: 'mdi:linkedin',
              imgSrc: '/svg/social/Linkedin.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_linkedin],
              isVerified: socialsLinksMap.linkedin?.isVerified,
            },
            s_tiktok: {
              link: s_tiktok.link,
              isPublic: s_tiktok.isPublic,
              icon: 'ic:baseline-tiktok',
              imgSrc: '/svg/social/Tiktok.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_tiktok],
              isVerified: socialsLinksMap.tiktok?.isVerified,
            },
            s_snapchat: {
              link: s_snapchat.link,
              isPublic: s_snapchat.isPublic,
              icon: 'mdi:snapchat',
              imgSrc: '/svg/social/Snapchat.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_snapchat],
            },
            s_discord: {
              link: s_discord.link,
              isPublic: s_discord.isPublic,
              icon: 'mdi:discord',
              imgSrc: '/svg/social/Discord.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_discord],
              isVerified: socialsLinksMap.discord?.isVerified,
            },
            s_pinterest: {
              link: s_pinterest.link,
              isPublic: s_pinterest.isPublic,
              icon: 'mdi:pinterest',
              imgSrc: '/svg/social/Pinterest.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_pinterest],
              isVerified: socialsLinksMap.pinterest?.isVerified,
            },
            s_twitch: {
              link: s_twitch.link,
              isPublic: s_twitch.isPublic,
              icon: 'mdi:twitch',
              imgSrc: '/svg/social/Twitch.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_twitch],
              isVerified: socialsLinksMap.twitch?.isVerified,
            },
            s_reddit: {
              link: s_reddit.link,
              isPublic: s_reddit.isPublic,
              icon: 'mdi:reddit',
              imgSrc: '/svg/social/Reddit.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_reddit],
              isVerified: socialsLinksMap.reddit?.isVerified,
            },
            s_mastadon: {
              link: s_mastadon.link,
              isPublic: s_mastadon.isPublic,
              icon: 'mdi:mastodon',
              imgSrc: '/svg/social/Mastodon.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_mastadon],
              isVerified: socialsLinksMap.mastadon?.isVerified,
            },
            s_youmeme: {
              link: s_youmeme.link,
              isPublic: s_youmeme.isPublic,
              icon: '',
              imgSrc: '/svg/social/YouMeme.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_youmeme],
              isVerified: socialsLinksMap.youmeme?.isVerified,
            },
            s_rumble: {
              link: s_rumble.link,
              isPublic: s_rumble.isPublic,
              icon: 'simple-icons:rumble',
              imgSrc: '/svg/social/Rumble.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_rumble],
              isVerified: socialsLinksMap.rumble?.isVerified,
            },
            s_youtube: {
              link: s_youtube.link,
              isPublic: s_youtube.isPublic,
              icon: 'mdi:youtube',
              imgSrc: '/svg/social/Youtube.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_youtube],
              isVerified: socialsLinksMap.youtube?.isVerified,
            },
            s_vk: {
              link: s_vk.link,
              isPublic: s_vk.isPublic,
              icon: 'uil:vk',
              imgSrc: '/svg/social/VK.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_vk],
              isVerified: socialsLinksMap.vk?.isVerified,
            },
            s_qq: {
              link: s_qq.link,
              isPublic: s_qq.isPublic,
              icon: 'bi:tencent-qq',
              imgSrc: '/svg/social/QQ.svg',
              baseUrl: SOCIAL_BASE_URLS[SOCIAL_ACCOUNTS.s_qq],
              isVerified: socialsLinksMap.qq?.isVerified,
            },
          },
          blockchainsWallets: {
            w_walletConnect: {
              link: w_walletConnect.link,
              isPublic: w_walletConnect.isPublic,
              icon: 'simple-icons:walletconnect',
              imgSrc: '/svg/wallets/Walletconnect.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_walletconnect,
              isVerified: socialsLinksMap.walletConnect?.isVerified,
            },
            w_near: {
              link: w_near.link,
              isPublic: w_near.isPublic,
              icon: 'simple-icons:near',
              imgSrc: '/svg/wallets/Near.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_near,
              isVerified: socialsLinksMap.near?.isVerified,
            },
            w_sui: {
              link: w_sui.link,
              isPublic: w_sui.isPublic,
              // icon: BLOCKCHAIN_ICONS.sui,
              icon: '',
              // imgSrc: '/svg/wallets/SUI.svg',
              imgSrc: '/svg/wallets/Cosmos.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_sui,
              isVerified: socialsLinksMap.sui?.isVerified,
            },
            w_aptos: {
              link: w_aptos.link,
              isPublic: w_aptos.isPublic,
              // icon: BLOCKCHAIN_ICONS.aptos,
              icon: '',
              imgSrc: '/svg/wallets/Aptos.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_aptos,
              isVerified: socialsLinksMap.aptos?.isVerified,
            },
            w_cosmos: {
              link: w_cosmos.link,
              isPublic: w_cosmos.isPublic,
              icon: '',
              imgSrc: '/svg/wallets/Cosmos.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_cosmos,
              isVerified: socialsLinksMap.cosmos?.isVerified,
            },
            w_cardano: {
              link: w_cardano.link,
              isPublic: w_cardano.isPublic,
              icon: 'formkit:cardano',
              imgSrc: '/svg/wallets/Cardano.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_cardano,
              isVerified: socialsLinksMap.cardano?.isVerified,
            },
            w_solana: {
              link: w_solana.link,
              isPublic: w_solana.isPublic,
              icon: 'formkit:solana',
              imgSrc: '/svg/wallets/Solana.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_solana,
              isVerified: socialsLinksMap.solana?.isVerified,
            },
            w_icp: {
              link: w_icp.link,
              isPublic: w_icp.isPublic,
              icon: 'cryptocurrency:icp',
              imgSrc: '/svg/wallets/ICP.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_icp,
              isVerified: socialsLinksMap.icp?.isVerified,
            },
            w_btc: {
              link: w_btc.link,
              isPublic: w_btc.isPublic,
              icon: 'cib:btc',
              imgSrc: '/svg/wallets/BTC.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_btc,
              isVerified: socialsLinksMap.btc?.isVerified,
            },
            w_doge: {
              link: w_doge.link,
              isPublic: w_doge.isPublic,
              icon: 'simple-icons:dogecoin',
              imgSrc: '/svg/wallets/Doge.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_doge,
              isVerified: socialsLinksMap.doge?.isVerified,
            },
            w_polkadot: {
              link: w_polkadot.link,
              isPublic: w_polkadot.isPublic,
              icon: 'simple-icons:polkadot',
              imgSrc: '/svg/wallets/Polkadot.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_polkadot,
              isVerified: socialsLinksMap.polkadot?.isVerified,
            },
            w_lukso: {
              link: w_lukso.link,
              isPublic: w_lukso.isPublic,
              icon: '',
              imgSrc: '/svg/wallets/Lukso.svg',
              baseUrl: BLOCKCHAIN_WALLET_BASE_URLS.w_lukso,
              isVerified: socialsLinksMap.lukso?.isVerified,
            },
          },
          messengers: {
            m_telegram: {
              link: m_telegram.link,
              isPublic: m_telegram.isPublic,
              icon: 'ic:baseline-telegram',
              imgSrc: '/svg/social/Telegram.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_telegram],
              isVerified: socialsLinksMap.telegram?.isVerified,
            },
            m_whatsapp: {
              link: m_whatsapp.link,
              isPublic: m_whatsapp.isPublic,
              icon: 'mdi:whatsapp',
              imgSrc: '/svg/social/Whatsapp.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_whatsapp],
              isVerified: socialsLinksMap.whatsapp?.isVerified,
            },
            m_signal: {
              link: m_signal.link,
              isPublic: m_signal.isPublic,
              icon: 'bi:signal',
              imgSrc: '/svg/social/Signal.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_signal],
              isVerified: socialsLinksMap.signal?.isVerified,
            },
            m_weChat: {
              link: m_weChat.link,
              isPublic: m_weChat.isPublic,
              icon: 'mdi:wechat',
              imgSrc: '/svg/social/Wechat.svg',
              baseUrl: MESSAGING_APP_BASE_URLS[MESSAGING_APPS.m_weChat],
              isVerified: socialsLinksMap.weChat?.isVerified,
            },
          },

          digitalIdentifiers: {
            d_ens: {
              link: d_ens.link,
              isPublic: d_ens.isPublic,
              icon: 'mdi:ens',
              imgSrc: '/svg/digitalIdentifiers/Ens.svg',
              baseUrl: DIGITAL_IDENTIFIER_BASE_URLS.d_ens,
              isVerified: socialsLinksMap.ens?.isVerified,
            },
            d_lens: {
              link: d_lens.link,
              isPublic: d_lens.isPublic,
              // imgSrc: '/svg/lens.svg',
              imgSrc: '/svg/digitalIdentifiers/Lens.svg',
              baseUrl: DIGITAL_IDENTIFIER_BASE_URLS.d_lens,
              isVerified: socialsLinksMap.lens?.isVerified,
            },
            d_worldId: {
              link: d_worldId.link,
              isPublic: d_worldId.isPublic,
              // imgSrc: '/svg/world-coin.svg',
              imgSrc: '/svg/digitalIdentifiers/World ID.svg',
              baseUrl: DIGITAL_IDENTIFIER_BASE_URLS.d_worldId,
              isVerified: socialsLinksMap.worldId?.isVerified,
            },
          },
        },
      }
    },
    onError: (error) => {
      console.log(
        '🚀MMM - ~ file: useBonuzContract.tsx:871 ~ useQueryGetUserProfileAndSocialLinks ~ error:',
        error
      )
    },
  })
}

// ----------------------------------------------------

interface setUserProfileMutationArgs {
  userData: UserProfileData
}
export const useMutationSetUserProfile = (
  handelOnSuccess: (data: any) => void,
  handleOnError: (data: any) => void
) => {
  const { web3auth, isConnected, smartAccount, bonuzSocialIdContract } =
    useBiconomyShallowStore()
  const queryClient = useQueryClient()

  const queryKey = ['getUserProfileAndSocialLinks']

  const mutationFn = async ({ userData }: setUserProfileMutationArgs) => {
    // const setUserProfileTx = new ethers.utils.Interface([
    //   `
    //   function setUserProfile(string memory _name, string memory _profileImage)
    //   `
    // ])

    // const data = setUserProfileTx.encodeFunctionData('setUserProfile',
    //   [
    //     userData.name,
    //     profileImage
    //   ]
    // )
    // const tx1 = {
    //   to: bonuzSocialIdContract?.address as string,
    //   data: data
    // }

    // const partialUserOp = await smartAccount.buildUserOp([tx1])

    // const biconomyPaymaster =
    //   smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>

    // const paymasterServiceData: SponsorUserOperationDto = {
    //   mode: PaymasterMode.SPONSORED
    //   // optional params...
    // }

    // const paymasterAndDataResponse =
    //   await biconomyPaymaster.getPaymasterAndData(
    //     partialUserOp,
    //     paymasterServiceData
    //   )
    // partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData

    // const userOpResponse = await smartAccount.sendUserOp(partialUserOp)
    // const transactionDetails = await userOpResponse.wait()

    // console.log('Transaction Details:', transactionDetails)
    // console.log('Transaction Hash:', userOpResponse.userOpHash)

    // -------------------------

    const name = userData?.name
    const profileImage = userData?.profileImage
    const handle = userData?.handle
    const privateKey = await web3auth?.provider!.request({
      method: 'eth_private_key',
    })

    const socialLinks: {
      platforms: string[]
      links: string[]
    } = {
      platforms: [],
      links: [],
    }

    if (userData?.links?.socialMedias) {
      const socialPlatforms = Object.keys(userData?.links?.socialMedias).map(
        (platform) => platform
      )
      const links = Object.values(userData?.links?.socialMedias).map(
        (platform) => {
          const { link, isPublic } = platform
          let newLink

          newLink = `p_${link}`

          if (isPublic) {
            newLink = `p_${link}`
          } else {
            const encrypted = CryptoES.AES.encrypt(
              link,
              privateKey as string
            ).toString()
            newLink = `e_${encrypted}`
          }
          return newLink
        }
      )
      socialLinks.platforms.push(...socialPlatforms)
      socialLinks.links.push(...links)
    }

    if (userData?.links?.blockchainsWallets) {
      const blockchainsWalletsPlatforms = Object.keys(
        userData?.links?.blockchainsWallets
      ).map((platform) => platform)
      const blockchainsWalletsLinks = Object.values(
        userData?.links?.blockchainsWallets
      ).map((platform) => {
        const { link, isPublic } = platform
        let newLink

        newLink = `p_${link}`

        if (isPublic) {
          newLink = `p_${link}`
        } else {
          const encrypted = CryptoES.AES.encrypt(
            link,
            privateKey as string
          ).toString()
          newLink = `e_${encrypted}`
        }
        return newLink
      })

      socialLinks.platforms.push(...blockchainsWalletsPlatforms)
      socialLinks.links.push(...blockchainsWalletsLinks)
    }

    if (userData?.links?.messengers) {
      const messagePlatforms = Object.keys(userData?.links?.messengers).map(
        (platform) => platform
      )
      const messageLinks = Object.values(userData?.links?.messengers).map(
        (platform) => {
          const { link, isPublic } = platform
          let newLink

          newLink = `p_${link}`

          if (isPublic) {
            newLink = `p_${link}`
          } else {
            const encrypted = CryptoES.AES.encrypt(
              link,
              privateKey as string
            ).toString()
            newLink = `e_${encrypted}`
          }
          return newLink
        }
      )

      socialLinks.platforms.push(...messagePlatforms)
      socialLinks.links.push(...messageLinks)
    }

    if (userData?.links?.digitalIdentifiers) {
      const digitalIdentifiersPlatforms = Object.keys(
        userData?.links?.digitalIdentifiers
      ).map((platform) => platform)
      const digitalIdentifiersLinks = Object.values(
        userData?.links?.digitalIdentifiers
      ).map((platform) => {
        const { link, isPublic } = platform
        let newLink

        newLink = `p_${link}`

        if (isPublic) {
          newLink = `p_${link}`
        } else {
          const encrypted = CryptoES.AES.encrypt(
            link,
            privateKey as string
          ).toString()
          newLink = `e_${encrypted}`
        }
        return newLink
      })

      socialLinks.platforms.push(...digitalIdentifiersPlatforms)
      socialLinks.links.push(...digitalIdentifiersLinks)
    }

    const reqData = {
      ...(name && {
        name,
      }),
      ...(profileImage && {
        profileImage,
      }),
      ...(handle && {
        handle,
      }),
      socialLinks,
    }
    // return updateUser(reqData)
    const res = await updateUser(reqData, bonuzSocialIdChainId)
    console.log(
      '🚀MMM - ~ file: useBonuzContract.tsx:1090 ~ mutationFn ~ res:',
      res
    )
    return res
  }

  return useMutation(mutationFn, {
    onSuccess(data) {
      console.log('data ', data)

      const handleTxHash = data?.handleTxHash
      const nameTxHash = data?.nameTxHash
      const socialLinksTxHash = data?.socialLinksTxHash

      const tx = handleTxHash || nameTxHash || socialLinksTxHash
      
      const url = `https://basescan.org/tx/${tx}`
      
      // Your Social ID has been updated! <BaseLink>
        toast.success(
          <div>
          Your Social ID has been updated! <a href={url} target='_blank'><a>View on Explorer</a></a>
        </div>
        , {
        position: "top-center"
      });

      queryClient.invalidateQueries({
        queryKey,
      })

      handelOnSuccess(data)
    },
    onError(error) {
      handleOnError(error)
    },
  })
}

// ----------------------------------------------------
interface setSocialLinkMutationArgs {
  platform: string
  baseUrl: string
  link: string
  isPublic: boolean
}

export const useMutationSetSocialLink = (
  handelOnSuccess: (data: any) => void,
  handleOnError: (data: any) => void
) => {
  const { web3auth, isConnected, smartAccount, bonuzSocialIdContract } =
    useBiconomyShallowStore()
  const queryClient = useQueryClient()

  const queryKey = ['getUserProfileAndSocialLinks']

  const mutationFn = async ({
    platform,
    baseUrl,
    link,
    isPublic,
  }: setSocialLinkMutationArgs) => {
    const privateKey = await web3auth?.provider!.request({
      method: 'eth_private_key',
    })
    let newLink

    newLink = `p_${link}`

    if (isPublic) {
      newLink = `p_${link}`
    } else {
      const encrypted = CryptoES.AES.encrypt(
        link,
        privateKey as string
      ).toString()
      newLink = `e_${encrypted}`
    }

    const data = {
      platform,
      link: newLink,
    }

    return updateUserLink(data)
  }

  return useMutation(mutationFn, {
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey,
      })

      // queryClient.setQueryData(queryKey, (old) => {
      //   console.log(old)

      //   return old
      // })

      handelOnSuccess(data)
    },
    onError(error) {
      handleOnError(error)
    },
  })
}
