import { SetStateAction, useState } from "react";
import SwitchButton from "./SwitchButton";
import Collapsible from "./Collapsible";
import { hasNonEmptyLink } from "@/utils";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import voucherImage from "../../public/images/Header.png";
import VoucherComponent from "./VoucherComponent";
import { voucherSliderData } from '../mockUpData/profileSliderData';
import ReactCarousel, { AFTER, CENTER, BEFORE } from "react-carousel-animated";
import "react-carousel-animated/dist/style.css";
import Carousel from "./Carousel";
interface ProfileDataComponentProps {
  data: any;
}



export default function ProfileDataComponent({
  data,
}: ProfileDataComponentProps) {
  const [selectedOption, setSelectedOption] =
    useState<string>("On-Chain Social ID");
  const socialMedias = hasNonEmptyLink(data?.links?.socialMedias);

  const messengers = hasNonEmptyLink(data?.links?.messengers);

  const blockchainsWallets = hasNonEmptyLink(data?.links?.blockchainsWallets);
  const digitalIdentifiers = hasNonEmptyLink(data?.links?.digitalIdentifiers);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    variableWidth: true,
    prevArrow: <></>,
    nextArrow: <></>,
    dots: true,
    afterChange: (index: number) => setCurrentIndex(index),
  };

  return (
    <>
      <SwitchButton
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        title={["On-Chain Social ID", "Items"]}
      />
      {selectedOption === "On-Chain Social ID" ? (
        <>
          {socialMedias && (
            <Collapsible
              title="Social Media Accounts"
              subTitle={
                data?.links?.socialMedias
                  ? Object.values(data.links.socialMedias).filter(
                    ({ link, isPublic }) => link && isPublic
                  ).length
                  : 0
              }
              icon="/svg/Social media accounts.svg"
            >
              <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
                {data?.links?.socialMedias &&
                  Object.entries(data.links.socialMedias).map(
                    ([key, value]) => {
                      const {
                        baseUrl,
                        link,
                        isPublic,
                        icon,
                        imgSrc,
                        isVerified,
                        isTwitterVerified,
                      } = value as {
                        baseUrl: string;
                        link: string;
                        isPublic: boolean;
                        icon: any;
                        imgSrc: any;
                        isVerified: boolean;
                        isTwitterVerified?: boolean;
                      };
                      if (!link || !isPublic) return null;

                      const isTwitter = key == "s_x";

                      return (
                        <div key={key}>
                          <a
                            href={`https://${baseUrl}${link}`}
                            className="cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10  rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {imgSrc && (
                              <img
                                className="h-6 w-6"
                                src={imgSrc}
                                alt="logo"
                              />
                            )}

                            <p className="max-w-[200px] break-words text-white font-normal sm:max-w-full md:max-w-full">
                              {`${baseUrl}${link}`}
                            </p>

                            {isVerified && !isTwitterVerified && (
                              <Icon
                                icon="lets-icons:check-fill"
                                className={cn(
                                  "h-6 w-6 text-white",
                                  "cursor-not-allowed",
                                  "ml-auto"
                                )}
                              />
                            )}
                            {isTwitter && isTwitterVerified && (
                              <Icon
                                icon="bitcoin-icons:verify-filled"
                                className={cn(
                                  "h-8 w-8 text-meta-5",
                                  "cursor-not-allowed",
                                  "ml-auto"
                                )}
                              />
                            )}
                          </a>
                        </div>
                      );
                    }
                  )}
              </div>
            </Collapsible>
          )}

          {messengers && (
            <Collapsible
              title="Messaging Apps"
              subTitle={
                data?.links?.messengers
                  ? Object.values(data.links.messengers).filter(
                    ({ link, isPublic }) => link && isPublic
                  ).length
                  : 0
              }
              icon="/svg/Messaging apps.svg"
            >
              <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
                {data?.links?.messengers &&
                  Object.entries(data.links.messengers).map(([key, value]) => {
                    const {
                      baseUrl,
                      link,
                      isPublic,
                      icon,
                      imgSrc,
                      isVerified,
                    } = value as {
                      baseUrl: string;
                      link: string;
                      isPublic: boolean;
                      icon: any;
                      imgSrc: any;
                      isVerified: boolean;
                    };
                    if (!link || !isPublic) return null;

                    return (
                      <div key={key}>
                        <a
                          href={`https://${baseUrl}${link}`}
                          className="cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {imgSrc && <img className="h-6 w-6" src={imgSrc} />}

                          <p className="max-w-[200px] break-words text-white font-normal sm:max-w-full md:max-w-full">
                            {`${baseUrl}${link}`}
                          </p>

                          {isVerified && (
                            <Icon
                              // icon="bitcoin-icons:verify-filled"
                              icon="lets-icons:check-fill"
                              className={cn(
                                // 'h-8 w-8 text-meta-5',
                                "h-6 w-6 text-white",
                                "cursor-not-allowed",
                                "ml-auto"
                              )}
                            />
                          )}
                        </a>
                      </div>
                    );
                  })}
              </div>
            </Collapsible>
          )}

          {blockchainsWallets && (
            <Collapsible
              title="Blockchain & Wallets"
              subTitle={
                data?.links?.blockchainsWallets
                  ? Object.values(data.links.blockchainsWallets).filter(
                    ({ link, isPublic }) => link && isPublic
                  ).length
                  : 0
              }
              icon="/svg/Blockchain & Wallets.svg"
            >
              <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
                {data?.links?.blockchainsWallets &&
                  Object.entries(data.links.blockchainsWallets).map(
                    ([key, value]) => {
                      const {
                        baseUrl,
                        link,
                        isPublic,
                        icon,
                        imgSrc,
                        isVerified,
                      } = value as {
                        baseUrl: string;
                        link: string;
                        isPublic: boolean;
                        icon: any;
                        imgSrc: any;
                        isVerified: boolean;
                      };
                      if (!link || !isPublic) return null;

                      return (
                        <div key={key}>
                          <a
                            href={`https://${baseUrl}${link}`}
                            className="cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {imgSrc && <img className="h-6 w-6" src={imgSrc} />}

                            <p className="max-w-[200px] break-words text-white font-normal">
                              {`${baseUrl}${link}`}
                            </p>

                            {isVerified && (
                              <Icon
                                // icon="bitcoin-icons:verify-filled"
                                icon="lets-icons:check-fill"
                                className={cn(
                                  // 'h-8 w-8 text-meta-5',
                                  "h-6 w-6 text-white",
                                  "cursor-not-allowed",
                                  "ml-auto"
                                )}
                              />
                            )}
                          </a>
                        </div>
                      );
                    }
                  )}
              </div>
            </Collapsible>
          )}

          {digitalIdentifiers && (
            <Collapsible
              title="Decentralized identifiers"
              subTitle={
                data?.links?.digitalIdentifiers
                  ? Object.values(data.links.digitalIdentifiers).filter(
                    ({ link, isPublic }) => link && isPublic
                  ).length
                  : 0
              }
              icon="/svg/Decentralized identifiers.svg"
            >
              <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
                {data?.links?.digitalIdentifiers &&
                  Object.entries(data.links.digitalIdentifiers).map(
                    ([key, value]) => {
                      const {
                        baseUrl,
                        link,
                        isPublic,
                        icon,
                        imgSrc,
                        isVerified,
                      } = value as {
                        baseUrl: string;
                        link: string;
                        isPublic: boolean;
                        icon: any;
                        imgSrc: any;
                        isVerified: boolean;
                      };
                      if (!link || !isPublic) return null;

                      return (
                        <div key={key}>
                          <a
                            href={`https://${baseUrl}${link}`}
                            className="cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {imgSrc && <img className="h-6 w-6" src={imgSrc} />}

                            <p className="max-w-[200px] break-words text-white font-normal">
                              {`${baseUrl}${link}`}
                            </p>

                            {isVerified && (
                              <Icon
                                // icon="bitcoin-icons:verify-filled"
                                icon="lets-icons:check-fill"
                                className={cn(
                                  // 'h-8 w-8 text-meta-5',
                                  "h-6 w-6 text-white",
                                  "cursor-not-allowed",
                                  "ml-auto"
                                )}
                              />
                            )}
                          </a>
                        </div>
                      );
                    }
                  )}
              </div>
            </Collapsible>
          )}
        </>
      ) : (
        <div className={cn("slider-container w-[800px]")}>
          <Carousel
            slides={voucherSliderData}
            animationDuration={1000}
            duration={5000}
            animationTimingFunction="linear"
            withNavigation
          />

          <div className={cn("flex w-full mt-10")}>
            <div className={cn("flex flex-row w-full h-full gap-4 bg-[#979797] rounded-2xl overflow-hidden items-center")}>
              <Image src={voucherImage} width={185} height={70} alt="voucher1" />
              <div className={cn("flex flex-col w-full h-full justify-center")}>
                <text>Voucher</text>
                <text>Free Drink</text>
              </div>
            </div>
          </div>
          <div className={cn("flex w-full mt-10")}>
            <div className={cn("flex flex-row w-full h-full gap-4 bg-[#979797] rounded-2xl overflow-hidden items-center")}>
              <Image src={voucherImage} width={185} height={70} alt="voucher1" />
              <div className={cn("flex flex-col w-full h-full justify-center")}>
                <text>Voucher</text>
                <text>Free Drink</text>
              </div>
            </div>
          </div>
        </div >
      )
      }
    </>
  );
}
