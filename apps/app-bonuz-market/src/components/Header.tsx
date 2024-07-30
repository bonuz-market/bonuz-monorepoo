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


        <ConnectButton />
      </div>
    </>
  );
};

export default Header;
