'use client'
import ListPartnerApps from '@/components/Apps-Games/List'
import DashboardLayout from '@/components/DashboardLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useQueryApps } from '@/hooks/queries'

interface Props {}

const Apps = (props: Props) => {
  const { data, refetch, isLoading } = useQueryApps();

  if (isLoading)
    return (
      <div className='h-[50vh] flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    )

  return (
    <div>
      <ListPartnerApps data={data} />
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