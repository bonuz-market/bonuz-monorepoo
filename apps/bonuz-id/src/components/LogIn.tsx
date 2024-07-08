import { useCallback, useEffect, useState } from "react";

import { WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Oval } from "react-loader-spinner";
import { useBiconomyShallowStore } from "@/hooks/useBiconomyShallowStore";
import Image from "next/image";
import logo from "../../public/icons/LoginLogo.svg";
import { Icon } from "@iconify/react";

const LogIn = () => {
  const [userEmail, setUserEmail] = useState("");
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
        throw new Error(
          "Missing NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID env variable."
        );
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

        chainNamespace: "eip155",
        chainId: "0x89", // hex of 137, polygon mainnet
        rpcTarget: "https://rpc.ankr.com/polygon",
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: "Polygon Mainnet",
        blockExplorer: "https://polygonscan.com",
        ticker: "MATIC",
        tickerName: "Matic",
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
        web3AuthNetwork: "sapphire_mainnet", // Web3Auth Network
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
          uxMode: "redirect", // "redirect" | "popup"
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
    provider: "google" | "apple" | "email_passwordless",
    userEmail?: string
  ) => {
    try {
      if (web3auth?.status !== "ready") {
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
          ...(provider === "email_passwordless" &&
            userEmail && {
              extraLoginOptions: {
                login_hint: userEmail, // email to send the OTP to
              },
            }),
        }
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
      console.error("Web3Modal not initialized.");

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
  return (
    <div className="flex flex-col w-full h-full rounded-3xl xl:rounded-xl p-4 xl:p-8 bg-[#202023] xl:justify-center items-center">
      <Image src={logo} width={100} height={100} alt="logo_login_svg" />
      <button
        onClick={() => login("apple")}
        type="button"
        className="w-full h-[50px] bg-white rounded-full mt-10 xl:mt-14 cursor-pointer text-center justify-center flex items-center gap-2"
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
            <Icon icon="logos:apple" width={26} height={26} />
            <p className="text-black text-bold text-[18px] leading-6 tracking-tighter">
              Continue with Apple
            </p>
          </>
        )}
      </button>
      <button
        onClick={() => login("google")}
        type="button"
        className="w-full h-[50px] bg-white rounded-full mt-4 cursor-pointer text-center justify-center flex items-center gap-2"
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
            <Icon icon="flat-color-icons:google" width={26} height={26} />
            <p className="text-black text-bold text-[18px] leading-6 tracking-tighter">
              Continue with Google
            </p>
          </>
        )}
      </button>
      <p className="my-6">or</p>
      <div className="w-full h-[50px] rounded-2xl bg-[#27272B] overflow-hidden px-4 flex flex-row items-center">
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setUserEmail(e.target.value)}
          value={userEmail}
          className="w-full h-full bg-transparent outline-none"
        ></input>
        <div className="rounded-full bg-[#4E4E56] p-1">
          <Icon icon="mdi:close" width={16} height={16} />
        </div>
      </div>
      <button
        onClick={() => login("email_passwordless", userEmail)}
        type="button"
        className="w-full h-[50px] bg-white rounded-full mt-4 cursor-pointer text-center justify-center flex items-center"
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
          <p className="text-black text-bold text-[18px] leading-6 tracking-tighter">
            Continue with Email
          </p>
        )}
      </button>
    </div>
  );
};
export default LogIn;
