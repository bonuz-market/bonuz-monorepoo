import { cn } from "@/lib/utils";
import * as React from "react";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
interface ICarouselProps {
    slides: any[];
    chachedSlides?: boolean;
    duration?: number;
    animationDuration?: number;
    animationTimingFunction?: string;
    animationDelay?: number;
    withNavigation?: boolean;
}

interface IAction {
    type: string;
    index?: number;
}

export default function ResultCarousel(props: ICarouselProps): React.ReactElement {
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + '<text style="display: none!important;">1</text>' + '</span>';
        },
    };

    React.useEffect(() => {
        console.log("props:", props.slides);
    }, [])
    return (

        <div className="relative w-full h-full p-1 flex flex-row gap-2 overflow-hidden">
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                slidesPerView={2}
                spaceBetween={30}
                loop={true}
                className="flex flex-row"
            >
                {(props.slides || []).map((data, index) => (
                    <SwiperSlide key={index} className="min-w-[250px] flex items-center justify-center">
                        <div className="flex flex-row w-[250px] h-[130px] min-w-[250px] rounded-2xl overflow-hidden">
                            <div className="relative flex w-[70%] bg-black">
                                <Image
                                    src={data.url}
                                    width={100}
                                    height={100}
                                    alt="Frame_Left_Url"
                                    className="w-full h-full"
                                />
                                <div className="absolute bottom-2 left-2 flex flex-col">
                                    <text className="text-[12px] font-semibold">{data.bottom_top_text}</text>
                                    <text className="text-[10px] font-normal">{data.bottom_bottom_text}</text>
                                </div>
                            </div>
                            <div className="flex w-[30%] bg-gradient-to-b from-[#EF5772] to-[#CD37A1] h-full flex-col items-center justify-center">
                                <div className="relative p-2 rounded-xl bg-white/10 flex justify-center">
                                    <Image
                                        src={data.left_url}
                                        alt={`Frame_right_${index}`}
                                        width={30}
                                        height={30}
                                        key={index}
                                    />
                                    {data.count && (
                                        <text className="absolute top-[-5px] right-[-5px] text-[10px] bg-[#FF0000] rounded-md p-[1px]">{data.count}</text>
                                    )}
                                </div>
                                <text className="text-[12px] font-normal">{data.left_top_text}</text>
                                <text className="text-[12px] font-normal">{data.left_bottom_text}</text>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper >
        </div >
    );
}

