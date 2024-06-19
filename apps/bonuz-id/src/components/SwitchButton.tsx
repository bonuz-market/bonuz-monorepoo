interface SwtichButtonProps {
    selectedOption: string;
    setSelectedOption: any;
    title: string[]
}
export default function SwitchButton({ selectedOption, setSelectedOption, title }: SwtichButtonProps) {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex h-[48px] rounded-full bg-[#9c9c9c1a] p-1'>
                {title.map((subtitle, index) => (
                    <div
                        key={index}
                        className={`flex w-1/2 rounded-full items-center text-center justify-center ${selectedOption === subtitle ? 'bg-white text-black' : 'bg-transparent text-white'}`}
                        onClick={() => setSelectedOption(subtitle)}
                    >
                        {subtitle}
                    </div>
                ))}
            </div>
        </div>
    )
}