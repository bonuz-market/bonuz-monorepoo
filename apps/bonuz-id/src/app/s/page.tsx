'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Suspense } from 'react'
import { gql, useQuery } from '@apollo/client'

import LoadingSpinner from '@/components/LoadingSpinner'
import UserCarousel from '@/components/UserCarousel'

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

function Search() {
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

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  )
}
