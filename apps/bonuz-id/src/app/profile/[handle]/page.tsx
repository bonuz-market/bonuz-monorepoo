
'use client';
import { Icon } from '@iconify/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import * as React from 'react';
import '@/lib/env';

import { cn } from '@/lib/utils';
import { useQueryGetPublicUserProfileAndSocialLinks } from '@/hooks/useBonuzContract';

import Collapsible from '@/components/Collapsible';

import { hasNonEmptyLink } from '@/utils';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
  return (
    <>
      <div
        className={cn(
          'flex flex-row justify-between items-center gap-2 px-16 h-[86px]',
          'navbar'
          // ' backdrop-blur-sm bg-white/30',
          // 'bg-fill-bonuz-theme-300 bg-blend-overlay rounded-custom backdrop-blur-lg'
        )}
      >
        <div className='flex gap-0.5 justify-between items-start self-stretch my-auto'>
          <img src='/svg/Logo.svg' alt='logo' />
        </div>
        <div className='flex justify-center items-center backdrop-blur-sm bg-white/30 rounded-full p-1'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/61405f0e1398ee7af0f800513fcbc9347b933dbf6cb2f9a4c17bb428dd04468d?'
            className='aspect-[0.87] w-[26px]'
          />
        </div>

        <div className='justify-center self-stretch px-2.5 py-1 my-auto text-base font-semibold tracking-tight leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px]'>
          Connect Bonuz On-Chain Social ID{' '}
        </div>
      </div>
    </>
  );
};

function Profile() {
  const { handle } = useParams();
  // const handle = 'mende';


  const { data, isLoading } = useQueryGetPublicUserProfileAndSocialLinks(
    handle as string ?? ''
  );

  const socialMedias = hasNonEmptyLink(data?.links?.socialMedias);

  const messengers = hasNonEmptyLink(data?.links?.messengers);

  const blockchainsWallets = hasNonEmptyLink(data?.links?.blockchainsWallets);
  const digitalIdentifiers = hasNonEmptyLink(data?.links?.digitalIdentifiers);

  const isTwitterConnected = data?.links?.socialMedias?.s_x?.isVerified;
  const isTwitterVerified = data?.links?.socialMedias?.s_x?.isTwitterVerified;

  return (
    <div
      className={cn(
        "min-h-screen bg-[url('/svg/bg.svg')] bg-cover bg-fixed bg-no-repeat pb-10",
        // isConnected
        //   ? "md:bg-[url('/img/dashboard-bg-logged-in.png')]"
        //   : "md:bg-[url('/img/dashboard-bg-1.png')]"
      )}
    >
      <div className="md:container md:mx-auto px-16">
        <Header />

        {/* <div className='mt-11 flex border-2 border-sky-500 rounded-[30px] max-md:flex-wrap px-3'>
          <img loading='lazy' src='/svg/Icon Outline.svg' alt='icon-outline' />
          <input
            placeholder='Enter text here'
            className='bg-transparent border border-transparent  rounded-lg focus:bg-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full'
          />
        </div> */}

        <div className='mt-4 w-full h-[48px] flex justify-between items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 border-[#9651FF]'>
          <Image src={'/icons/search.svg'} width={24} height={24} alt='search' />
          <input
            name='search'
            className='w-full outline-none bg-transparent font-inter text-base font-normal leading-6 tracking-tight text-left border-none'
            placeholder='Search'
            value={handle}
          // onChange={(e) => setSearchQuery(e.target.value)}
          // onChange={handleChange}
          // onKeyDown={handleKeyDown}
          />
          <Image
            src={'/icons/arrow-cancle.png'}
            width={30}
            height={30}
            alt='cancle'
            className='cursor-pointer'
          />
        </div>

        <div className='grid grid-col xl:grid-cols-[1fr_2fr] mt-10 p-10 gap-4 relative'>
          <div className='flex flex-col items-center justify-start'>
            <div className='flex flex-col items-center px-5 tracking-tight  w-full'>
              <img
                loading='lazy'
                srcSet={data?.profileImage}
                className='max-w-full aspect-square w-[140px] rounded-full'
              />
              <div className='mt-5 text-3xl font-bold text-center text-white'>
                {data?.name}
              </div>
              <div className='mt-4 text-sm leading-5 text-center text-white'>
                @{data?.handle || handle}
              </div>
              <button className='flex justify-center items-center self-stretch px-8 py-2.5 mt-7 w-full text-base font-semibold leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px]'>
                + Add Connection
              </button>
            </div>

            {/* --------------------- */}
            <div className='mt-10'>
              <img src='/images/qr-code.png' alt='ar code' className='' />
            </div>

            <Collapsible
              title='Verified identifiers'
              subTitle=''
              icon='/svg/Verified identifiers.svg'
            >
              <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'></div>
            </Collapsible>
          </div>
          <div className='grid-item-2 flex flex-col gap-5'>
            <div
              className={cn(
                "bg-[url('/images/items.png')] bg-cover bg-no-repeat",
                'flex min-h-[462px] p-4 flex-col justify-start items-center gap-2 flex-shrink-0'
              )}
            >
              <div className="flex gap-4 justify-between py-1 w-full tracking-tight text-white whitespace-nowrap max-w-[962px] max-md:flex-wrap max-md:max-w-full">
                <div className="flex gap-2 px-5">
                  <div className="text-xl font-semibold leading-6">Items</div>
                  <div className="justify-center px-1 py-0.5 my-auto text-sm leading-4 text-center">
                    24
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b9e249d6d76ebe16937d7290df19ba328c5915c22735455456b89ac74c6f9151?"
                  className="shrink-0 w-6 aspect-square"
                />
              </div>

              {/* <div className='flex flex-col md:flex-row flex-wrap gap-2'> */}
              <div className='grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-2'>
                <div
                  className={cn(
                    'rounded-[20px] bg-gradient-to-r from-[#009EFD] to-[#2AF598] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] ',
                    'flex w-[200px] h-[150px] p-3 flex-col items-start gap-3 flex-shrink-0'
                  )}
                >
                  <div className='flex flex-col justify-center items-start py-2 bg-blend-overlay bg-neutral-400 rounded-[70px]'>
                    <img
                      src='/svg/card-1-img.svg'
                      alt='card-1-img'
                      className='w-[32px]'
                    />
                  </div>
                  <div className='mt-5 text-base font-semibold tracking-tight leading-6 text-white'>
                    Lens Profiles
                  </div>
                  <div className='text-sm tracking-tight leading-4 text-white'>
                    3 items
                  </div>
                </div>
                <div
                  className={cn(
                    'rounded-[20px] bg-gradient-to-r from-[#FB308D] to-[#C03DD2] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px]',
                    'flex w-[216px] h-[162px] p-3 flex-col items-start gap-3 flex-shrink-0 '
                  )}
                >
                  <div className='flex flex-col justify-center items-start p-2 bg-zinc-800 bg-opacity-90 rounded-[70px]'>
                    <img
                      src='/svg/card-2-img.svg'
                      alt='card-2-img'
                      className='w-[32px]'
                    />
                  </div>
                  <div className='mt-5 text-base font-semibold tracking-tight leading-6 text-white'>
                    Social IDs
                  </div>
                  <div className='text-sm tracking-tight leading-4 text-white'>
                    14 items
                  </div>
                </div>
                <div
                  className={cn(
                    'rounded-[20px] bg-gradient-to-r from-[#F67640] to-[#F14375]',
                    'flex w-[261px] h-[138px] p-3 justify-between items-start flex-shrink-0'
                  )}
                >
                  <div className='flex flex-col flex-1'>
                    <img
                      src='/svg/card-3-img.svg'
                      alt='card-3-img'
                      className='w-[32px]'
                    />
                    <div className='mt-2 text-base font-semibold tracking-tight leading-6 text-white'>
                      dVouchers{' '}
                    </div>
                    <div className='mt-1.5 text-sm tracking-tight leading-4 text-white'>
                      2 items
                    </div>
                  </div>
                  <div className='flex flex-wrap flex-1 gap-1.5'>
                    <div className='flex flex-col flex-1 items-center'>
                      <img src='/images/1.png' alt='image 1' />
                      <img src='/images/2.png' alt='image 1' />
                    </div>
                    <div className='flex flex-col flex-1 items-center'>
                      <img src='/images/3.png' alt='image 1' />
                      <img src='/images/4.png' alt='image 1' />
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    'rounded-[20px] bg-gradient-to-r from-[#3D73EB] to-[#DE8FFF] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px]',
                    'flex w-[280px] h-[150px] p-3 items-start gap-3 flex-shrink-0 '
                  )}
                >
                  <div className='flex flex-col flex-1 py-px'>
                    <img
                      src='/svg/card-4-img.svg'
                      alt='card-4-img'
                      className='w-[32px]'
                    />
                    <div className='mt-2 text-base font-semibold tracking-tight leading-6 text-white'>
                      Bonuz POPs
                    </div>
                    <div className='mt-1.5 text-sm tracking-tight leading-4 text-white'>
                      9 items
                    </div>
                  </div>
                  <div className='flex flex-wrap flex-1 gap-1.5'>
                    <div className='flex flex-col flex-1 items-center'>
                      <img src='/images/8.png' alt='image 1' />
                      <img src='/images/5.png' alt='image 1' />
                    </div>
                    <div className='flex flex-col flex-1 items-center text-xl font-semibold tracking-tighter leading-6 text-center text-white whitespace-nowrap'>
                      <img src='/images/7.png' alt='image 1' />
                      <img src='/images/6.png' alt='image 1' />
                      <div className='justify-center self-stretch px-4 py-1.5 mt-1.5 rounded-xl backdrop-blur-sm bg-white/30 '>
                        5+
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center p-1 mt-2 text-base tracking-tight leading-6 rounded-[50px] max-md:pl-5">
                <div className="my-auto text-white">Map View</div>
                <div className="flex-1 justify-center px-3 py-2 font-semibold whitespace-nowrap bg-white shadow-md backdrop-blur-[20px] rounded-[50px] text-neutral-900 max-md:px-5">
                  In-Person
                </div>
              </div>
              <div className="flex justify-center items-center px-16 pt-2 mt-2 w-full backdrop-blur-[20px] max-w-[962px] rounded-[50px] max-md:px-5 max-md:max-w-full">
                <div className="flex gap-2">
                  <div className="shrink-0 w-full h-2 bg-white rounded-[30px]" />
                  <div className="shrink-0 w-2 h-2 bg-white rounded-[50px]" />
                </div>
              </div>
            </div>

            {/* socials */}

            <div className='flex flex-col gap-4'>
              {socialMedias && (
                <Collapsible
                  title='Social Media Accounts'
                  subTitle={
                    data?.links?.socialMedias
                      ? Object.values(data.links.socialMedias).filter(
                        ({ link, isPublic }) => link && isPublic
                      ).length
                      : 0
                  }
                  icon='/svg/Social media accounts.svg'
                >
                  <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
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

                          const isTwitter = key == 's_x';

                          return (
                            <div key={key}>
                              <a
                                href={`https://${baseUrl}${link}`}
                                className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10  rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30'
                                target='_blank'
                                rel='noreferrer'
                              >
                                {imgSrc && (
                                  <img
                                    className='h-6 w-6'
                                    src={imgSrc}
                                    alt='logo'
                                  />
                                )}

                                <p className='max-w-[200px] break-words text-white font-normal sm:max-w-full md:max-w-full'>
                                  {`${baseUrl}${link}`}
                                </p>

                                {isVerified && !isTwitterVerified && (
                                  <Icon
                                    icon='lets-icons:check-fill'
                                    className={cn(
                                      'h-6 w-6 text-white',
                                      'cursor-not-allowed',
                                      'ml-auto'
                                    )}
                                  />
                                )}
                                {isTwitter && isTwitterVerified && (
                                  <Icon
                                    icon='bitcoin-icons:verify-filled'
                                    className={cn(
                                      'h-8 w-8 text-meta-5',
                                      'cursor-not-allowed',
                                      'ml-auto'
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
                  title='Messaging Apps'
                  subTitle={
                    data?.links?.messengers
                      ? Object.values(data.links.messengers).filter(
                        ({ link, isPublic }) => link && isPublic
                      ).length
                      : 0
                  }
                  icon='/svg/Messaging apps.svg'
                >
                  <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
                    {data?.links?.messengers &&
                      Object.entries(data.links.messengers).map(
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
                                className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                                target='_blank'
                                rel='noreferrer'
                              >
                                {imgSrc && (
                                  <img className='h-6 w-6' src={imgSrc} />
                                )}

                                <p className='max-w-[200px] break-words text-white font-normal sm:max-w-full md:max-w-full'>
                                  {`${baseUrl}${link}`}
                                </p>

                                {isVerified && (
                                  <Icon
                                    // icon="bitcoin-icons:verify-filled"
                                    icon='lets-icons:check-fill'
                                    className={cn(
                                      // 'h-8 w-8 text-meta-5',
                                      'h-6 w-6 text-white',
                                      'cursor-not-allowed',
                                      'ml-auto'
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

              {blockchainsWallets && (
                <Collapsible
                  title='Blockchain & Wallets'
                  subTitle={
                    data?.links?.blockchainsWallets
                      ? Object.values(data.links.blockchainsWallets).filter(
                        ({ link, isPublic }) => link && isPublic
                      ).length
                      : 0
                  }
                  icon='/svg/Blockchain & Wallets.svg'
                >
                  <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
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
                                className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                                target='_blank'
                                rel='noreferrer'
                              >
                                {imgSrc && (
                                  <img className='h-6 w-6' src={imgSrc} />
                                )}

                                <p className='max-w-[200px] break-words text-white font-normal'>
                                  {`${baseUrl}${link}`}
                                </p>

                                {isVerified && (
                                  <Icon
                                    // icon="bitcoin-icons:verify-filled"
                                    icon='lets-icons:check-fill'
                                    className={cn(
                                      // 'h-8 w-8 text-meta-5',
                                      'h-6 w-6 text-white',
                                      'cursor-not-allowed',
                                      'ml-auto'
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
                  title='Decentralized identifiers'
                  subTitle={
                    data?.links?.digitalIdentifiers
                      ? Object.values(data.links.digitalIdentifiers).filter(
                        ({ link, isPublic }) => link && isPublic
                      ).length
                      : 0
                  }
                  icon='/svg/Decentralized identifiers.svg'
                >
                  <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
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
                                className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                                target='_blank'
                                rel='noreferrer'
                              >
                                {imgSrc && (
                                  <img className='h-6 w-6' src={imgSrc} />
                                )}

                                <p className='max-w-[200px] break-words text-white font-normal'>
                                  {`${baseUrl}${link}`}
                                </p>

                                {isVerified && (
                                  <Icon
                                    // icon="bitcoin-icons:verify-filled"
                                    icon='lets-icons:check-fill'
                                    className={cn(
                                      // 'h-8 w-8 text-meta-5',
                                      'h-6 w-6 text-white',
                                      'cursor-not-allowed',
                                      'ml-auto'
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Profile />

      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
    </QueryClientProvider>
  );
}