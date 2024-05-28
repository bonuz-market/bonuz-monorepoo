import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import checkboxIcon from '../../public/icons/checkBox-icon.svg';
import searchIcon from '../../public/icons/search.svg';
import cancleIcon from '../../public/icons/arrow-cancle.png';
import staticFace from '../../public/images/static-face.svg';

import Image from 'next/image';

export default function SearchPage() {
    const router = useRouter();
    const { query } = router.query;
    const [searchQuery, setSearchQuery] = useState('')

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
                <button className="rounded-[30px] px-[8px] bg-custom-gradient1 text-[15px] md:text-[16px]">
                    Connect Bonuz On-Chain Social ID
                </button>
            </div>

            <div className="mt-4 w-full h-[48px] flex justify-between items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 border-[#9651FF]">
                <Image src={searchIcon} width={24} height={24} alt="search" />
                <input name="search" className="w-full bg-transparent font-inter text-base font-normal leading-6 tracking-tight text-left border-none" defaultValue="Search" onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} />
                <Image src={cancleIcon} width={30} height={30} alt="cancle" className="cursor-pointer" />
            </div>

            <div className="flex flex-col md:flex-row mt-4 gap-10">
                <div className="flex flex-col gap-2 ">
                    <div>
                        <p>Digital D/Apps</p>
                        <div className="flex flex-col gap-2 pt-6">
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>On-Chain Engagement Airdrops</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Education Certificates</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Shopping (Vouchers, Gift Cards)</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>DEFI</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Virtual Reality</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6">
                        <p>Real-World D/Apps</p>
                        <div className="flex flex-col gap-2 pt-6">
                            <div className="flex flex-row p-2 max-w-[360px] gap-4 border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Humans (Bonuz On-Chain ID)</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Lens Profiles</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 max-w-[360px] border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Real Life Engagement Airdrops</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 border-[1px] max-w-[360px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>99+</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 border-[1px] max-w-[360px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Token-Gated Meetup</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 border-[1px] max-w-[360px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Mixed Reality Games (AR)</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap4'>
                    <div className='flex flex-col bg-gradient-border mt-10 p-2 rounded-[25px]'>
                        <p>Humans</p>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 Guru</p>
                                    <p>@wayneweb3</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient1 w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 News</p>
                                    <p>@web3news</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient1 w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col bg-gradient-border mt-10 p-2 rounded-[25px]'>
                        <div className='grid flex-row gap-4 grid-cols-1 md:grid-cols-2'>
                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 Guru</p>
                                    <p>@wayneweb3</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient1 w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>
                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 News</p>
                                    <p>@web3news</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient1 w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-[30px] bg-[url('/images/third-baackground.svg')] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center">
                                <Image src={staticFace} width={107} height={94} alt='static-face' />
                                <div className='flex flex-col w-full items-center gap-2'>
                                    <p>Web3 News</p>
                                    <p>@web3news</p>
                                    <button className="rounded-[30px] px-[8px] h-[35px] bg-custom-gradient1 w-full text-[12px] md:text-[16px]">
                                        View Social ID Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}