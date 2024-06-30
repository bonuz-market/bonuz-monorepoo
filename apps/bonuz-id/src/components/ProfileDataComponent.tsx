import { SetStateAction, useState } from 'react'
import SwitchButton from './SwitchButton'
import Collapsible from './Collapsible'
import { hasNonEmptyLink } from '@/utils'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import voucherImage from '../../public/images/Header.png'
import { User, UserProfileData } from '@/types/user'
import VoucherComponent from './VoucherComponent'
import { voucherSliderData } from '../mockUpData/profileSliderData'
import Carousel from './Carousel'
import { NFT } from '@/types/backend'

const NFTCard = ({
  name,
  description,
  image,
  external_url,
}: Pick<NFT, 'name' | 'description' | 'external_url'> & {
  image: string
}) => (
  <a
    className='flex flex-col gap-4  rounded-lg bg-primary-main p-4 md:flex-row'
    href={external_url ?? ''}
    target='_blank'>
    {/* 
  the image's source domain is not uniform, so we can't use next/image here
  unless we add the domains to the next.config.js file
*/}
    <img
      src={image || '/assets/nft-placeholder.svg'}
      alt={name}
      className='w-1/4 rounded-lg'
    />

    <div className=' flex-col justify-center gap-2'>
      <p className='text-2xl font-medium text-white'>{name || 'Untitled'}</p>

      <div className='flex flex-col justify-between gap-2 text-white text-opacity-60 md:flex-row'>
        {!!description && (
          <p className='text-base'>
            {description.length > 100
              ? `${description.slice(0, 100)}...`
              : description}
          </p>
        )}

        <p className='text-right text-base'>
          {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  </a>
)

interface ProfileDataComponentProps {
  data: UserProfileData
  nfts: NFT[]
}

export default function ProfileDataComponent({
  data,
  nfts,
}: ProfileDataComponentProps) {
  const [selectedOption, setSelectedOption] =
    useState<string>('On-Chain Social ID')
  const socialMedias = hasNonEmptyLink(data?.links?.socialMedias)

  const messengers = hasNonEmptyLink(data?.links?.messengers)

  const blockchainsWallets = hasNonEmptyLink(data?.links?.blockchainsWallets)
  const digitalIdentifiers = hasNonEmptyLink(data?.links?.digitalIdentifiers)
  const [swiperIndex, setSwiperIndex] = useState(0)
  console.log('swiperIndex ', swiperIndex)

  const attributeToTabMap: Record<string, string> = {
    MEMBERSHIP: 'Memberships',
    VOUCHER: 'Voucher',
    CERTIFICATE: 'Certificates',
    // LOYALTY: 'Loyalty Program',
    // POA: 'POAs',
  }

  const tabs = ['All', ...Object.keys(attributeToTabMap)].map((value) => {
    const content =
      value === 'All'
        ? nfts
        : nfts.filter((nft) =>
            nft.attributes?.some((attribute) => attribute.value === value)
          )

    return {
      name: value === 'All' ? value : attributeToTabMap[value],
      content: (
        <div className='flex flex-col'>
          {content.map((nft: NFT) => (
            <NFTCard
              key={nft.contract_address + nft.token_id}
              name={nft.name}
              description={nft.description}
              image={nft.content?.preview?.url ?? '/assets/nft-placeholder.svg'}
              external_url={nft.external_url}
            />
          ))}
        </div>
      ),
    }
  })

  console.log('tabs ', tabs)

  return (
    <>
      <SwitchButton
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        title={['On-Chain Social ID', 'Items']}
      />
      {selectedOption === 'On-Chain Social ID' ? (
        <div className='max-h-[55vh] overflow-auto flex flex-col gap-5'>
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
                data?.links?.messengers
                  ? Object.values(data.links.messengers).filter(
                      ({ link, isPublic }) => link && isPublic
                    ).length
                  : 0
              }
              icon='/svg/Messaging apps.svg'>
              <div className='grid gap-4 lg:grid-cols-1 xl:grid-cols-2'>
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
                          {imgSrc && <img className='h-6 w-6' src={imgSrc} />}

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
                  })}
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
                      if (!link) return null

                      return (
                        <div key={key}>
                          <a
                            href={`https://${baseUrl}${link}`}
                            className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                            target='_blank'
                            rel='noreferrer'>
                            {imgSrc && <img className='h-6 w-6' src={imgSrc} />}

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
                      if (!link) return null

                      return (
                        <div key={key}>
                          <a
                            href={`https://${baseUrl}${link}`}
                            className='cursor-pointer no-underline flex items-center justify-start gap-4 sm:gap-10 backdrop-blur-md bg-white/30 rounded-lg w-full px-2 py-3 sm:px-5'
                            target='_blank'
                            rel='noreferrer'>
                            {imgSrc && <img className='h-6 w-6' src={imgSrc} />}

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
      ) : (
        <div className={cn('slider-container w-[720px]')}>
          <Carousel
            slides={voucherSliderData}
            animationDuration={1000}
            duration={5000}
            animationTimingFunction='linear'
            withNavigation
            setSwiperIndex={setSwiperIndex}
          />
          <div className='max-h-[20vh] overflow-auto'>
            {tabs[swiperIndex].content}
          </div>

          {/* <div className={cn("flex w-full mt-10")}>
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
          </div> */}
        </div>
      )}
    </>
  )
}
