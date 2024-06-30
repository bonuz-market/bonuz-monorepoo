'use client'
import '@/lib/env'
import { Icon } from '@iconify/react'

import { useQueryGetPublicUserProfileAndSocialLinks } from '@/hooks/useBonuzContract'
import { cn } from '@/lib/utils'

import Collapsible from '@/components/Collapsible'

import { hasNonEmptyLink } from '@/utils'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import { useState } from 'react'
import ProfileDataComponent from '@/components/ProfileDataComponent'
import LoadingSpinner from '@/components/LoadingSpinner'

function Profile() {
  const { handle } = useParams()
  // const handle = 'mende';

  const { data, isLoading } = useQueryGetPublicUserProfileAndSocialLinks(
    (handle as string) ?? ''
  )

  const socialMedias = hasNonEmptyLink(data?.links?.socialMedias)

  const messengers = hasNonEmptyLink(data?.links?.messengers)

  const blockchainsWallets = hasNonEmptyLink(data?.links?.blockchainsWallets)
  const digitalIdentifiers = hasNonEmptyLink(data?.links?.digitalIdentifiers)

  return (
    <div className='w-full h-screen'>
      {isLoading ? (
        <div className='flex flex-col items-center justify-center h-full w-full'>
          {' '}
          <LoadingSpinner />
        </div>
      ) : data ? (
        <>
          <div className='grid grid-col xl:grid-cols-[1fr_2fr] mt-10 p-10 gap-4 relative max-h-[500px] w-full overflow-auto'>
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
                {/* <button className='flex justify-center items-center self-stretch px-8 py-2.5 mt-7 w-full text-base font-semibold leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px]'>
                + Add Connection
              </button> */}
              </div>

              {/* --------------------- */}
              {/* <div className='mt-10'>
              <img src='/images/qr-code.png' alt='ar code' className='' />
            </div> */}

              {/* <Collapsible
              title='Verified identifiers'
              subTitle=''
              icon='/svg/Verified identifiers.svg'>
              <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'></div>
            </Collapsible> */}
            </div>
            <div className='grid-item-2 flex flex-col gap-5'>
              {/* socials */}

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
                  icon='/svg/Social media accounts.svg'>
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
                            baseUrl: string
                            link: string
                            isPublic: boolean
                            icon: any
                            imgSrc: any
                            isVerified: boolean
                            isTwitterVerified?: boolean
                          }
                          if (!link || !isPublic) return null

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
                    data?.links?.messengers
                      ? Object.values(data.links.messengers).filter(
                          ({ link, isPublic }) => link && isPublic
                        ).length
                      : 0
                  }
                  icon='/svg/Messaging apps.svg'>
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
                            baseUrl: string
                            link: string
                            isPublic: boolean
                            icon: any
                            imgSrc: any
                            isVerified: boolean
                          }
                          if (!link || !isPublic) return null

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
                    data?.links?.blockchainsWallets
                      ? Object.values(data.links.blockchainsWallets).filter(
                          ({ link, isPublic }) => link && isPublic
                        ).length
                      : 0
                  }
                  icon='/svg/Blockchain & Wallets.svg'>
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
                            baseUrl: string
                            link: string
                            isPublic: boolean
                            icon: any
                            imgSrc: any
                            isVerified: boolean
                          }
                          if (!link || !isPublic) return null

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
                    data?.links?.digitalIdentifiers
                      ? Object.values(data.links.digitalIdentifiers).filter(
                          ({ link, isPublic }) => link && isPublic
                        ).length
                      : 0
                  }
                  icon='/svg/Decentralized identifiers.svg'>
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
                            baseUrl: string
                            link: string
                            isPublic: boolean
                            icon: any
                            imgSrc: any
                            isVerified: boolean
                          }
                          if (!link || !isPublic) return null

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
        </>
      ) : (
        <h1 className='flex items-center justify-center text-2xl text-meta-1 font-bold'>
          User not found
        </h1>
      )}
    </div>
  )
}

export default function HomePage() {
  return <Profile />
}
