'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { gql, useQuery } from '@apollo/client'

import LoadingSpinner from '@/components/LoadingSpinner'
import UserCarousel from '@/components/UserCarousel'

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
`

const mockUserData = [
  {
    wallet: '0xfd046d678588e3a0b714Bf1B13852d22c8703Fd666',
    handle: '@wayneweb3',
    name: 'Jack Abdo',
    profileImage: '/images/user.png',
    socialLinks: {
      platform: '',
      link: '',
      lastUpdated: '',
    },
  },
  {
    wallet: '0xfd046d678588e3a0b714Bf1B1d0d394c8703Fd666',
    handle: '@wab3news',
    name: 'Jason Taman',
    profileImage: '/images/user.png',
    socialLinks: {
      platform: '',
      link: '',
      lastUpdated: '',
    },
  },
  {
    wallet: '0xfd046d678588e3a0b714Bf1B1d0d22c87232Fd666',
    handle: '@wayneweb3',
    name: 'Jack Abdo',
    profileImage: '/images/user.png',
    socialLinks: {
      platform: '',
      link: '',
      lastUpdated: '',
    },
  },
  {
    wallet: '0xfd046d678588e3a0b714Bf1B1d0d22c8703Fd3426',
    handle: '@wab3news',
    name: 'Jason Taman',
    profileImage: '/images/user.png',
    socialLinks: {
      platform: '',
      link: '',
      lastUpdated: '',
    },
  },
]
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
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, loading } = useQuery(GET_USER_PROFILES, {
    variables: { handles: searchQuery },
  })


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

  const results = (data?.userProfiles as GraphQLUser[]) || []

  return (
    <div className=' bg-gradient-border p-3 rounded-[25px] bg-[#ffffff05] mt-4 min-h-[200px]'>
      {loading && (
        <div className='flex flex-col items-center justify-center min-h-[200px] h-full w-full'>
          <LoadingSpinner />
        </div>
      )}

      {!loading && (
        <>
          <div className='flex gap-[12px] items-center'>
            <span className='mb-[12px]'>Users</span>
            <span className='mb-[12px] bg-[#a2a2a20a] py-[4px] px-[8px] rounded-[10px]'>
              {results?.length}
            </span>
          </div>

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
          <UserCarousel
            users={results}
            animationDuration={1000}
            duration={5000}
            animationTimingFunction='linear'
            withNavigation
          />
        </>
      )}
    </div>
  )

}
