import { cn } from '@/lib/utils'
import { VoucherProps } from '@/store/voucherStore'
import * as React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'

// // Import Swiper styles
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'

interface ICarouselProps {
  slides: VoucherProps[]
  chachedSlides?: boolean
  duration?: number
  animationDuration?: number
  animationTimingFunction?: string
  animationDelay?: number
  withNavigation?: boolean
  setSwiperIndex: (index: number) => void
}

export default function Carousel(props: ICarouselProps): React.ReactElement {
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return (
        '<span class="' +
        className +
        '">' +
        '<text style="display: none!important;">1</text>' +
        '</span>'
      )
    },
  }

  const getGradientClass = (index: number) => {
    switch (index % 4) {
      case 0:
        return 'bg-gradient-to-r from-[#F67640] to-[#F14375]'
      case 1:
        return 'bg-gradient-to-r from-[#009EFD] to-[#2AF598]'
      case 2:
        return 'bg-gradient-to-r from-[#375F90] to-[#7335FF]'
      case 3:
        return 'bg-gradient-to-r from-[#FFA34E] to-[#FFA110]'
      default:
        return ''
    }
  }

  return (
    <div className='relative overflow-hidden w-full'>
      <Swiper
        pagination={pagination}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={3}
        spaceBetween={5}
        loop={true}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onActiveIndexChange={(index) => console.log('index', index)}
        onRealIndexChange={(swiperCore) => {
          // console.log('real index change', swiperCore.realIndex)
          props.setSwiperIndex(swiperCore.realIndex)
        }}
        // onSlideChange={() => console.log('slide change')}
        className='flex flex-row'>
        {(props.slides || []).map((slide, index) => (
          <SwiperSlide
            key={index}
            className={cn(
              'flex flex-row p-4 w-full gap-2 rounded-[20px] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px]',
              getGradientClass(index)
            )}>
            <div className='flex flex-col w-full'>
              <div className='flex flex-col w-[60px] h-[60px] justify-center items-start p-4 bg-blend-overlay rounded-[70px]'>
                <img
                  src={slide.logoUrl}
                  alt='card-1-img'
                  className='w-[50px] h-[50px]'
                />
              </div>
              <div className='mt-3 text-base font-semibold tracking-tight leading-6 text-white w-full'>
                {slide.title}
              </div>
              {/* <div className='text-sm tracking-tight leading-4 text-white'>
                {slide.count} items
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
