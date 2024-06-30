// @ts-nocheck
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'


import BiconomyButton from '@/components/Biconomy'
import GuestView from '@/components/Profile/GuestView'
import ProfileDataComponent from '@/components/ProfileDataComponent'
import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore'
import useConnect from '@/hooks/useConnect'
import { ChangeEvent } from 'react'

import LoadingSpinner from '@/components/LoadingSpinner'
import CreateSocialId from '@/components/Profile/CreateSocialId'
import EditForm from '@/components/Profile/EditForm'
import {
  useMutationSetSocialLink,
  useMutationSetUserProfile,
  useQueryGetUserProfileAndSocialLinks,
} from '@/hooks/useBonuzContract'
import { uploadImageToIPFS } from '@/lib/frontend/nft.storage'
import {
  BACKEND_ENDPOINT,
  createUser,
  getUserNFTs,
  verifySocialLink,
} from '@/lib/services'
import { useSessionStore } from '@/store/sessionStore'
import { useUserStore } from '@/store/userStore'
import { User, UserProfileData } from '@/types'
import { NFT } from '@/types/backend'
import { bonuzTokensChainId, twitterRedirectUri } from '../../config'

export default function Home() {
  const { web3auth, isConnected, smartAccount } = useBiconomyShallowStore()
  const { isInitialized } = useConnect()

  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      router.push(`/q=${searchQuery}&filters=all`)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.length === 3) {
      router.push(`/results?query=${value}`)
    }
  }

  if (web3auth?.status !== 'ready' && !isInitialized) {
    return (
      <>
        <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 h-[70vh]">
          <LoadingSpinner />
        </div>

        <div className='hidden'>
          <BiconomyButton />
        </div>
      </>
    )
  }

  if (!isInitialized && !smartAccount) {
    return <GuestView />
  }

  return <UserProfile />
}

const UserProfile = () => {
  // const handle = 'mende'

  // const { data, isLoading } = useQueryGetPublicUserProfileAndSocialLinks(
  //   (handle as string) ?? ''
  // )

  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const [data, setData] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [isCreatingSocialId, setIsCreatingSocialId] = useState(false)
  const [creatingSocialIdError, setCreatingSocialIdError] = useState<
    string | null
  >(null)

  const { token, setToken } = useSessionStore(
    (state) => ({
      token: state.token,
      setToken: state.setToken,
      resetToken: state.resetToken,
    }),
    shallow
  )
  const { isGuest, setUser, smartAccountAddress } = useUserStore(
    (state) => ({
      isGuest: state.isGuest,
      setUser: state.setUser,
      resetUser: state.resetUser,
      smartAccountAddress: state.smartAccountAddress,
    }),
    shallow
  )

  const [nfts, setNfts] = useState<NFT[]>([])

  const [privacyToggle, setPrivacyToggle] = useState('')
  const handelOnSuccessSetSocialLink = async () => {
    //
    setPrivacyToggle('')
  }
  const handleOnErrorSetSocialLink = () => {
    //
    setPrivacyToggle('')
  }
  const { mutate: setSocialLink, isLoading: isLoadingTogglePrivacy } =
    useMutationSetSocialLink(
      handelOnSuccessSetSocialLink,
      handleOnErrorSetSocialLink
    )

  const handlePrivacyToggle = useCallback(
    async (data: {
      key: string
      baseUrl: string
      link: string
      isPublic: boolean
    }) => {
      const platform = data.key

      if (!token) return

      setSocialLink({
        platform,
        baseUrl: data.baseUrl,
        link: data.link,
        isPublic: !data.isPublic,
      })
    },
    [setSocialLink, token]
  )

  const getUser = useCallback(async () => {
    const url = `${BACKEND_ENDPOINT}/api/users/me`

    fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.id) throw new Error('User not Found')

        setData(data)
        setUser(data)
        setUser({
          isGuest: false,
        })
      })
      .catch(() => {
        setUser({
          isGuest: true,
        })
      })

      .finally(() => {
        setLoading(false)
      })
  }, [setUser, token])

  useEffect(() => {
    if (!token) {
      if (isGuest) {
        setLoading(false)
      }

      return
    }

    setLoading(true)

    getUser()

    if (smartAccountAddress) {
      getUserNFTs(smartAccountAddress, bonuzTokensChainId)
        .then((data) => {
          setNfts(data.data.nfts)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [getUser, isGuest, smartAccountAddress, token])

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
      })
    }

    if (code && token) {
      verifyTwitter()
    }
  }, [code, token])

  const { data: userProfileData, isLoading: isLoadingUserData } =
    useQueryGetUserProfileAndSocialLinks()

  const [isEditing, setIsEditing] = useState(false)

  const handelOnSuccess = async () => {
    //
    setIsEditing(false)
  }

  const handleOnError = () => {
    //
    setIsEditing(false)
  }

  const { mutate: setUserProfile, isLoading } = useMutationSetUserProfile(
    handelOnSuccess,
    handleOnError
  )

  const findChangedData = useCallback(
    (currentData: any) => {
      if (!userProfileData) return {}

      const changedData: any = {
        links: {
          //
        },
      }

      if (currentData.name !== userProfileData.name) {
        changedData.name = currentData.name
      }

      if (currentData.profileImage !== userProfileData.profileImage) {
        changedData.profileImage = currentData.profileImage
      }

      if (currentData.handle !== userProfileData.handle) {
        changedData.handle = currentData.handle
      }

      const links = currentData?.links

      Object.keys(links).forEach((category) => {
        Object.keys(links[category]).forEach((item) => {
          const { link } = item
          // @ts-ignore
          const initialLink = userProfileData?.links[category][item].link

          if (link !== initialLink) {
            if (!changedData.links[category]) {
              changedData.links[category] = {}
            }

            changedData.links[category][item] = links[category][item]
          }
        })
      })

      return changedData
    },
    [userProfileData]
  )

  const onSave = useCallback(
    async (userData: UserProfileData & { imageFile: File | null }) => {
      console.log('userData ', userData)
      if (!token) return

      if (userData.imageFile)
        userData.profileImage = await uploadImageToIPFS(userData.imageFile)

      const changedData = findChangedData(userData)

      setUserProfile({
        userData: changedData,
      })
    },
    [findChangedData, setUserProfile, token]
  )

  const handleCreateSocialId = async (data: {
    handle: string
    name: string
    imageFile: File | null
  }) => {
    try {
      setIsCreatingSocialId(true)
      let profileImage

      if (data?.imageFile)
        profileImage = await uploadImageToIPFS(data.imageFile)

      const res = await createUser(
        {
          handle: data.handle,
          name: data.name,
          profileImage,
        },
        token
      )

      setUser({
        ...res.user,
      })

      setToken(res.token)
      setIsCreatingSocialId(false)
    } catch (e: any) {
      if (e?.response?.data) {
        setCreatingSocialIdError(e.response.data.message)
      } else {
        setCreatingSocialIdError('Something went wrong')
      }
      setIsCreatingSocialId(false)
    }
  }

  return (
    <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 sm:h-[70vh]">
      {loading || isLoadingUserData ? (
        <LoadingSpinner />
      ) : isGuest ? (
        <CreateSocialId
          onCreateSocialId={handleCreateSocialId}
          isCreatingSocialId={isCreatingSocialId}
          creatingSocialIdError={creatingSocialIdError}
        />
      ) : (
        <>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center gap-4 h-full'>
              <LoadingSpinner />

              <h4>Updating Blockchain</h4>
            </div>
          ) : (
            <>
              {!isEditing ? (
                <div className='grid grid-col xl:grid-cols-[1fr_2fr] gap-4 relative'>
                  <div className='flex flex-col items-center justify-start'>
                    <div className='flex flex-col items-center px-5 tracking-tight  w-full'>
                      <img
                        src={userProfileData?.profileImage}
                        className='max-w-full aspect-square w-[140px] rounded-full'
                      />
                      <div className='mt-1 text-3xl font-bold text-center text-white'>
                        {data?.name}
                      </div>
                      <div className='mt-1 text-sm leading-5 text-center text-white'>
                        @{data?.handle || ''}
                      </div>
                      <button
                        className='flex justify-center items-center self-stretch px-8 py-2.5 mt-1 w-full text-base font-semibold leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px]'
                        onClick={() => {
                          setIsEditing(true)
                        }}>
                        Edit
                      </button>
                    </div>

                    {/* --------------------- */}
                    {/* <div className='mt-2'>
                      <img
                        src='/images/QR.png'
                        alt='ar code'
                        className='h-fit'
                      />
                    </div> */}
                  </div>
                  <div className='grid-item-2 flex flex-col gap-5 relative'>
                    {/* socials */}

                    <ProfileDataComponent data={userProfileData} nfts={nfts}  />
                  </div>
                </div>
              ) : (
                <EditForm
                  isLoading={isLoading}
                  onSave={async (data) => {
                    try {
                      await onSave(data)
                      // setIsEditing(false)
                    } catch (error) {
                      console.log(error)
                    }
                  }}
                  onCancel={() => {
                    setIsEditing(false)
                  }}
                  data={data}
                  userProfileData={userProfileData}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
