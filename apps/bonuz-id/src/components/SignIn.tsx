import { useCallback, useEffect, useState } from 'react';

import { Icon } from '@iconify/react';
import { WALLET_ADAPTERS } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Oval } from 'react-loader-spinner';
import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore';
import { RPC_URL, bonuzTokensChainId } from '../../config';

const SignIn = () => {
  const [userEmail, setUserEmail] = useState('');

  const {
    // isInitialized,
    web3auth,
    smartAccount,
    setIsConnected,
    setWeb3auth,
    setSmartAccount,
    resetBiconomyStore,
  } = useBiconomyShallowStore();

  const [loading, setLoading] = useState({
    google: false,
    apple: false,
    email_passwordless: false,
  });
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
      };

      const web3Auth = new Web3AuthNoModal({
        clientId,
        web3AuthNetwork: 'sapphire_mainnet', // Web3Auth Network
        // @ts-ignore
        chainConfig,
      });

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig,
        },
      });
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
      });
      web3Auth.configureAdapter(openloginAdapter);

      await web3Auth.init();

      setWeb3auth(web3Auth);
    }
  }, [web3auth, setWeb3auth]);

  const login = async (
    provider: 'google' | 'apple' | 'email_passwordless',
    userEmail?: string,
  ) => {
    try {
      if (web3auth?.status !== 'ready') {
        return;
      }

      setLoading((prevState) => ({
        ...prevState,
        [provider]: true,
      }));

      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: provider,
          ...(provider === 'email_passwordless' &&
            userEmail && {
            extraLoginOptions: {
              login_hint: userEmail, // email to send the OTP to
            },
          }),
        },
      );

      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);

      setLoading((prevState) => ({
        ...prevState,
        [provider]: false,
      }));
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.error('Web3Modal not initialized.');

      return;
    }

    await web3auth.logout();
    setSmartAccount(null);

    resetBiconomyStore();
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    init();
  }, [init]);

  // if (!isInitialized && !smartAccount?.owner) {
  //   return null
  // }

  return (
    <>
      <div className="">

        <div className="flex flex-wrap items-center">
          <div className="w-full">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Bonuz
              </h2>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={(e) => setUserEmail(e.target.value)}
                    value={userEmail}
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <button
                  className="flex w-full items-center justify-center gap-3.5 cursor-pointer rounded-lg border border-primary bg-meta-5 p-4 text-white transition hover:bg-opacity-90"
                  onClick={() => login('email_passwordless', userEmail)}
                  type="button"
                >
                  {loading.email_passwordless ? (
                    <Oval
                      height={25}
                      width={25}
                      color="white"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible
                      ariaLabel="oval-loading"
                      secondaryColor="blue"
                      strokeWidth={4}
                      strokeWidthSecondary={4}
                    />
                  ) : (
                    <>Sign In</>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center my-4">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>

              <div className="flex flex-col gap-4">
                <button
                  className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
                  onClick={() => login('google')}
                  type="button"
                >
                  {loading.google ? (
                    <Oval
                      height={25}
                      width={25}
                      color="blue"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible
                      ariaLabel="oval-loading"
                      secondaryColor="blue"
                      strokeWidth={4}
                      strokeWidthSecondary={4}
                    />
                  ) : (
                    <>
                      <Icon
                        icon="flat-color-icons:google"
                        width={20}
                        height={20}
                      />
                      Sign in with Google
                    </>
                  )}
                </button>

                <button
                  className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
                  onClick={() => login('apple')}
                  type="button"
                >
                  {loading.apple ? (
                    <Oval
                      height={25}
                      width={25}
                      color="blue"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible
                      ariaLabel="oval-loading"
                      secondaryColor="blue"
                      strokeWidth={4}
                      strokeWidthSecondary={4}
                    />
                  ) : (
                    <>
                      <Icon icon="ion:logo-apple" width={20} height={20} />
                      Sign in with Apple
                    </>
                  )}
                </button>

                {/* <Link className="mb-5.5 inline-block" to="/profile">
                Profile
              </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
