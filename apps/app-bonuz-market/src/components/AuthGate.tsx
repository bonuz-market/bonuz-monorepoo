import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'
import BiconomyButton from './Biconomy'
import useConnect from '@/hooks/useConnect'
import ConnectButton from './ConnectButton'
import DashboardLayout from './DashboardLayout'

interface Props {}

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { web3auth, isConnected, smartAccount } = useBiconomyShallowStore()
  const { isInitialized } = useConnect()

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

  // if (isInitialized && !smartAccount) {
  //   return <GuestView />
  // }

  if (!isConnected)
    return (
      <>
        <DashboardLayout>
          <div className='h-[60vh] flex items-center justify-center'>
            <ConnectButton />
          </div>
        </DashboardLayout>
      </>
    )

  return <>{children}</>
}

export default AuthGate
