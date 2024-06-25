import { cn } from "@/lib/utils";
import * as React from "react";
import Image from 'next/image';

interface ICarouselProps {
    slides: any[];
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

export default function ResultCarousel(props: ICarouselProps): React.ReactElement {
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
        <div className="overflow-hidden w-full h-full p-1 flex flex-row gap-2">
            {(props.slides || []).map((data, index) => (
                <div key={index} className='flex flex-row rounded-xl h-full w-[250px] flex items-center justify-center bg-black'>
                    <div className="relative flex flex-col w-[190px] h-full">
                        <Image
                            src={data.url}
                            alt={`Frame_left_${index}`}
                            width={100}
                            height={100}
                            key={index}
                            className="w-full h-full"
                        />
                        <div className="absolute bottom-2 left-2 flex flex-col">
                            <text className="text-[14px] font-semibold">{data.bottom_top_text}</text>
                            <text className="text-[14px] font-semibold">{data.bottom_middle_text}</text>
                            <text className="text-[12px] font-normal">{data.bottom_bottom_text}</text>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-[#EE5574] w-[60px] h-full">
                        <div className="relative p-2 rounded-xl bg-[#EC678E]">
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
            ))
            }
            {
                props.withNavigation && (
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
                )
            }
        </div >
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
    let leftNumber = isActive ? 10 : (index - activeIndex) * 50;
    if (leftNumber < -50) leftNumber += 200;
    if (leftNumber > 150) leftNumber -= 200;
    const left = isActive ? `${leftNumber}px` : `${leftNumber}%`;

    const style: React.CSSProperties = {
        transform: `scale(${scale})`,
        left: left,
        opacity: leftNumber < 0 || leftNumber >= 100 ? 0 : 1,
        transition: `transform ${transitionPostfix}, left ${transitionPostfix}`
    };

    return {
        ...style,
        zIndex: activeIndex === index ? 1 : 0
    };
}
