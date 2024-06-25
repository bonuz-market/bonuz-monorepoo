import { cn } from "@/lib/utils";
import { VoucherProps } from "@/store/voucherStore";
import * as React from "react";

interface ICarouselProps {
    slides: VoucherProps[];
    chachedSlides?: boolean;
    duration?: number;
    animationDuration?: number;
    animationTimingFunction?: string;
    animationDelay?: number;
    withNavigation?: boolean;
}

interface AnymationTypeProps {
    index: number;
    activeIndex: number;
    nextActiveIndex: number;
    duration: number;
    timingFunction: string;
    animationDelay: number;
}
interface ICarouselState {
    active: number;
    nextActive: number;
}

interface IAction {
    type: string;
    index?: number;
}

export default function Carousel(props: ICarouselProps): React.ReactElement {
    let [state, dispatch] = React.useReducer(
        (state: ICarouselState, action: IAction) => {
            switch (action.type) {
                case "NEXT":
                    return {
                        active: state.nextActive,
                        nextActive: (state.nextActive + 1) % props.slides.length
                    };
                case "CUSTOM":
                    return {
                        active: action.index!,
                        nextActive: (action.index! + 1) % props.slides.length
                    };
                default:
                    throw new Error();
            }
        },
        { active: 0, nextActive: 1 }
    );

    return (
        <div className="relative overflow-hidden w-full">
            <div className="flex h-[200px] justify-center p-4 gap-10">
                {(props.slides || []).map((slide, index) => (
                    <div
                        key={index}
                        style={{
                            ...getAnimationStyle({
                                index,
                                activeIndex: state.active,
                                nextActiveIndex: state.nextActive,
                                duration: props.animationDuration || 700,
                                timingFunction: props.animationTimingFunction || "cubic-bezier(0.1, 0.99, 0.1, 0.99)",
                                animationDelay: props.animationDelay || 100
                            })
                        }}
                        className="flex justify-center items-center casuelItem absolute"
                    >
                        <div
                            className={cn(
                                "flex flex-row w-[280px] h-[160px] p-4 gap-2 rounded-[20px] bg-gradient-to-r from-[#009EFD] to-[#2AF598] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px]",
                            )}
                        >
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
                            <div className="flex w-full min-w-36">
                                {slide.backgroundImages.length === 1 &&
                                    <img
                                        src={slide.backgroundImages[0]}
                                        alt='backcard-voucher-title-img'
                                        className="h-[130px] w-[130px]"
                                    />
                                }
                                {
                                    slide.backgroundImages.length >= 4 && (
                                        <div className="flex gap-2">
                                            <div className="flex h-full flex-col gap-2">
                                                <img
                                                    src={slide.backgroundImages[0]}
                                                    alt='background-alt-1'
                                                    className="h-[60px] w-[70px]"
                                                />
                                                <img
                                                    src={slide.backgroundImages[1]}
                                                    alt='background-alt-2'
                                                    className="h-[60px] w-[70px]"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <img
                                                    src={slide.backgroundImages[2]}
                                                    alt='background-alt-3'
                                                    className="h-[45px] w-[60px]"
                                                />
                                                <img
                                                    src={slide.backgroundImages[3]}
                                                    alt='background-alt-4'
                                                    className="h-[45px] w-[60px]"
                                                />
                                                <div className="h-[45px] w-[60px] rounded-xl justify-center flex text-center items-center bg-[#CBA6F7]">
                                                    <text>{slide.count - 4}+</text>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div >
                    </div>
                ))}
            </div>
            {props.withNavigation && (
                <div className="flex justify-center z-10 mt-4 gap-2">
                    {props.slides.map((slide, index) => (
                        <button
                            key={`${index}`}
                            className={`bg-white rounded-md ${index === state.active ? "w-8 h-2" : "h-2 w-2"
                                }`.trim()}
                            onClick={(e: React.SyntheticEvent) =>
                                dispatch({ type: "CUSTOM", index })
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function getAnimationStyle({
    index,
    activeIndex,
    nextActiveIndex,
    duration,
    timingFunction,
    animationDelay
}: AnymationTypeProps) {

    let transitionPostfix: string = `${duration / 1000}s ${timingFunction} ${animationDelay / 1000}s`;

    const isActive = index === activeIndex;
    const scale = isActive ? 1.1 : 1; // Adjust scale for active item
    let leftNumber = isActive ? 50 : (index - activeIndex) * 50;
    if (leftNumber < -50) leftNumber += 200;
    if (leftNumber > 150) leftNumber -= 200;
    const left = isActive ? `${leftNumber}px` : `${leftNumber}%`;

    const style: React.CSSProperties = {
        transform: `scale(${scale})`,
        left: left,
        opacity: leftNumber <= -0 || leftNumber >= 100 ? 0 : 1,
        transition: `transform ${transitionPostfix}, left ${transitionPostfix}`
    };

    return {
        ...style,
        zIndex: activeIndex === index ? 1 : 0
    };
}
