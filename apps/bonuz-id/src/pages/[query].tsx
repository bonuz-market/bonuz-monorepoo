import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import checkboxIcon from '../../public/icons/checkBox-icon.svg';
import searchIcon from '../../public/icons/search.svg';
import cancleIcon from '../../public/icons/arrow-cancle.png';


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


        <div className="bg-[url('../../public/images/third-baackground.svg')] flex w-full h-full flex-col" >
            <div className="flex justify-between items-center mt-[28px] flex-col md:flex-row md: gap-2">
                <p className='font-[26px] invisible md:visible'>bonuz</p>
                <button className="w-[30px] h-[30px] bg-[#c5c5c56b] rounded-[50px] flex justify-center items-center">
                    <svg
                        className="w-3 h-3 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 8"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
                        />
                    </svg>
                </button>
                <button className="rounded-[30px] px-[8px] bg-custom-gradient1">
                    Connect Bonuz On-Chain Social ID
                </button>
            </div>

            <div className="mt-16 w-full h-[48px] flex justify-between items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 pt-0 border-[#9651FF]">
                <Image src={searchIcon} width={24} height={24} alt="search" />
                <input name="search" className="w-full bg-transparent font-inter text-base font-normal leading-6 tracking-tight text-left border-none" defaultValue="Search" onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} />
                <Image src={cancleIcon} width={30} height={30} alt="cancle" className="cursor-pointer" />
            </div>

            <div className="flex flex-col mt-4 ">
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
                            <div className="flex flex-row p-2 border-[1px] max-w-[360px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>DEFI</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                            <div className="flex flex-row p-2 border-[1px] rounded-[16px] bg-transparent justify-between font-inter text-base font-normal leading-6 tracking-tight text-left">
                                <p>Virtual Reality</p>
                                <Image src={checkboxIcon} width={20} height={20} alt="checkbox_icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}