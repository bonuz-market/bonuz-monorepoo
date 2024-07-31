// @ts-nocheck
'use client'

import CreateApp from '@/components/Apps-Games/CreateApp'
import DashboardLayout from '@/components/DashboardLayout'

import { useState } from 'react'

import { useQuery } from '@apollo/client'
import { ethers } from 'ethers'
import ReactMarkdown from 'react-markdown'
import { useQueryApps } from '@/hooks/queries'
import LoadingSpinner from '@/components/LoadingSpinner'
import StyledIcon from '@/components/StyledIcon'
import Button from '@/components/Button'
import { getImgUrl } from '@/utils/getImgUrl'
import { GET_APP_NEW_QUERY } from '@/lib/graphql-queries'
import { useParams } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'
import { App, CheckIns } from '@/types'

type NetworkNames = Record<
 string,
  {
    name: string
    token: string
  }
>

type TokenGating = Record<string, string>

const AppDetails = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { token } = useSessionStore.getState()
  const { id } = useParams()

  const {
    data,
    loading: queryLoading,
    refetch,
  } = useQuery<{
    App: App
  }>(GET_APP_NEW_QUERY, {
    variables: {
      id: Number(id),
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const app = data?.App

  const handleRefresh = () => {
    refetch()
  }

  const networksNames: NetworkNames = {
    _137: {
      name: 'Polygon',
      token: 'MATIC',
    },
    _1: {
      name: 'Ethereum',
      token: 'ETH',
    },
    _97: {
      name: 'BNB',
      token: 'BNB',
    },
  }

  const tokenGating: TokenGating = {
    NO: 'None',
    AT_LEAST_X: 'Based on Quantity',
    AT_LEAST_X_NATIVE: 'Based on Balance',
  }

  if (queryLoading)
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <LoadingSpinner />;
      </div>
    )

  if (!app)
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <h1>App not found</h1>{' '}
      </div>
    )

  if (!isEditing && app) {
    return (
      <>
        <div className='flex justify-between items-center'>
          <div />
          {/* <StyledIcon icon='mdi:arrow-left' onClick={goBack} /> */}
          <h2 className='text-lg'>App Details</h2>
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
                src={getImgUrl(app.image?.url)}
                alt={app.name}
                className='w-full rounded-lg'
              />

              <div className='flex flex-col gap-2 px-4 text-white'>
                <div className='flex items-center justify-start gap-4'>
                  <p className='text-lg font-bold'>Name: </p>
                  <p>{app.name}</p>
                </div>
                {/* <p className='text-lg font-bold'>Details</p>
                {app.description && (
                  <ReactMarkdown>{app.description}</ReactMarkdown>
                )} */}

                <div className='flex items-center justify-start gap-4'>
                  <p className='text-lg font-bold'>Link: </p>
                  <a
                    href={app.link}
                    className='cursor-pointer underline text-meta-5'>
                    {app.link}
                  </a>
                </div>
                <div className='flex items-center justify-start gap-4'>
                  <p className='text-lg font-bold'> Token Gating: </p>
                  <p>{tokenGating[app.tokenGating]}</p>
                </div>

                {app.tokenGating === 'AT_LEAST_X' && (
                  <>
                    <div className='flex items-center justify-start gap-4'>
                      <p className='text-lg font-bold'> Contract: </p>
                      <p>{app.contractAddress}</p>
                    </div>

                    <div className='flex items-center justify-start gap-4'>
                      <p className='text-lg font-bold'>
                        {' '}
                        Token Gating Amount:{' '}
                      </p>
                      <p>{app.tokenGatingAmount}</p>
                    </div>

                    <div className='flex items-center justify-start gap-4'>
                      <p className='text-lg font-bold'> Network: </p>
                      <p>
                        {networksNames[app.network].name ?? 'Unknown Network'}
                      </p>
                    </div>
                  </>
                )}

                {app.tokenGating === 'AT_LEAST_X_NATIVE' && (
                  <>
                    <div className='flex items-center justify-start gap-4'>
                      <p className='text-lg font-bold'>
                        {' '}
                        Token Gating Amount:{' '}
                      </p>
                      <p>{app.tokenGatingAmount}</p>
                    </div>

                    <div className='flex items-center justify-start gap-4'>
                      <p className='text-lg font-bold'> Network: </p>
                      <p>
                        {networksNames[app.network].name ?? 'Unknown Network'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* <div className='order-1 lg:order-2'>
            <div className='flex flex-col items-center gap-4 lg:items-end'>
              <div className='flex w-full justify-between sm:justify-end'>
                <p className='text-md text-gray-400'>Status: {status}</p>
              </div>
            </div>
          </div> */}
        </div>

        <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <CheckInsTable
            checkIns={app?.check_ins}
            onClick={() => {
              //
            }}
          />
        </div>
      </>
    )
  }
  // if (status === NewPartnerStatus.ACTIVE) {
  //   return <ListApps />;
  // }
  return <CreateApp isEditing={isEditing} app={app} />
}

// ---------------------------------

const formatDateString = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })


const CheckInsTable = ({
  checkIns,
  onClick,
}: {
  checkIns: CheckIns[]
  onClick: () => void
}) => {
  const formatHandle = (handle: string) => {
    if (ethers.utils.isAddress(handle)) {
      return `${handle.slice(0, 6)}...${handle.slice(-4)}`
    }

    return handle
  }

  return (
    <div className='rounded-sm glass px-5 pt-6 pb-2.5 sm:px-7.5 xl:pb-1 min-h-[200px]'>
      <h4 className='mb-6 text-xl font-semibold text-black dark:text-white'>
        Check-Ins
      </h4>

      <div className='flex flex-col'>
        <div className='grid grid-cols-[1fr_1fr] rounded-sm bg-gray-2 dark:bg-meta-4'>
          <div className='p-2.5 xl:p-5'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>
              Name
            </h5>
          </div>
          <div className='p-2.5 text-center xl:p-5'>
            <h5 className='text-sm font-medium uppercase xsm:text-base'>
              Date
            </h5>
          </div>
        </div>

        {checkIns.map((checkIn) => {
          const handle =
            checkIn?.user?.handle ?? checkIn?.user?.smartAccountAddress

          const formattedHandle = formatHandle(handle)

          return (
            <div key={checkIn.id}>
              <div className='grid grid-cols-[1fr_1fr]  border-b border-stroke dark:border-strokedark'>
                <div className='flex items-center gap-3 p-2.5 xl:p-5'>
                  <div className='flex-shrink-0'>
                    {ethers.utils.isAddress(handle) ? (
                      <p>{formattedHandle}</p>
                    ) : (
                      <a
                        className='cursor-pointer underline'
                        href={`https://bonuz.id/${handle}`}
                        target='_blank'
                        rel='noreferrer'>
                        {formattedHandle}
                      </a>
                    )}
                  </div>
                </div>

                <div className='flex items-center justify-center p-2.5 xl:p-5'>
                  {formatDateString(checkIn?.createdAt)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default function Page() {
  return (
    <DashboardLayout>
      <AppDetails />
    </DashboardLayout>
  )
}
