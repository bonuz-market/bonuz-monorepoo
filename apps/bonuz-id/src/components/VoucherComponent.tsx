import { VoucherProps } from "@/store/voucherStore";
import { cn } from "@/lib/utils";

interface VoucerComponentProps {
    voucher: VoucherProps;
}
export default function VoucherComponent({ voucher }: VoucerComponentProps) {
    return (
        <div
            className={cn(
                "flex flex-row w-full h-[160px] p-4 gap-2 rounded-[20px] bg-gradient-to-r from-[#009EFD] to-[#2AF598] shadow-[0px_0px_0px_0px_rgba(0,0,0,0.00),-80px_104px_53px_0px_rgba(0,0,0,0.01),-45px_59px_44px_0px_rgba(0,0,0,0.05),-20px_26px_33px_0px_rgba(0,0,0,0.09),-5px_7px_18px_0px_rgba(0,0,0,0.10)] backdrop-blur-[20px] ",
            )}
        >
            <div className="flex flex-col">
                <div className="flex flex-col justify-center items-start p-4 bg-blend-overlay rounded-[70px]">
                    <img
                        src={voucher.logoUrl}
                        alt="card-1-img"
                        className="w-[50px] h-[50px]"
                    />
                </div>
                <div className="mt-3 text-base font-semibold tracking-tight leading-6 text-white">
                    {voucher.title}
                </div>
                <div className="text-sm tracking-tight leading-4 text-white">
                    {voucher.count} items
                </div>
            </div>
            <div className="flex">
                {voucher.backgroundImages.length === 1 &&
                    <img
                        src={voucher.backgroundImages[0]}
                        alt='backcard-voucher-title-img'
                        className="h-[130px] w-[130px]"
                    />
                }
                {
                    voucher.backgroundImages.length >= 4 && (
                        <div className="flex gap-2">
                            <div className="flex h-full flex-col gap-2">
                                <img
                                    src={voucher.backgroundImages[0]}
                                    alt='background-alt-1'
                                    className="h-[60px] w-auto"
                                />
                                <img
                                    src={voucher.backgroundImages[1]}
                                    alt='background-alt-2'
                                    className="h-[60px] w-auto"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <img
                                    src={voucher.backgroundImages[2]}
                                    alt='background-alt-3'
                                    className="h-[45px] w-[60px]"
                                />
                                <img
                                    src={voucher.backgroundImages[3]}
                                    alt='background-alt-4'
                                    className="h-[45px] w-[60px]"
                                />
                                <div className="h-[45px] w-[60px] rounded-sm text-center">
                                    <text>{voucher.count - 4}+</text>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    )
}