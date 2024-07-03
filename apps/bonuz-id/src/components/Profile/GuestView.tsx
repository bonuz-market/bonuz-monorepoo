import { useState } from "react";
import Image from "next/image";
import TextView from "./TextView";

const profileData = [
  {
    label: "Social Media Accounts",
    url: "/icons/social-icon.svg",
  },
  {
    label: "Messaging Apps",
    url: "/icons/message-icon.svg",
  },
  {
    label: "External Wallets & Accounts",
    url: "/icons/blockchain-icon.svg",
  },
  {
    label: "Decentralized Identifiers",
    url: "/icons/decentral-icon.svg",
  },
];

const GuestView = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const frames = [
    "/images/carousel/Frame_1.png",
    "/images/carousel/Frame_2.png",
    "/images/carousel/Frame_3.png",
    "/images/carousel/Frame_4.png",
  ];

  function shortenEthereumAddress(address: any) {
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
    <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between max-w-[700px] p-[10px] gap-0 rounded-[30px] bg-gradient-to-r from-[#0e2875] to-[#4b2ea2] via-[#4b2ea2] flex-col md:flex-row md:p-[16px]">
            <div>
              <div className="gap-[16px] w-full md:w-[213px]">
                <div className="flex w-full justify-center mb-[30px]">
                  <Image
                    src={"/icons/wallet-avatar-icon.svg"}
                    alt="walletAvatar"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="h-[82px] px-[16px] gap-[12px] w-full md:w-[213px] text-sm">
                  <p className="text-center">Santiago Bob</p>
                  <p className="text-center">@bob</p>
                  <div className="flex h-[40px] p-[8px_10px] gap-[12px] rounded-[12px] w-full justify-center md:w-[200px]">
                    <Image
                      src={"/icons/wallet-icon.svg"}
                      alt="walletIcon"
                      width={24}
                      height={24}
                    />
                    <p>
                      {shortenEthereumAddress(
                        "0x235e3Bc8aA372bee06A3f2E264895022fCE7c2e7"
                      )}
                    </p>
                    <Image
                      src={"/icons/copy-icon.svg"}
                      alt="copyIcon"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              {profileData.map((data, index) => (
                <div
                  key={index}
                  className="flex h-[44px] p-[12px] gap-[30px] rounded-[24px] items-center justify-between w-full md:w-[361px]"
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={data.url}
                      width={40}
                      height={40}
                      alt="socialIcon"
                    />
                    <p>{data.label}</p>
                  </div>
                  <Image
                    src={"/icons/dropdown-icon.svg"}
                    width={28}
                    height={28}
                    alt="dropdownIcon"
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="max-w-[510px] mt-[2rem]">
              <p className="font-space-grotesk font-medium tracking-[-0.08em] text-left text-white text-[20px] md:text-[36px]">
                Exclusive Social ID Usernames
              </p>
              <p className="font-inter font-normal leading-[24px] tracking-[-0.4px] text-left text-white opacity-60 text-[10px] md:text-[12px]">
                Get Your exclusive 2-char, 3-char or 4-char letter Bonuz
                username and secure your spot for the next round of quests
                coming soon! We will mint username similar to Lens powered by
                the Bonuz ecosystem!
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            id="controls-carousel"
            className="relative w-[350px] h-[200px] flex justify-center"
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
            <TextView currentIndex={currentIndex} />
          </div>
          <div className="mt-[25px] flex gap-[24px] flex-col justify-center md:flex-row w-full">
            <button
              className="flex items-center justify-center gap-[4px] isolate h-[36px] bg-white rounded-[16px] w-full md:w-[172.63px] lg:w-[150px]"
              onClick={() => {
                window.open("https://bonuz.xyz/", "_blank");
              }}
            >
              <Image
                src={"/icons/apple.png"}
                alt="GoogleIcon"
                width={22}
                height={26}
              />
              <div>
                <p className="text-start text-black text-[10px] font-normal">
                  Download on the
                </p>
                <p className="text-start text-black text-[12px] font-semibold">
                  App Store
                </p>
              </div>
            </button>

            <button
              className="flex items-center justify-center gap-[4px] isolate h-[36px] bg-white rounded-[16px] w-full md:w-[172.63px] lg:w-[150px]"
              onClick={() => {
                window.open("https://bonuz.xyz/", "_blank");
              }}
            >
              <Image
                src={"/icons/apple.png"}
                alt="GoogleIcon"
                width={22}
                height={26}
              />
              <div>
                <p className="text-start text-black text-[10px] font-normal">
                  GET IT ON{" "}
                </p>
                <p className="text-start text-black text-[12px] font-semibold">
                  Google Play
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestView;
