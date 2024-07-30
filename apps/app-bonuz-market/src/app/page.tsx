// @ts-nocheck
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useQuery as useQueryApollo } from '@apollo/client'

import BiconomyButton from '@/components/Biconomy'
import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore'
import useConnect from '@/hooks/useConnect'

import LoadingSpinner from '@/components/LoadingSpinner'
import Sidebar from '@/components/Sidebar'
import { useSessionStore } from '@/store/sessionStore'
import { useQueryPartners } from '@/hooks/queries'
import { GET_NFTS_QUERY } from '@/lib/graphql-queries'
import StyledIcon from '@/components/StyledIcon'
import Button from '@/components/Button'
import ListPartnerEvents from '@/components/Partner/ListPartnerEvents'
import { NewPartnerStatus } from '@/types'
import { getImgUrl } from '@/utils/getImgUrl'
import CreatePartner from '@/components/Partner/CreatePartner'
import DashboardLayout from '@/components/DashboardLayout'

export default function Home() {
  const { token } = useSessionStore.getState()

  const { data, refetch, isLoading } = useQueryPartners()
  const partner = data?.[0]
  const status = partner?.status

  const [isEditing, setIsEditing] = useState(false)
  const { web3auth, isConnected, smartAccount } = useBiconomyShallowStore()
  const { isInitialized } = useConnect()

  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleRefresh = () => {
    refetch()
  }

  // TODO: this should be in layout.tsx
  if (web3auth?.status !== 'ready' && !isInitialized) {
    return (
      <>
        <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 h-[70vh]">
          <LoadingSpinner />
        </div>

        <div className='hidden'>
          <BiconomyButton />
        </div>
      </>
    )
  }

  // if (!isInitialized && !smartAccount) {
  //   // return <GuestView />
  // }

  if (isLoading)
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    )

  if (
    !isEditing &&
    (status === NewPartnerStatus.IN_REVIEW ||
      status === NewPartnerStatus.REJECTED ||
      status === NewPartnerStatus.ACTIVE)
  ) {
    return (
      <DashboardLayout>
        <div className='flex justify-between items-center'>
          <div />
          {/* <StyledIcon icon='mdi:arrow-left' onClick={goBack} /> */}
          <h2 className='text-2xl font-bold'>Partner Details</h2>
          <div className='flex items-center gap-4'>
            <StyledIcon icon='mdi:refresh' onClick={handleRefresh} />

            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        </div>

        <div className='mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_max-content] '>
          <div className='order-2 lg:order-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* the image's source domain is not uniform, so we can't use next/image here 
          unless we add the domains to the next.config.js file */}
              <img
                src={getImgUrl(partner.image?.url)}
                alt={partner.name}
                className='w-full rounded-lg max-w-[200px]'
              />

              <div className='flex flex-col gap-2 px-4 text-white'>
                <p className='text-lg font-bold'>Name: </p>
                <p>{partner.name}</p>
                <p className='text-lg font-bold'>Details</p>
                {partner.description && (
                  <ReactMarkdown>{partner.description}</ReactMarkdown>
                )}

                <p className='text-lg font-bold'>Website: </p>
                <p>{partner.link}</p>
              </div>
            </div>
          </div>
          <div className='order-1 lg:order-2'>
            <div className='flex flex-col items-center gap-4 lg:items-end'>
              <div className='flex w-full justify-between sm:justify-end'>
                {/* {matches && <StyledIcon icon='mdi:arrow-back' onClick={goBack} />} */}

                <p className='text-md text-gray-400'>Status: {status}</p>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <CreatePartner
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        partner={partner}
      />
    </DashboardLayout>
  )
}
