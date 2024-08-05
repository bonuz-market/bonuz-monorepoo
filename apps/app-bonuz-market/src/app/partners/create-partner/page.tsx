'use client'


import DashboardLayout from '@/components/DashboardLayout'
import CreatePartner from '@/components/Partner/CreatePartner'
import { useAppShallowStore } from '@/store/appStore'
import { Partner } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const { selectedPartner, setSelectPartner } = useAppShallowStore()

  const handleOnSave = (data: Partner) => { 
    setSelectPartner(data)
    router.push('/')
   }

  return (
    <DashboardLayout>
      <CreatePartner
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        partner={{}}
        handleOnSave={handleOnSave}
      />
    </DashboardLayout>
  )
}
