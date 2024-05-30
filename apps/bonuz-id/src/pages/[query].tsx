import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import checkboxIcon from '../../public/icons/checkBox-icon.svg';
import searchIcon from '../../public/icons/search.svg';
import cancleIcon from '../../public/icons/arrow-cancle.png';
import staticFace from '../../public/images/static-face.svg';

import Image from 'next/image';

const digitalDappData = [
    { label: 'ON-CHain Engagement Airdrops', count: '96+' },
    { label: 'Education Certificates', count: '99+' },
    { label: 'Shopping (Vouchers, Gift Cards)', count: '99+' },
    { label: 'DEFI', count: '99+' },
    { label: 'Virtual Reality', count: '99+' },
]

const realWorldData = [
    { label: 'Humans (Bonuz On-Chain ID)', count: '96+' },
    { label: 'Lens Profiles', count: '99+' },
    { label: 'Real Life Engagement Airdrops', count: '99+' },
    { label: '99+', count: '' },
    { label: 'Token-Gated Meetup', count: '99+' },
    { label: 'Mixed Reality Games (AR)', count: '99+' },
]

const sliderData = [
    {
        topic: 'Events',
        count: '99+',
        status: 'true',
        images: [
            {
                url: '/images/bodge.png',
                bottom_top_text: 'DecentralizeFest',
                bottom_middle_text: '2024',
                bottom_bottom_text: 'Sep 29,2024',
                left_url: '/images/sample1.png',
                count: '99+',
                left_top_text: 'NFT',
                left_bottom_text: 'Reward'
            },
            {
                url: '/images/bodge.png',
                bottom_top_text: 'CryptoCanvas',
                bottom_middle_text: 'Showcase',
                bottom_bottom_text: 'May 15,2024',
                left_url: '/images/sample1.png',
                count: '99+',
                left_top_text: 'NFT',
                left_bottom_text: 'Reward'
            }
        ]
    },
    {
        topic: 'Food',
        count: '99+',
        status: 'false',
        images: [
            {
                url: '/images/bdoge.png',
                bottom_top_text: 'Starbucks coffee',
                bottom_middle_text: '',
                bottom_bottom_text: '',
                left_url: '/images/sample1.png',
                count: '',
                left_top_text: 'Voucher',
                left_bottom_text: 'Reward'
            },
            {
                url: '',
                bottom_top_text: 'McDonalds',
                bottom_middle_text: '',
                bottom_bottom_text: '',
                left_url: '',
                count: '99+',
                left_top_text: 'NFT',
                left_bottom_text: 'Reward'
            }
        ]
    },
    {
        topic: 'Attractions',
        count: '99+',
        status: 'false',
        images: [
            {
                url: '/images/bdoge.png',
                bottom_top_text: 'Dubai Opera Grand',
                bottom_middle_text: 'Grand',
                bottom_bottom_text: '',
                left_url: '/images/sample1.png',
                count: '',
                left_top_text: 'Drink',
                left_bottom_text: 'Reward'
            },
            {
                url: '',
                bottom_top_text: 'Museum of Illusion',
                bottom_middle_text: 'Dubai',
                bottom_bottom_text: '',
                left_url: '',
                count: '99+',
                left_top_text: 'NFT',
                left_bottom_text: 'Reward'
            }
        ]
    }
]

export default function SearchPage() {
    const router = useRouter();
    const { query } = router.query;
    const [searchQuery, setSearchQuery] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1
        );
    };

    useEffect(() => {
        if (query) {
            console.log("searchQuery:", query)
        }
    }, [query])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // router.push(`/q=${searchQuery}&filters=all`)
        }
    }

    return (
        <div className="bg-[url('/images/third-baackground.svg')] bg-center flex w-full min-h-screen flex-col px-7 pb-6" >
            <div className="flex justify-between bg-[url('/images/third-baackground.svg')] h-[56px] items-center flex-col rounded-b-[30px] bg-opacity-5 md:flex-row gap-0 md:gap-2 px-8">
                <p className='font-[26px] hidden md:flex'>bonuz</p>
                <div className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] bg-[url('/icons/up-icon.png')] rounded-[50px] bg-center flex justify-center items-center cursor-pointer" onClick={() => router.push('/')} />
                <button className="rounded-[30px] px-[8px] bg-custom-gradient-mint text-[15px] md:text-[16px]">
                    Connect Bonuz On-Chain Social ID
                </button>
            </div>

            <div className="mt-4 w-full h-[48px] flex justify-between items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 border-[#9651FF]">
                <Image src={searchIcon} width={24} height={24} alt="search" />
                <input name="search" className="w-full outline-none bg-transparent font-inter text-base font-normal leading-6 tracking-tight text-left border-none" defaultValue="Search" onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} />
                <Image src={cancleIcon} width={30} height={30} alt="cancle" className="cursor-pointer" />
            </div>

            <div className="flex flex-col md:flex-row mt-4 gap-10">
                <div className="flex flex-col gap-2 ">
                    <div>
                        <p>Digital D/Apps</p>
                        <div className="flex flex-col gap-2 pt-6">
                            {digitalDappData.map((data, index) => (
                                <div key={index} className="flex flex-row p-2 gap-4 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                    <div className='flex flex-row gap-2 text-[16px]'>
                                        <p>{data.label}</p>
                                        {data.count !== '' && (
                                            <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[13px]">
                                                {data.count}
                                            </div>
                                        )}
                                    </div>
                                    <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-6">
                        <p>Real-World D/Apps</p>
                        <div className="flex flex-col gap-2 pt-6">
                            {realWorldData.map((data, index) => (
                                <div key={index} className="flex flex-row p-2 gap-4 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                    <div className='flex flex-row gap-2 text-[16px]'>
                                        <p>{data.label}</p>
                                        {data.count !== '' && (
                                            <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[13px]">
                                                {data.count}
                                            </div>
                                        )}
                                    </div>
                                    <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap4'>
                    <div className='flex flex-col bg-gradient-border mt-10 p-2 rounded-[25px] '>
                        <p>Humans</p>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 Guru</p>
                                    <p>@wayneweb3</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient-mint w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 News</p>
                                    <p>@web3news</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient-mint w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col bg-gradient-border mt-10 p-2 rounded-[25px]'>
                        <div className='grid flex-row gap-4 grid-cols-1 md:grid-cols-2'>
                            {sliderData.map((data, index) => (
                                <div key={index} className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-col gap-4 justify-center items-center">
                                    <div className='flex flex-row gap-2 justify-between w-full'>
                                        <div className='flex flex-row justify-center items-center gap-2'>
                                            <p>{data.topic}</p>
                                            {data.count !== '' && (
                                                <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[13px]">
                                                    {data.count}
                                                </div>
                                            )}
                                        </div>
                                        {data.status === 'true' && (
                                            <div className="flex w-[75px] h-[25px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[13px] cursor-pointer">
                                                View All
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        id="controls-carousel"
                                        className="relative w-full w-[250px] h-[130px] flex justify-center"
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
                                            {data.images.map((frame, index1) => (
                                                <div
                                                    key={index1}
                                                    className={`duration-700 ease-in-out ${index1 === currentIndex ? "block" : "hidden"
                                                        }`}
                                                    data-carousel-item={
                                                        index1 === currentIndex ? "active" : undefined
                                                    }
                                                >
                                                    <Image
                                                        src={frame.url}
                                                        alt={`Frame ${index + 1}`}
                                                        width={138}
                                                        height={70}
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
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}