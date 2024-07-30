import React from 'react'
import { useRouter } from 'next/navigation'

const SIDE_BAR_ITEMS = [
  {
    name: 'Partner Profile',
    logo: '/svg/side-bar/partner-profile.svg',
    route: '/',
  },
  {
    name: 'Events',
    logo: '/svg/side-bar/events.svg',
    route: '/partners/events',
  },
  {
    name: 'Apps & Games',
    logo: '/svg/side-bar/apps-games.svg',
    route: '/apps-games',
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

interface Props {}

const Sidebar = (props: Props) => {
  const router = useRouter()

  return (
    <div>
       <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 h-[70vh]">
        {SIDE_BAR_ITEMS.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between px-4 py-2 cursor-pointer'
            onClick={() => router.push(item.route)}>
            <div className='flex items-center gap-2'>
              <img src={item.logo} className='w-6 h-6 mr-4' alt={item.name}/>
              <span>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar