/* eslint-disable @next/next/no-img-element */
import { useQueryPartners } from '@/hooks/queries'
import clsxm from '@/lib/frontend/clsxm'
import { useAppShallowStore } from '@/store/appStore'
import { getImgUrl } from '@/utils/getImgUrl'
import { Icon } from '@iconify/react/dist/iconify.js'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'



interface Props {}

const Sidebar = (props: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const { data: partners, refetch, isLoading } = useQueryPartners()

  const { selectedPartner, setSelectPartner } = useAppShallowStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCreatePartner, setIsCreatePartner] = useState(false)

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  useEffect(() => {
    if (partners?.length === 0) {
      setSelectPartner(null)
      router.push('/partners/create-partner')
    }

    if (!selectedPartner && partners && !isCreatePartner) {
      setSelectPartner(partners[0])
    }
  }, [isCreatePartner, partners, router, selectedPartner, setSelectPartner])


  const SIDE_BAR_ITEMS = [
    {
      name: 'Partner Profile',
      logo: '/svg/side-bar/partner-profile.svg',
      route: '/',
    },
    {
      name: 'Events',
      logo: '/svg/side-bar/events.svg',
      route: `/partners/${selectedPartner?.id}/events`,
    },
    {
      name: 'Apps & Games',
      logo: '/svg/side-bar/apps-games.svg',
      route: `/partners/${selectedPartner?.id}/apps-games`,
    },
    {
      name: 'Campaigns',
      logo: '/svg/side-bar/campaigns.svg',
      route: '/campaigns',
    },
    {
      name: 'Membership',
      logo: '/svg/side-bar/membership.svg',
      route: '/membership',
    },
    {
      name: 'Loyalty Programs',
      logo: '/svg/side-bar/loyalty-programs.svg',
      route: '/loyalty-programs',
    },
    {
      name: 'Certificate Programs',
      logo: '/svg/side-bar/certificate-programs.svg',
      route: '/certificate-programs',
    },
  ]

  return (
    <div>
      <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 h-[70vh]">
        <div className='dropdown'>
          <div
            tabIndex={0}
            role='button'
            className='m-1 glass px-4 py-2'
            onClick={handleDropdownToggle}>
            {selectedPartner ? (
              <div className='flex items-center justify-start gap-4'>
                <img
                  src={getImgUrl(selectedPartner?.image?.url)}
                  alt={selectedPartner?.name}
                  className='h-[30px] rounded-lg'
                />
                <span className='flex-1'>{selectedPartner?.name}</span>

                <Icon icon='iconamoon:arrow-down-2-fill' />
              </div>
            ) : (
              <>
                <div className='flex items-center gap-2'>
                  <img
                    src={'/svg/side-bar/partner-profile.svg'}
                    className='w-6 h-6 mr-4'
                    alt='Partner Profile'
                  />
                  <span className='flex-1'>+ New Brand/ Partner</span>
                  <Icon icon='iconamoon:arrow-down-2-fill' />
                </div>
              </>
            )}
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className='dropdown-content menu z-[1] p-2 shadow glass w-full'>
              {partners?.map((partner) => (
                <li
                  key={partner.id}
                  onClick={() => {
                    setSelectPartner(partner)
                    router.push('/')
                    setIsDropdownOpen(false)
                  }}
                  className={clsxm('cursor-pointer', {
                    glass: selectedPartner?.id === partner.id,
                  })}>
                  <a className=''>
                    <img
                      src={getImgUrl(partner.image?.url)}
                      alt={partner.name}
                      className='h-[30px] rounded-lg'
                    />
                    {partner.name}
                  </a>
                </li>
              ))}
              <li
                className='py-2'
                onClick={() => {
                  setSelectPartner(null)
                  setIsDropdownOpen(false)
                  setIsCreatePartner(true)
                  router.push('/partners/create-partner')
                }}>
                <a className='py-4'>
                  <img
                    src={'/svg/side-bar/partner-profile.svg'}
                    className='w-6 h-6'
                    alt='Partner Profile'
                  />
                  + New Brand/ Partner
                </a>
              </li>
            </ul>
          )}
        </div>
        {SIDE_BAR_ITEMS.map((item, index) => (
          <div
            key={index}
            className={clsxm(
              'flex items-center justify-between px-4 py-2 cursor-pointer',
              {
                glass: pathname === item.route,
              }
            )}
            onClick={() => router.push(item.route)}>
            <div className='flex items-center gap-2'>
              <img src={item.logo} className='w-6 h-6 mr-4' alt={item.name} />
              <span>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
