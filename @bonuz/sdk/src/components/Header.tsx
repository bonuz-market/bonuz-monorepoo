
import { cn } from "@/lib/utils";
import ConnectButton from "./ConnectButton";

export const Header = () => {


  return (
    <>
      <div
        className={cn(
          "h-24 w-full",
          "px-8 py-6",
          "rounded-[40px]",
          "gap-5",
          "flex justify-between items-center"
        )}
      >
        <div
          className="hidden sm:flex gap-0.5 justify-between items-start self-stretch my-auto cursor-pointer"
          // onClick={() => router.push(`/`)}
        >
          <img src="/svg/Logo.svg" alt="logo" />
        </div>

        <ConnectButton />
      </div>
    </>
  );
};
