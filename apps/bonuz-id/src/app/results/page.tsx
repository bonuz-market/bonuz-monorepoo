'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import Image from 'next/image'
import axios from 'axios'
import { ChangeEvent } from 'react'
import { cn } from '@/lib/utils'

import checkboxIcon from "../../../public/icons/checkBox-icon.svg";

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
        left_bottom_text: 'Reward',
      },
      {
        url: '/images/bodge.png',
        bottom_top_text: 'CryptoCanvas',
        bottom_middle_text: 'Showcase',
        bottom_bottom_text: 'May 15,2024',
        left_url: '/images/sample1.png',
        count: '99+',
        left_top_text: 'NFT',
        left_bottom_text: 'Reward',
      },
    ],
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
        left_bottom_text: 'Reward',
      },
      {
        url: '',
        bottom_top_text: 'McDonalds',
        bottom_middle_text: '',
        bottom_bottom_text: '',
        left_url: '',
        count: '99+',
        left_top_text: 'NFT',
        left_bottom_text: 'Reward',
      },
    ],
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
        left_bottom_text: 'Reward',
      },
      {
        url: '',
        bottom_top_text: 'Museum of Illusion',
        bottom_middle_text: 'Dubai',
        bottom_bottom_text: '',
        left_url: '',
        count: '99+',
        left_top_text: 'NFT',
        left_bottom_text: 'Reward',
      },
    ],
  },
]

interface User {
  createdAt: string
  handle: string
  id: number
  isCurrentConnection: boolean
  smartAccountAddress: string
  updatedAt: string
  walletAddress: string
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const query = searchParams.get('query')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<User[]>([])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  useEffect(() => {
    if (query) {
      setSearchQuery(query as string)
    }
  }, [query])

  useEffect(() => {
    const fetchData = async (searchQuery: string) => {
      try {
        const response = await axios.get<User[]>('/data/users.json')
        const users = response.data
        if (!searchQuery) {
          setResults(users)
          return
        }
        const filteredUsers = users.filter((user) =>
          user.handle.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setResults(filteredUsers)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // if (searchQuery && searchQuery.length >= 3) {
    fetchData(searchQuery as string)
  }, [searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // router.push(`/q=${searchQuery}&filters=all`)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // if (value.length >= 3) {
    // router.push(`/results?query=${value}`, undefined, { shallow: true })
    // }
  }

  return (
    <div className="bg-[url('/images/third-baackground.svg')] bg-center flex w-full h-auto md:h-[100vh] lg:h-auto xl:h-[100vh] flex-col px-7 pb-6 bg-cover">
      <div className="flex justify-between  h-[56px] items-center flex-col rounded-b-[30px] bg-opacity-5 md:flex-row gap-0 md:gap-2 px-8 bg-[#a2a2a20a]">
        <p className="font-[26px] hidden md:flex">bonuz</p>
        <div
          className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] bg-[url('/icons/up-icon.png')] rounded-[50px] bg-center flex justify-center items-center cursor-pointer"
          onClick={() => router.push("/")}
        />
        <button className="rounded-[30px] px-[8px] bg-custom-gradient-mint text-[12px] md:text-[14px]">
          Connect Bonuz On-Chain Social ID
        </button>
      </div>

      <div className="mt-2 w-full h-[30px] flex justify-between items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 border-[#9651FF]">
        <Image src={'/icons/search.svg'} width={20} height={20} alt="search" />
        <input
          name="search"
          className="w-full outline-none bg-transparent font-inter text-base font-normal leading-6 tracking-tight text-left border-none"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Image
          src={'/icons/search.svg'}
          width={20}
          height={20}
          alt="cancle"
          className="cursor-pointer"
        />
      </div>

      <div className='flex flex-col md:flex-row mt-4 gap-[42px]'>
        <div className="flex flex-col gap-2 flex-1">
          <div>
            <p className="text-[16px] leading-[30px] font-normal">
              Digital D/Apps
            </p>
            <div className="flex flex-col gap-1 pt-2">
              {digitalDappData.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-row p-2 gap-4 max-w-[360px] bg-[#a2a2a20a] rounded-[16px] justify-between font-inter text-base font-normal leading-6 tracking-tight text-left px-[16px] py-[8px]"
                >
                  <div className="flex flex-row gap-2 text-[14px] justify-center items-center">
                    <p>{data.label}</p>
                    {data.count !== "" && (
                      <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[12px]">
                        {data.count}
                      </div>
                    )}
                  </div>
                  <Image
                    src={checkboxIcon}
                    width={20}
                    height={20}
                    alt="checkbox_icon"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <p className="text-[16px] leading-[30px] font-normal">
              Real-World D/Apps
            </p>
            <div className="flex flex-col gap-1 pt-2">
              {realWorldData.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-row p-2 gap-4 max-w-[360px] bg-[#a2a2a20a] rounded-[16px] justify-between font-inter text-base font-normal leading-6 tracking-tight text-left px-[16px] py-[8px]"
                >
                  <div className="flex flex-row gap-2 text-[14px] justify-center items-center">
                    <p>{data.label}</p>
                    {data.count !== "" && (
                      <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[13px]">
                        {data.count}
                      </div>
                    )}
                  </div>
                  <Image
                    src={checkboxIcon}
                    width={20}
                    height={20}
                    alt="checkbox_icon"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-3'>
          <div>
            <div className='flex flex-col bg-gradient-border mt-10 p-2 rounded-[25px] bg-[#ffffff05] p-[16px]'>
              <div className='flex gap-[12px] items-center'>
                <span className='mb-[12px]'>Users</span>
                <span className='mb-[12px] bg-[#a2a2a20a] py-[4px] px-[8px] rounded-[10px]'>
                  {results?.length}
                </span>
              </div>
              <div
                className={cn(
                  'grid grid-cols-1 gap-4',
                  results.length === 0 ? 'md:grid-cols-1' : 'md:grid-cols-2'
                )}>
                {results.length === 0 && (
                  <>
                    <div className='flex flex-col items-center justify-center'>
                      <h2 className='text-2xl font-bold '>No results found</h2>
                      <h2 className='text-lg font-semibold '>
                        This username is not available
                      </h2>
                    </div>
                  </>
                )}
                {results.map((user) => (
                  <div
                    className='rounded-[30px] bg-[#a2a2a20a] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center flex-1'
                    key={user.id}>
                    {/* <Image
                      src={staticFace}
                      width={107}
                      height={94}
                      alt="static-face"
                    /> */}
                    {/* <Skeleton className='h-20 w-20 rounded-full' /> */}
                    <div className='skeleton w-32 h-32'></div>
                    <div className='flex flex-col w-full items-center gap-2'>
                      <p>Name</p>
                      <p>@{user.handle}</p>
                      <button className='rounded-[30px] px-[8px] h-[35px] bg-custom-gradient-mint w-full text-[12px] md:text-[16px]'
                        onClick={() => router.push(`/profile/${user.handle}`)}
                      >
                        View Social ID Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col bg-gradient-border mt-10 p-2 rounded-[25px]'>
            <div className='grid flex-row gap-4 grid-cols-1 md:grid-cols-2'>
              {sliderData.map((data, index) => (
                <div
                  key={index}
                  className='rounded-[30px] bg-[#a2a2a20a] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-col gap-4 justify-center items-center'>
                  <div className='flex flex-row gap-2 justify-between w-full'>
                    <div className='flex flex-row justify-center items-center gap-2'>
                      <p>{data.topic}</p>
                      {data.count !== '' && (
                        <div className='flex w-[32px] h-[20px] rounded-[50px] bg-[#a2a2a20a] text-center justify-center items-center text-[13px]'>
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
                    id='controls-carousel'
                    className='relative w-full w-[250px] h-[130px] flex justify-center'
                    data-carousel='static'>
                    <button
                      type='button'
                      className='top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                      data-carousel-prev
                      onClick={handlePrev}>
                      <span className='inline-flex items-center justify-center w-10 h-10 rounded-full'>
                        <svg
                          className='w-4 h-4 text-white  rtl:rotate-180'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 6 10'>
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M5 1 1 5l4 4'
                          />
                        </svg>
                        <span className='sr-only'>Previous</span>
                      </span>
                    </button>

                    <div className='relative overflow-hidden rounded-lg h-[100%] w-[100%] flex items-center justify-center'>
                      {data.images.map((frame, index1) => (
                        <div
                          key={index1}
                          className={`duration-700 ease-in-out ${index1 === currentIndex ? 'block' : 'hidden'
                            }`}
                          data-carousel-item={
                            index1 === currentIndex ? 'active' : undefined
                          }>
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
                      type='button'
                      className='top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                      data-carousel-next
                      onClick={handleNext}>
                      <span className='inline-flex items-center justify-center w-10 h-10 rounded-full'>
                        <svg
                          className='w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 6 10'>
                          <path
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='m1 9 4-4-4-4'
                          />
                        </svg>
                        <span className='sr-only'>Next</span>
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
