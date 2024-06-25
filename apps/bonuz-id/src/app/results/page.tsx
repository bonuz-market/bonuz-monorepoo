'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { gql, useQuery } from '@apollo/client';

import Header from '@/components/Header'
import { useResultTypeStore } from '@/store/resultTypeStore';
import { useShallow } from 'zustand/react/shallow';
import { resultTypes } from '@/types/typeResult';
import { ResultTypesComponent } from '@/components/ResultTypesComponent'
import { ResultSlideComponent } from '@/components/ResultSlideComponent'

const sliderData = [
  {
    topic: 'Events',
    count: '99+',
    status: 'true',
    images: [
      {
        url: '/images/bdoge.png',
        bottom_top_text: 'DecentralizeFest 2024',
        bottom_bottom_text: 'Sep 29,2024',
        left_url: '/images/sample1.png',
        count: '+99',
        left_top_text: 'NFT',
        left_bottom_text: 'Reward',
      },
      {
        url: '/images/bdoge.png',
        bottom_top_text: 'CryptoCanvas Showcase',
        bottom_bottom_text: 'May 15,2024',
        left_url: '/images/sample1.png',
        count: '+99',
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
        bottom_bottom_text: '',
        left_url: '/images/sample1.png',
        count: '',
        left_top_text: 'Voucher',
        left_bottom_text: 'Reward',
      },
      {
        url: '/images/bdoge.png',
        bottom_top_text: 'McDonalds',
        bottom_bottom_text: '',
        left_url: '/images/sample1.png',
        count: '+99',
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
        bottom_top_text: 'Dubai Opera Grand Tour',
        bottom_bottom_text: '',
        left_url: '/images/sample1.png',
        count: '',
        left_top_text: 'Drink',
        left_bottom_text: 'Reward',
      },
      {
        url: '/images/bdoge.png',
        bottom_top_text: 'Museum of Illusion Dubai',
        bottom_bottom_text: '',
        left_url: '/images/sample1.png',
        count: '+99',
        left_top_text: 'NFT',
        left_bottom_text: 'Reward',
      },
    ],
  },
]

const GET_USER_PROFILES = gql`
  query GetUserProfilesByHandles($handles: String!) {
    userProfiles(where: { handle_contains: $handles }) {
      wallet: id
      handle
      name
      profileImage
      socialLinks {
        platform
        link
        lastUpdated
      }
    }
  }
`;

interface GraphQLUser {
  wallet: string
  handle: string
  name: string
  profileImage: string
  socialLinks: {
    platform: string
    link: string
    lastUpdated: string
  }
}

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


  const { data } = useQuery(GET_USER_PROFILES, {
    variables: { handles: searchQuery },
  });

  const [digitalTypesArray, setDigitalTypesArray] = useState<any[]>([]);
  const [realTypesArray, setRealTypesArray] = useState<any[]>([]);

  const { digitalTypes, realWorldTypes } = useResultTypeStore(
    useShallow((store) => ({
      digitalTypes: store.digitalTypes,
      realWorldTypes: store.realWorldTypes,
    }))
  )

  useEffect(() => {
    setDigitalTypesArray(Object.values(digitalTypes));
    setRealTypesArray(Object.values(realWorldTypes));
  }, [digitalTypes, realWorldTypes])

  useEffect(() => {
    console.log("result:", digitalTypesArray);
  }, [digitalTypesArray]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query as string)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const results = data?.userProfiles as GraphQLUser[] || []
  console.log("results ", results);

  return (
    <div className="bg-[url('/images/third-baackground.svg')] bg-center flex w-full h-auto md:h-[100vh] lg:h-auto xl:h-[100vh] flex-col px-7 pb-6 bg-cover overflow-hidden">
      <Header />
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
            <ResultTypesComponent datas={digitalTypesArray} type="digital" setDigitalTypesArray={setDigitalTypesArray} setRealTypesArray={setRealTypesArray} />
          </div>
          <div className="pt-2">
            <p className="text-[16px] leading-[30px] font-normal">
              Real-World D/Apps
            </p>
            <ResultTypesComponent datas={realTypesArray} type="realworld" setDigitalTypesArray={setDigitalTypesArray} setRealTypesArray={setRealTypesArray} />
          </div>
        </div>
        <div className='flex flex-col flex-3'>
          <div>
            <div className='flex flex-col bg-gradient-border p-3 rounded-[25px] bg-[#ffffff05]'>
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
                {results.map((user) => {
                  return (
                    <div
                      className='rounded-[30px] bg-[#a2a2a20a] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center flex-1'
                      key={user.wallet}>
                      {user.profileImage ? <img
                        src={user.profileImage}
                        className='rounded-full w-[107px] h-[94px]'
                        alt="static-face"
                      /> : <div className='skeleton w-32 h-32'></div>}

                      <div className='flex flex-col w-full items-center gap-2'>
                        <p>{user.name}</p>
                        <p>@{user.handle}</p>
                        <button className='rounded-[30px] px-[8px] h-[35px] bg-custom-gradient-mint w-full text-[12px] md:text-[16px]'
                          onClick={() => router.push(`/profile/${user.handle}`)}
                        >
                          View Social ID Profile
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='flex flex-col bg-gradient-border mt-2 p-2 rounded-[25px]'>
            <ResultSlideComponent slidedata={sliderData} />
          </div>
        </div>
      </div>
    </div>
  )
}
