'use client'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ListPartnerEvents from '@/components/Partner/ListPartnerEvents'
import { useQueryPartners } from '@/hooks/queries'
import React from 'react'

interface Props {}

const Events = (props: Props) => {
  const { data, refetch, isLoading } = useQueryPartners()
  const partner = data?.[0]
  const status = partner?.status

  if (isLoading)
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    )

  return (
    <div>
      <ListPartnerEvents partner={partner} />
    </div>
  )
}

export default function EventsPage() {
  return (
    <DashboardLayout>
      <Events />
    </DashboardLayout>
  )
}
