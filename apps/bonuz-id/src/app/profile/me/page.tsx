'use client'
import { Icon } from '@iconify/react'

import { useQueryGetPublicUserProfileAndSocialLinks } from '@/hooks/useBonuzContract'
import { cn } from '@/lib/utils'

import Collapsible from '@/components/Collapsible'

import { hasNonEmptyLink } from '@/utils'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

import { shallow } from 'zustand/shallow';

import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore';
import {
  useMutationSetSocialLink,
  useMutationSetUserProfile,
  useQueryGetUserProfileAndSocialLinks,
} from '@/hooks/useBonuzContract';
import { uploadImageToIPFS } from '@/lib/frontend/nft.storage';
import { BACKEND_ENDPOINT, createUser, getUserNFTs, verifySocialLink } from '@/lib/services';
import { useSessionStore } from '@/store/sessionStore';
import { useUserStore } from '@/store/userStore';
import { User, UserProfileData } from '@/types';
import { NFT } from '@/types/backend';
import { useState } from 'react'
import { useCallback } from 'react'
import { bonuzTokensChainId, twitterRedirectUri } from '../../../../config'
import { useEffect } from 'react'
import Button from '@/components/Button'
import BiconomyButton from '@/components/Biconomy'
import LoadingSpinner from '@/components/LoadingSpinner'
import EditForm from '@/components/Profile/EditForm'

function MyProfile({
  data,
  onSave,
  isLoading,
  handlePrivacyToggle,
  isEditing,
  setIsEditing,
  userProfileData,
  isLoadingTogglePrivacy,
  privacyToggle,
  setPrivacyToggle,
}: {
  data?: User;
  onSave: (data: UserProfileData & { imageFile: File | null }) => Promise<void>;
  handlePrivacyToggle: (data: {
    key: string;
    baseUrl: string;
    link: string;
    isPublic: boolean;
  }) => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  userProfileData: any;
  isLoadingTogglePrivacy: boolean;
  privacyToggle: string;
  setPrivacyToggle: (privacyToggle: string) => void;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) {

  if (!data || !userProfileData) return null;

  const socialMedias = hasNonEmptyLink(userProfileData?.links?.socialMedias);
  const blockchainsWallets = hasNonEmptyLink(
    userProfileData?.links?.blockchainsWallets,
  );
  const messengers = hasNonEmptyLink(userProfileData?.links?.messengers);
  const digitalIdentifiers = hasNonEmptyLink(
    userProfileData?.links?.digitalIdentifiers,
  );

  const SECTIONS = {
    SOCIALS_MEDIA_ACCOUNTS: {
      title: 'Social Media Accounts',
      index: 0,
    },
    MESSAGING_APPS: {
      title: 'Messaging Apps',
      index: 1,
    },
    WALLETS: {
      title: 'Blockchain & Wallets',
      index: 2,
    },
    DECENTRALIZED_IDENTIFERS: {
      title: 'Decentralized Identifiers',
      index: 3,
    },
  };

  const isTwitterConnected = userProfileData?.links?.socialMedias?.s_x?.isVerified;
  const isTwitterVerified = userProfileData?.links?.socialMedias?.s_x?.isTwitterVerified;


  return !isEditing ? (
    <>

      {/* <div className='mt-11 flex border-2 border-sky-500 rounded-[30px] max-md:flex-wrap px-3'>
          <img loading='lazy' src='/svg/Icon Outline.svg' alt='icon-outline' />
          <input
            placeholder='Enter text here'
            className='bg-transparent border border-transparent  rounded-lg focus:bg-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full'
          />
        </div> */}

      {/* <div className='mt-4 w-full h-[48px] flex justify-between items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 border-[#9651FF]'>
          <Image
            src={'/icons/search.svg'}
            width={24}
            height={24}
            alt='search'
          />
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
        </div> */}

      <Button
        transition
        className="hidden rounded-[10px] sm:block"
        onClick={() => {
          setIsEditing(true);
        }}
      >
        Edit
      </Button>

      <div className='grid grid-col xl:grid-cols-[1fr_2fr] mt-10 p-10 gap-4 relative'>
        <div className='flex flex-col items-center justify-start'>
          <div className='flex flex-col items-center px-5 tracking-tight  w-full'>
            <img
              loading='lazy'
              srcSet={userProfileData?.profileImage}
              className='max-w-full aspect-square w-[140px] rounded-full'
            />
            <div className='mt-5 text-3xl font-bold text-center text-white'>
              {userProfileData?.name}
            </div>
            <div className='mt-4 text-sm leading-5 text-center text-white'>
              @{data?.handle}
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
            icon='/svg/Verified identifiers.svg'>
            <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'></div>
          </Collapsible>
        </div>
        <div className='grid-item-2 flex flex-col gap-5'>

          {/* socials */}

          <div className='flex flex-col gap-4'>
            {socialMedias && (
              <Collapsible
                title='Social Media Accounts'
                subTitle={
                  userProfileData?.links?.socialMedias
                    ? Object.values(userProfileData.links.socialMedias).filter(
                      ({ link }) => link
                    ).length
                    : 0
                }
                icon='/svg/Social media accounts.svg'>
                <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
                  {userProfileData?.links?.socialMedias &&
                    Object.entries(userProfileData.links.socialMedias).map(
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
                          baseUrl: string
                          link: string
                          isPublic: boolean
                          icon: any
                          imgSrc: any
                          isVerified: boolean
                          isTwitterVerified?: boolean
                        }
                        if (!link) return null

                        const isTwitter = key == 's_x'

                        return (
                          <div key={key}>
                            <a
                              href={`https://${baseUrl}${link}`}
                              className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10  rounded-lg w-full px-2 py-3 sm:px-5 backdrop-blur-md bg-white/30'
                              target='_blank'
                              rel='noreferrer'>
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
                        )
                      }
                    )}
                </div>
              </Collapsible>
            )}

            {messengers && (
              <Collapsible
                title='Messaging Apps'
                subTitle={
                  userProfileData?.links?.messengers
                    ? Object.values(userProfileData.links.messengers).filter(
                      ({ link, }) => link
                    ).length
                    : 0
                }
                icon='/svg/Messaging apps.svg'>
                <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
                  {userProfileData?.links?.messengers &&
                    Object.entries(userProfileData.links.messengers).map(
                      ([key, value]) => {
                        const {
                          baseUrl,
                          link,
                          isPublic,
                          icon,
                          imgSrc,
                          isVerified,
                        } = value as {
                          baseUrl: string
                          link: string
                          isPublic: boolean
                          icon: any
                          imgSrc: any
                          isVerified: boolean
                        }
                        if (!link) return null

                        return (
                          <div key={key}>
                            <a
                              href={`https://${baseUrl}${link}`}
                              className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                              target='_blank'
                              rel='noreferrer'>
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
                        )
                      }
                    )}
                </div>
              </Collapsible>
            )}

            {blockchainsWallets && (
              <Collapsible
                title='Blockchain & Wallets'
                subTitle={
                  userProfileData?.links?.blockchainsWallets
                    ? Object.values(userProfileData.links.blockchainsWallets).filter(
                      ({ link, isPublic }) => link
                    ).length
                    : 0
                }
                icon='/svg/Blockchain & Wallets.svg'>
                <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
                  {userProfileData?.links?.blockchainsWallets &&
                    Object.entries(userProfileData.links.blockchainsWallets).map(
                      ([key, value]) => {
                        const {
                          baseUrl,
                          link,
                          isPublic,
                          icon,
                          imgSrc,
                          isVerified,
                        } = value as {
                          baseUrl: string
                          link: string
                          isPublic: boolean
                          icon: any
                          imgSrc: any
                          isVerified: boolean
                        }
                        if (!link) return null

                        return (
                          <div key={key}>
                            <a
                              href={`https://${baseUrl}${link}`}
                              className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                              target='_blank'
                              rel='noreferrer'>
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
                        )
                      }
                    )}
                </div>
              </Collapsible>
            )}

            {digitalIdentifiers && (
              <Collapsible
                title='Decentralized identifiers'
                subTitle={
                  userProfileData?.links?.digitalIdentifiers
                    ? Object.values(userProfileData.links.digitalIdentifiers).filter(
                      ({ link, isPublic }) => link
                    ).length
                    : 0
                }
                icon='/svg/Decentralized identifiers.svg'>
                <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
                  {userProfileData?.links?.digitalIdentifiers &&
                    Object.entries(userProfileData.links.digitalIdentifiers).map(
                      ([key, value]) => {
                        const {
                          baseUrl,
                          link,
                          isPublic,
                          icon,
                          imgSrc,
                          isVerified,
                        } = value as {
                          baseUrl: string
                          link: string
                          isPublic: boolean
                          icon: any
                          imgSrc: any
                          isVerified: boolean
                        }
                        if (!link) return null

                        return (
                          <div key={key}>
                            <a
                              href={`https://${baseUrl}${link}`}
                              className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                              target='_blank'
                              rel='noreferrer'>
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
                        )
                      }
                    )}
                </div>
              </Collapsible>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <EditForm
      isLoading={isLoading}
      onSave={async (data) => {
        try {
          await onSave(data);
          // setIsEditing(false)
        } catch (error) {
          console.log(error);
        }
      }}
      onCancel={() => {
        setIsEditing(false);
      }}
      data={data}
      userProfileData={userProfileData}
    />
  )
}

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [data, setData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isCreatingSocialId, setIsCreatingSocialId] = useState(false);
  const [creatingSocialIdError, setCreatingSocialIdError] = useState<
    string | null
  >(null);

  const { token, setToken } = useSessionStore(
    (state) => ({
      token: state.token,
      setToken: state.setToken,
      resetToken: state.resetToken,
    }),
    shallow,
  );
  const { isGuest, setUser, smartAccountAddress } = useUserStore(
    (state) => ({
      isGuest: state.isGuest,
      setUser: state.setUser,
      resetUser: state.resetUser,
      smartAccountAddress: state.smartAccountAddress,
    }),
    shallow,
  );

  const [nfts, setNfts] = useState<NFT[]>([]);

  const [privacyToggle, setPrivacyToggle] = useState('');
  const handelOnSuccessSetSocialLink = async () => {
    //
    setPrivacyToggle('');
  };
  const handleOnErrorSetSocialLink = () => {
    //
    setPrivacyToggle('');
  };
  const { mutate: setSocialLink, isLoading: isLoadingTogglePrivacy } =
    useMutationSetSocialLink(
      handelOnSuccessSetSocialLink,
      handleOnErrorSetSocialLink,
    );

  const handlePrivacyToggle = useCallback(
    async (data: {
      key: string;
      baseUrl: string;
      link: string;
      isPublic: boolean;
    }) => {
      const platform = data.key;

      if (!token) return;

      setSocialLink({
        platform,
        baseUrl: data.baseUrl,
        link: data.link,
        isPublic: !data.isPublic,
      });
    },
    [setSocialLink, token],
  );

  const getUser = useCallback(async () => {
    const url = `${BACKEND_ENDPOINT}/api/users/me`;

    fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.id) throw new Error('User not Found');

        setData(data);
        setUser(data);
        setUser({
          isGuest: false,
        });
      })
      .catch(() => {
        setUser({
          isGuest: true,
        });
      })

      .finally(() => {
        setLoading(false);
      });
  }, [setUser, token]);

  useEffect(() => {
    if (!token) {
      if (isGuest) {
        setLoading(false);
      }

      return;
    }

    setLoading(true);

    getUser();

    if (smartAccountAddress) {
      getUserNFTs(smartAccountAddress, bonuzTokensChainId)
        .then((data) => {
          setNfts(data.data.nfts);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getUser, isGuest, smartAccountAddress, token]);

  useEffect(() => {

    const verifyTwitter = async () => {
      // get code_verifier from local storage
      const code_verifier = localStorage.getItem('code_verifier')

      const res = await verifySocialLink(token!, {
        type: 'x',
        code: {
          code: code ?? '',
          redirectUri: twitterRedirectUri,
          codeVerifier: code_verifier ?? '',
        },
      });
    }

    if (code && token) {
      verifyTwitter()
    }



  }, [code, token])

  const { data: userProfileData, isLoading: isLoadingUserData } =
    useQueryGetUserProfileAndSocialLinks();


  const [isEditing, setIsEditing] = useState(false);

  const handelOnSuccess = async () => {
    //
    setIsEditing(false);
  };

  const handleOnError = () => {
    //
    setIsEditing(false);
  };

  const { mutate: setUserProfile, isLoading } = useMutationSetUserProfile(
    handelOnSuccess,
    handleOnError,
  );

  const findChangedData = useCallback(
    (currentData: any) => {
      if (!userProfileData) return {};

      const changedData: any = {
        links: {
          //
        },
      };

      if (currentData.name !== userProfileData.name) {
        changedData.name = currentData.name;
      }

      if (currentData.profileImage !== userProfileData.profileImage) {
        changedData.profileImage = currentData.profileImage;
      }

      if (currentData.handle !== userProfileData.handle) {
        changedData.handle = currentData.handle;
      }

      const links = currentData?.links;

      Object.keys(links).forEach((category) => {
        Object.keys(links[category]).forEach((item) => {
          const { link } = item;
          // @ts-ignore
          const initialLink = userProfileData?.links[category][item].link;

          if (link !== initialLink) {
            if (!changedData.links[category]) {
              changedData.links[category] = {};
            }

            changedData.links[category][item] = links[category][item];
          }
        });
      });

      return changedData;
    },
    [userProfileData],
  );

  const onSave = useCallback(
    async (userData: UserProfileData & { imageFile: File | null }) => {
      console.log("userData ", userData);
      if (!token) return;

      if (userData.imageFile)
        userData.profileImage = await uploadImageToIPFS(userData.imageFile);

      const changedData = findChangedData(userData);

      setUserProfile({
        userData: changedData,
      });
    },
    [findChangedData, setUserProfile, token],
  );

  const handleCreateSocialId = async (data: {
    handle: string;
    name: string;
    imageFile: File | null;
  }) => {
    try {
      setIsCreatingSocialId(true);
      let profileImage;

      if (data?.imageFile)
        profileImage = await uploadImageToIPFS(data.imageFile);

      const res = await createUser(
        {
          handle: data.handle,
          name: data.name,
          profileImage,
        },
        token,
      );

      setUser({
        ...res.user,
      });

      setToken(res.token);
      setIsCreatingSocialId(false);
    } catch (e: any) {
      if (e?.response?.data) {
        setCreatingSocialIdError(e.response.data.message);
      } else {
        setCreatingSocialIdError('Something went wrong');
      }
      setIsCreatingSocialId(false);
    }
  };

  // ------------------------------
  const { web3auth, isConnected, isInitialized } = useBiconomyShallowStore();
  // if (web3auth?.status !== 'ready' && !isInitialized) {
  //   return (
  //     <>
  //       <LoadingSpinner className="h-screen" />

  //       <div className="hidden">
  //         <BiconomyButton />
  //       </div>
  //     </>
  //   );
  // }
  // -----------------------------


  return <div
    className={cn(
      "min-h-screen bg-[url('/svg/bg.svg')] bg-cover bg-fixed bg-no-repeat pb-10"
      // isConnected
      //   ? "md:bg-[url('/img/dashboard-bg-logged-in.png')]"
      //   : "md:bg-[url('/img/dashboard-bg-1.png')]"
    )}>
    <div className='md:container md:mx-auto px-16'>
      <Header />


      <MyProfile
        isLoading={isLoading}
        data={data}
        onSave={onSave}
        handlePrivacyToggle={handlePrivacyToggle}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        userProfileData={userProfileData}
        isLoadingTogglePrivacy={isLoadingTogglePrivacy}
        privacyToggle={privacyToggle}
        setPrivacyToggle={setPrivacyToggle}
      />
    </div>
  </div>
}