import { cn } from "@/lib/utils";
import ConnectButton from "./ConnectButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChangeEvent } from "react";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/s?query=${searchQuery}&filters=all`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      router.push(`/s?query=${value}&filters=all`);
    }
  };

  return (
    <>
      <div
        className={cn(
          "bg-[url('/images/header-bg.png')] bg-center bg-cover",
          "h-24 w-full",
          "px-8 py-6",
          "rounded-[40px]",
          "gap-5",
          "flex justify-between items-center"
        )}
      >
        <div
          className="hidden sm:flex gap-0.5 justify-between items-start self-stretch my-auto cursor-pointer"
          onClick={() => router.push(`/`)}
        >
          <img src="/svg/Logo.svg" alt="logo" />
        </div>
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full h-[40px] flex items-center justify-center p-3 pt-0 gap-2 rounded-[30px] border-2 pb-0 border-[#9651FF]">
            <Image
              src={"/icons/search.svg"}
              width={20}
              height={20}
              alt="search"
            />
            <input
              name="search"
              className="w-full outline-none bg-transparent font-inter text-base font-normal leading-6 tracking-tight text-left border-none py-10"
              placeholder="Search"
              value={searchQuery}
              onChange={handleChange}
              // onKeyDown={handleKeyDown}
            />
            <Image
              src={"/icons/arrow-cancle.png"}
              width={20}
              height={20}
              alt="cancle"
              className="cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                router.push(`/`);
              }}
            />
          </div>
        </div>

        <ConnectButton />
      </div>
    </>
  );
};

export default Header;
