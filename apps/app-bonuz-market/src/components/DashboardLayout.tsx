import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-[100] pb-[13px] rounded-[40px] w-full flex bg-cover flex-col px-[15px] py-[15px] md:px-[25px] md:py-[35px] lg:py-[20px] bg-[url('/images/background.png')] mt-8 h-[70vh]">
      <div className='overflow-y-auto px-4'>{children}</div>
    </div>
  )
}

export default DashboardLayout
