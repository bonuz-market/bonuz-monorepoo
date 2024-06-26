import * as React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useRouter } from "next/navigation";

// Import Swiper styles
interface ICarouselProps {
    users: any[];
    chachedSlides?: boolean;
    duration?: number;
    animationDuration?: number;
    animationTimingFunction?: string;
    animationDelay?: number;
    withNavigation?: boolean;
}

export default function UserCarousel(props: ICarouselProps): React.ReactElement {
    const router = useRouter();

    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + '<text style="display: none!important;">1</text>' + '</span>';
        },
    };

    const getGradientClass = (index: number) => {
        switch (index % 4) {
            case 0:
                return "bg-gradient-to-r from-[#F67640] to-[#F14375]";
            case 1:
                return "bg-gradient-to-r from-[#009EFD] to-[#2AF598]";
            case 2:
                return "bg-gradient-to-r from-[#375F90] to-[#7335FF]";
            case 3:
                return "bg-gradient-to-r from-[#FFA34E] to-[#FFA110]";
            default:
                return "";
        }
    };

    return (
        <div className="relative overflow-hidden w-full">
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                slidesPerView={2}
                spaceBetween={30}
                loop={true}
                className="flex flex-row"
            >
                {(props.users || []).map((user, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className='rounded-[30px] bg-[#a2a2a20a] p-4 h-[165px] w-[300px] md:w-[450px] flex flex-row gap-4 justify-center items-center flex-1'
                            key={user.wallet}>
                            {user.profileImage ? <img
                                src={user.profileImage}
                                className='rounded-full w-[107px] h-[94px]'
                                alt="static-face"
                            /> : <div className='skeleton w-32 h-32'></div>}

                            <div className='flex flex-col w-full items-center gap-2'>
                                <p>{user.name}</p>
                                <p>@{user.handle}</p>
                                <button className='rounded-[30px] px-[8px] h-[35px] bg-custom-gradient-mint w-full text-[12px] md:text-[16px]'
                                    onClick={() => router.push(`/profile/${user.handle}`)}
                                >
                                    View Social ID Profile
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div >
    );
}

