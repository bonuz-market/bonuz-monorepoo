/* eslint-disable @next/next/no-img-element */
// @ts-nocheck
import React, { useState } from 'react'
import { useBiconomyShallowStore } from '@/hooks/useBiconomyShallowStore'
import useConnect from '@/hooks/useConnect'
import truncateAddress from '@/utils/truncateAddress'
import SignIn from './SignIn'
import { useQueryGetUserProfileAndSocialLinks } from '@/hooks/useBonuzContracts'
import { Icon } from '@iconify/react/dist/iconify.js'
import LoadingSpinner from './LoadingSpinner'
import BiconomyButton from './Biconomy'
interface Props {}

const ConnectButton = (props: Props) => {
  const {
    web3auth,
    isConnected,
    smartAccount,
    setSmartAccount,
    resetBiconomyStore,
  } = useBiconomyShallowStore()
  const { isInitialized } = useConnect()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data, isLoading } = useQueryGetUserProfileAndSocialLinks()

  const logout = async () => {
    if (!web3auth) {
      console.error('Web3Modal not initialized.')

      return
    }

    await web3auth.logout()
    setSmartAccount(null)

    resetBiconomyStore()
    localStorage.clear()
    window.location.reload()
  }
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  // if (web3auth?.status !== 'ready' && !isInitialized) {
  //   return (
  //     <>
  //       <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 h-[70vh]">
  //         <LoadingSpinner />
  //       </div>

  //       <div className='hidden'>
  //         <BiconomyButton />
  //       </div>
  //     </>
  //   )
  // }

  
  return (
    <>
    {/* {isLoading && (
        <div className='flex items-center justify-center w-[200px] h-[50px] glass p-2'>
        <LoadingSpinner />
        </div>
    )} */}
      {smartAccount?.accountAddress && !isLoading && (
        <>
          <div className='dropdown dropdown-end'>
            <div
              className='flex glass items-center justify-start p-2 w-[200px]'
              tabIndex={0}
              role='button'
              onClick={handleDropdownToggle}>
              <img
                src={data?.profileImage}
                className='w-10 rounded-full'
                alt='profile'
              />
              <div className='flex flex-col ml-2 flex-1'>
                <div className='text-lg font-bold tracking-tight leading-6 text-white'>
                  {data?.name}
                </div>
                <div className='text-sm font-semibold tracking-tight leading-6 text-white'>
                  @{data?.handle}
                </div>
              </div>
              <img
                src={'/svg/wallet-icon.svg'}
                className=''
                alt='wallet icon'
              />
            </div>

            {isDropdownOpen && (
              <div className='dropdown-content w-[300px] menu !z-[100000] p-2 shadow glass mt-2'>
                <div className='flex flex-col items-center justify-center'>
                  <img
                    src={data?.profileImage}
                    className='w-20 rounded-full'
                    alt='profile'
                  />
                  <div className='text-lg font-bold tracking-tight leading-6 text-white'>
                    {data?.name}
                  </div>
                  <div className='flex flex-col ml-2 flex-1'>
                    <div className='text-sm tracking-tight leading-6 text-white'>
                      @{data?.handle}
                    </div>
                  </div>
                  <div className='text-xs tracking-tight leading-6 text-white'>
                    {truncateAddress(smartAccount?.accountAddress || '')}
                  </div>

                  <a
                    href='https://bonuz.id'
                    className='glass flex items-center justify-start w-50 px-3 py-1 mt-2 gap-2'
                    target='_blank'
                    >
                    <Icon icon='material-symbols:edit' />
                    <span>Edit Profile in Bonuz.id</span>
                  </a>
                  <button
                    onClick={() => {
                      logout()
                    }}
                    className='glass flex items-center justify-start w-50 px-3 py-1 mt-2 gap-2'>
                    <Icon icon='material-symbols:lock' />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {!smartAccount?.accountAddress && (
        <>
          <div
            className='text-base font-semibold tracking-tight leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px] cursor-pointer w-[80px] sm:w-[135px] h-[40px] flex  flex-col items-center justify-center'
            onClick={() => {
              document.getElementById('my_modal_5').showModal()
              // if (smartAccount) {
              //   logout()
              // } else document.getElementById('my_modal_5').showModal()
            }}>
            <span>
              {/* {smartAccount
          ? truncateAddress(smartAccount?.accountAddress || '')
          : ''} */}
              Login
            </span>
          </div>
        </>
      )}

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <SignIn />

          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          {/* <div className='modal-action'>
            <button className="btn btn-primary" onClick={()=>document.getElementById('my_modal_5').close()}>Close</button>
          </div> */}
        </div>
      </dialog>
    </>
  )
}

export default ConnectButton
