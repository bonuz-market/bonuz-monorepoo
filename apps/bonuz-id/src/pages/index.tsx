import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import walletIcon from "../../public/icons/wallet-icon.svg";
import copyIcon from "../../public/icons/copy-icon.svg";
import walletAvatar from "../../public/icons/wallet-avatar-icon.svg";

import socialIcon from "../../public/icons/social-icon.svg";
import messageIcon from "../../public/icons/message-icon.svg";
import blockchainIcon from "../../public/icons/blockchain-icon.svg";
import decentralIcon from "../../public/icons/decentral-icon.svg";
import dropdownIcon from "../../public/icons/dropdown-icon.svg";

import Frame1 from "../../public/images/carousel/Frame_1.png";
import Frame2 from "../../public/images/carousel/Frame_2.png";
import Frame3 from "../../public/images/carousel/Frame_3.png";
import Frame4 from "../../public/images/carousel/Frame_4.png";

import GoogleIcon from "../../public/icons/apple.png";

export default function Home() {
  const { address } = useAccount();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
    useState(false);
  const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

  const frames = [Frame1, Frame2, Frame3, Frame4];

  const closeAll = () => {
    setIsNetworkSwitchHighlighted(false);
    setIsConnectHighlighted(false);
  };

  function shortenEthereumAddress() {
    if (address) {
      const firstPart = address.slice(0, 6);
      const lastPart = address.slice(-6);
      return `${firstPart}...${lastPart}`;
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? frames.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === frames.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <>
      <Head>
        <title>WalletConnect | Next Starter Template</title>
        <meta name="description" content="Generated by create-wc-dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="flex flex-row gap-2 w-full px-12 z-50 mb-2">
          <button className={styles.topbutton1}>bonuz.market #Ecosystem</button>
          <button className={styles.topbutton2}>Whitepaper #Degen</button>
          <button className={styles.topbutton3}>Documentation #Devs</button>
          <button className={styles.topbutton4}>Bonuz Wallet</button>
        </div>
        <div className={styles.wrapper}>
          <div
            className={`${styles.mainContainer} lg:flex-row md:flex-col flex-col`}
          >
            <div className={styles.leftContainer}>
              <div
                className={`${styles.walletContent} flex-col md:flex-col lg:flex-row`}
              >
                <div>
                  <div className={styles.walletHeader}>
                    <div className={styles.walletIcon}>
                      <Image
                        src={walletAvatar}
                        alt="walletAvatar"
                        width={140}
                        height={140}
                      />
                    </div>
                    <div className={styles.walletDescription}>
                      <p className="text-center">Santiago Bob</p>
                      <p className="text-center">@bob</p>
                      <div className={styles.walletAddressContent}>
                        <Image
                          src={walletIcon}
                          alt="walletIcon"
                          width={24}
                          height={24}
                        />
                        <p>{shortenEthereumAddress()}</p>
                        <Image
                          src={copyIcon}
                          alt="copyIcon"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.walletItems}>
                  <div className={styles.walletItem}>
                    <div className="flex gap-2 items-center">
                      <Image
                        src={socialIcon}
                        width={40}
                        height={40}
                        alt="socialIcon"
                      />
                      <p>Social Media Accounts</p>
                    </div>
                    <Image
                      src={dropdownIcon}
                      width={28}
                      height={28}
                      alt="dropdownIcon"
                    />
                  </div>
                  <div className={styles.walletItem}>
                    <div className="flex gap-2 items-center">
                      <Image
                        src={messageIcon}
                        width={40}
                        height={40}
                        alt="messageIcon"
                      />
                      <p>Messaging Apps</p>
                    </div>
                    <Image
                      src={dropdownIcon}
                      width={28}
                      height={28}
                      alt="dropdownIcon"
                    />
                  </div>
                  <div className={styles.walletItem}>
                    <div className="flex gap-2 items-center">
                      <Image
                        src={blockchainIcon}
                        width={40}
                        height={40}
                        alt="blockchainIcon"
                      />
                      <p>Blockchain & Wallets</p>
                    </div>
                    <Image
                      src={dropdownIcon}
                      width={28}
                      height={28}
                      alt="dropdownIcon"
                    />
                  </div>
                  <div className={styles.walletItem}>
                    <div className="flex gap-2 items-center">
                      <Image
                        src={decentralIcon}
                        width={40}
                        height={40}
                        alt="decentralIcon"
                      />
                      <p>Decentralized Identifiers</p>
                    </div>
                    <Image
                      src={dropdownIcon}
                      width={28}
                      height={28}
                      alt="dropdownIcon"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.descriptionContent}>
                  <p className={styles.descriptionTitle}>
                    Exclusive BRC-721 Social ID Airdrop
                  </p>
                  <p className={styles.descriptions}>
                    Get Your exclusive 2-char, 3-char or 4-char letter Bonuz
                    username and secure your spot for the next round of quests
                    coming soon! We will mint BTC username similar to lens
                    powered by the bonuz ecosystem!
                  </p>
                </div>
                <button className={styles.mintButton}>
                  Mint for 0.00011 $BTC
                </button>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div
                id="controls-carousel"
                className="relative w-full w-[550px] h-[330px] flex justify-center"
                data-carousel="static"
              >
                <button
                  type="button"
                  className="top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                  data-carousel-prev
                  onClick={handlePrev}
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full">
                    <svg
                      className="w-4 h-4 text-white  rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                    <span className="sr-only">Previous</span>
                  </span>
                </button>
                <div className="relative overflow-hidden rounded-lg h-[100%] w-[100%] flex items-center justify-center">
                  {frames.map((frame, index) => (
                    <div
                      key={index}
                      className={`duration-700 ease-in-out ${
                        index === currentIndex ? "block" : "hidden"
                      }`}
                      data-carousel-item={
                        index === currentIndex ? "active" : undefined
                      }
                    >
                      <Image
                        src={frame}
                        alt={`Frame ${index + 1}`}
                        width={330}
                        height={330}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                  data-carousel-next
                  onClick={handleNext}
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full">
                    <svg
                      className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <span className="sr-only">Next</span>
                  </span>
                </button>
              </div>
              <div>
                <h2 className={styles.ttls}>
                  Connect to Apps & Dapps using your Wallet
                </h2>
                <p className={styles.desc}>
                  Seamlessly access and use your favorite Web3 applications
                  directly from your wallet interface
                </p>
              </div>
              <div className={styles.btn_forms}>
                <button className={styles.btn_download}>
                  <Image
                    src={GoogleIcon}
                    alt="GoogleIcon"
                    width={32}
                    height={36}
                  />
                  <div>
                    <p className={styles.btn_download_text}>Download on the</p>
                    <p className={styles.btn_download_ttl}>App Store</p>
                  </div>
                </button>

                <button className={styles.btn_download}>
                  <Image
                    src={GoogleIcon}
                    alt="GoogleIcon"
                    width={32}
                    height={36}
                  />
                  <div>
                    <p className={styles.btn_download_text}>GET IT ON </p>
                    <p className={styles.btn_download_ttl}>Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <hr className={styles.containerDivider} />
          <div className={styles.containerFooter}>
            <p className={styles.containerFooterText}>bonuz</p>
            <button className={styles.containerBtnMove}>
              <svg
                className="w-3 h-3 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 8"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                />
              </svg>
            </button>
            <button className={styles.containerBtnConnect}>
              Connect Bonuz On-Chain Social ID
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
