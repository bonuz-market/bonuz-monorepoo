'use client'
import ListPartnerApps from '@/components/Apps-Games/List'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQueryApps } from '@/hooks/queries'
import { GET_NEW_PARTNER_QUERY_BY_ID } from '@/lib/graphql-queries'
import { useSessionStore } from '@/store/sessionStore'
import { Partner } from '@/types'
import { useQuery } from '@apollo/client'
import { useParams } from 'next/navigation'

interface Props {}

const Apps = (props: Props) => {
  const { partnerId } = useParams()
  const { token } = useSessionStore.getState()

  const {
    data,
    loading: isLoading,
    refetch,
  } = useQuery<{
    Partner: Partner
  }>(GET_NEW_PARTNER_QUERY_BY_ID, {
    variables: {
      id: Number(partnerId),
    },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const partner = data?.Partner
  // const { data: apps} = useQueryApps();

  if (isLoading)
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    )
  if (!partner) return <div>Partner not found </div>

  return (
    <div>
      <ListPartnerApps partner={partner} />
    </div>
  )
}

export default function Page() {
  return (
    <DashboardLayout>
      <Apps />
    </DashboardLayout>
  )
}
