import { useState } from "react";
import SwitchButton from "./SwitchButton";
import Collapsible from "./Collapsible";
import { hasNonEmptyLink } from '@/utils'
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Slider from "react-slick";
interface ProfileDataComponentProps {
    data: any;
}

const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500
};

export default function ProfileDataComponent({ data }: ProfileDataComponentProps) {
    const [selectedOption, setSelectedOption] = useState<string>('On-Chain Social ID');
    const socialMedias = hasNonEmptyLink(data?.links?.socialMedias)

    const messengers = hasNonEmptyLink(data?.links?.messengers)

    const blockchainsWallets = hasNonEmptyLink(data?.links?.blockchainsWallets)
    const digitalIdentifiers = hasNonEmptyLink(data?.links?.digitalIdentifiers)

    return (
        <>
            <SwitchButton selectedOption={selectedOption} setSelectedOption={setSelectedOption} title={['On-Chain Social ID', 'Items']} />
            {
                selectedOption === 'On-Chain Social ID' ? (
                    <>
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
                    </>
                ) : (
                    <div className={cn("flex overflow-hidden gap-4")}>
                        <div
                            className={cn(
                                'rounded-[20px] bg-gradient-to-r from-[#009EFD] to-[#2AF598] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] ',
                                'flex h-[150px] min-w-56 p-3 flex-col items-start gap-3 flex-shrink-0'
                            )}>
                            <div className='flex flex-col justify-center items-start py-2 bg-blend-overlay bg-neutral-400 rounded-[70px]'>
                                <img
                                    src='/svg/card-1-img.svg'
                                    alt='card-1-img'
                                    className='w-[32px]' />
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
                                'flex h-[150px] p-3 min-w-56 flex-col items-start gap-3 flex-shrink-0 '
                            )}>
                            <div className='flex flex-col justify-center items-start p-2 bg-zinc-800 bg-opacity-90 rounded-[70px]'>
                                <img
                                    src='/svg/card-2-img.svg'
                                    alt='card-2-img'
                                    className='w-[32px]' />
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
                                'flex h-[150px] min-w-56 p-3 justify-between items-start flex-shrink-0'
                            )}>
                            <div className='flex flex-col flex-1'>
                                <img
                                    src='/svg/card-3-img.svg'
                                    alt='card-3-img'
                                    className='w-[32px]' />
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
                                'flex h-[150px] p-3 min-w-56 items-start gap-3 flex-shrink-0 '
                            )}>
                            <div className='flex flex-col flex-1 py-px'>
                                <img
                                    src='/svg/card-4-img.svg'
                                    alt='card-4-img'
                                    className='w-[32px]' />
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
                )
            }
        </>
    );
}