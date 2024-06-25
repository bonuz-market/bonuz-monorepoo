import { cn } from "@/lib/utils";
import { VoucherProps } from "@/store/voucherStore";
import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
interface ICarouselProps {
    slides: VoucherProps[];
    chachedSlides?: boolean;
    duration?: number;
    animationDuration?: number;
    animationTimingFunction?: string;
    animationDelay?: number;
    withNavigation?: boolean;
}

export default function Carousel(props: ICarouselProps): React.ReactElement {
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + '<text style="display: none!important;">1</text>' + '</span>';
        },
    };

    return (
        <div className="relative overflow-hidden w-full">
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                slidesPerView={3}
                spaceBetween={30}
                loop={true}
                className="flex flex-row"
            >
                {(props.slides || []).map((slide, index) => (
                    <SwiperSlide key={index} className={cn(
                        "flex flex-row p-4 gap-2 rounded-[20px] bg-gradient-to-r from-[#009EFD] to-[#2AF598] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px]",
                    )}>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-[60px] h-[60px] justify-center items-start p-4 bg-blend-overlay rounded-[70px]">
                                <img
                                    src={slide.logoUrl}
                                    alt="card-1-img"
                                    className="w-[50px] h-[50px]"
                                />
                            </div>
                            <div className="mt-3 text-base font-semibold tracking-tight leading-6 text-white w-full">
                                {slide.title}
                            </div>
                            <div className="text-sm tracking-tight leading-4 text-white">
                                {slide.count} items
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div >
    );
}

