import Image from 'next/image'; // Make sure to import the Image component
import { resultTypes } from "@/types/typeResult";
interface resultTypesProps {
    datas: resultTypes[];
    type: string;
    setDigitalTypesArray: (data: resultTypes[]) => void;
    setRealTypesArray: (data: resultTypes[]) => void;
}

export const ResultTypesComponent = ({ datas, type, setDigitalTypesArray, setRealTypesArray }: resultTypesProps) => {
    const onhandleCheck = (index: number) => {
        const updatedSource = [...datas];
        updatedSource[index] = {
            ...updatedSource[index],
            flag: !updatedSource[index].flag,
        };
        console.log("clicked:", updatedSource)
        if (type === 'digital') setDigitalTypesArray(updatedSource);
        else setRealTypesArray(updatedSource);
    }
    return (
        <div className="flex flex-col gap-1 pt-2 max-h-[240px] scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-900 scrollbar-track-black">
            {datas.length >= 1 && datas.map((data: resultTypes, index: number) => (
                <div
                    key={index} // Add a key for each item in the list
                    className="flex flex-row p-2 gap-4 max-w-[360px] bg-[#a2a2a20a] rounded-[16px] justify-between font-inter text-base font-normal leading-6 tracking-tight text-left px-[16px] py-[8px]"
                >
                    <div className="flex flex-row gap-2 text-[14px] justify-center items-center">
                        <p>{data.type}</p>
                        <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[12px]">
                            {data.count}
                        </div>
                    </div>
                    <Image
                        src={data.flag ? '/icons/checkBox-icon.svg' : '/icons/uncheckbox-icon.svg'}
                        width={20}
                        height={20}
                        alt="checkbox_icon"
                        onClick={() => onhandleCheck(index)}
                        className="cursor-pointer"
                    />
                </div>
            ))}
        </div>
    );
}
