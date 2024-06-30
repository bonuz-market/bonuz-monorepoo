import { useCallback, useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import { WALLET_ADAPTERS } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { ethers } from 'ethers'

import { useBiconomyShallowStore } from '../../hooks/useBiconomyShallowStore'
import Button from '../Button'
import { RPC_URL, bonuzTokensChainId } from '../../../config'

export const BiconomyButton = () => {
  const {
    web3auth,
    smartAccount,
    setIsConnected,
    setWeb3auth,
    setSmartAccount,
    resetBiconomyStore,
  } = useBiconomyShallowStore()

  const [loading, setLoading] = useState({
    google: false,
    apple: false,
  })

  const init = useCallback(async () => {
    if (!web3auth) {
      const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID;

      if (!clientId) {
        throw new Error('Missing NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID env variable.');
      }

      const chainConfig = {
        // MAINNET
        // chainNamespace: 'eip155',
        // chainId: bonuzTokensChainId,
        // rpcTarget: RPC_URL[bonuzTokensChainId],
        // // Avoid using public rpcTarget in production.
        // // Use services like Infura, Quicknode etc
        // displayName: 'Bse Mainnet',
        // blockExplorer: 'https://basescan.org/',
        // ticker: 'ETH',
        // tickerName: 'ETH',

        chainNamespace: 'eip155',
        chainId: '0x89', // hex of 137, polygon mainnet
        rpcTarget: 'https://rpc.ankr.com/polygon',
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: 'Polygon Mainnet',
        blockExplorer: 'https://polygonscan.com',
        ticker: 'MATIC',
        tickerName: 'Matic',

        // TESTNET
        // chainNamespace: 'eip155',
        // chainId: '0x13881', // hex of 80001, polygon testnet
        // rpcTarget: 'https://rpc.ankr.com/polygon_mumbai',
        // // Avoid using public rpcTarget in production.
        // // Use services like Infura, Quicknode etc
        // displayName: 'Polygon Mumbai Testnet',
        // blockExplorer: 'https://mumbai.polygonscan.com/',
        // ticker: 'MATIC',
        // tickerName: 'Matic',
      }

      const web3Auth = new Web3AuthNoModal({
        clientId,
        web3AuthNetwork: 'sapphire_mainnet', // Web3Auth Network
        // @ts-ignore
        chainConfig,
      })

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig,
        },
      })
      const openloginAdapter = new OpenloginAdapter({
        privateKeyProvider,
        adapterSettings: {
          uxMode: 'redirect', // "redirect" | "popup"
          // whiteLabel: {
          //   name: "Your app Name",
          //   logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          //   logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
          //   defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          //   dark: false, // whether to enable dark mode. defaultValue: false
          // },
        },
      })
      web3Auth.configureAdapter(openloginAdapter)

      await web3Auth.init()

      setWeb3auth(web3Auth)
    }
  }, [web3auth, setWeb3auth])

  const login = async (provider: 'google' | 'apple') => {
    try {
      if (web3auth?.status !== 'ready') {
        return
      }

      setLoading((prevState) => ({
        ...prevState,
        [provider]: true,
      }))

      await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: provider,
      })

      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)

      setLoading((prevState) => ({
        ...prevState,
        [provider]: false,
      }))
    }
  }

  const logout = async () => {
    if (!web3auth) {
      console.error('Web3Modal not initialized.')

      return
    }

    await web3auth.logout()
    setSmartAccount(null)

    resetBiconomyStore()
    localStorage.clear()
    window.location.reload()
  }

  useEffect(() => {
    init()
  }, [init])

  // if (!isInitialized && !smartAccount?.owner) {
  //   return null
  // }

  return null
  // return smartAccount?.owner ? (
  //   <Button
  //     variant={smartAccount?.owner ? 'outlined' : 'contained'}
  //     transition
  //     className={
  //       smartAccount?.owner
  //         ? 'h-[50px] w-[150px]'
  //         : 'order-[-1] h-[57px] w-[321px] sm:order-none'
  //     }
  //     onClick={logout}
  //   >
  //     Logout
  //   </Button>
  // ) : (
  //   <div className="flex w-full flex-col gap-4">
  //     <Button
  //       className="flex w-full flex-auto cursor-pointer flex-row  justify-center gap-2 rounded-[10px] border-none bg-primary-main px-4 py-5 text-center  text-base font-bold transition-colors duration-500 ease-in-out hover:bg-gradient-1 disabled:cursor-not-allowed disabled:opacity-50"
  //       onClick={() => login('google')}
  //       isLoading={loading.google}
  //     >
  //       <Icon icon="ion:logo-google" width={20} height={20} />

  //       <p>Login with Google</p>
  //     </Button>

  //     <Button
  //       className="flex w-full flex-auto cursor-pointer flex-row  justify-center gap-2 rounded-[10px] border-none bg-primary-main px-4 py-5 text-center  text-base font-bold transition-colors duration-500 ease-in-out hover:bg-gradient-1 disabled:cursor-not-allowed disabled:opacity-50"
  //       onClick={() => login('apple')}
  //       isLoading={loading.apple}
  //     >
  //       <Icon icon="ion:logo-apple" width={20} height={20} />

  //       <p>Login with Apple</p>
  //     </Button>
  //   </div>
  // );
}

export default BiconomyButton
