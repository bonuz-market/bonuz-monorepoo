// @ts-nocheck
import React from "react";
import { useBiconomyShallowStore } from "@/hooks/useBiconomyShallowStore";
import useConnect from "@/hooks/useConnect";
import truncateAddress from "@/utils/truncateAddress";
import SignIn from "./SignIn";
import LogIn from "./LogIn";
interface Props {}

const ConnectButton = (props: Props) => {
  const {
    web3auth,
    isConnected,
    smartAccount,
    setSmartAccount,
    resetBiconomyStore,
  } = useBiconomyShallowStore();
  const { isInitialized } = useConnect();

  const logout = async () => {
    if (!web3auth) {
      console.error("Web3Modal not initialized.");

      return;
    }

    await web3auth.logout();
    setSmartAccount(null);

    resetBiconomyStore();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div
        className="text-base font-semibold tracking-tight leading-6 text-white backdrop-blur-[20px] bg-[linear-gradient(123deg,#E79413_-19.89%,#EA3E5B_48.73%,#FA0AF0_119.63%)] rounded-[30px] cursor-pointer w-[80px] sm:w-[135px] h-[40px] flex  flex-col items-center justify-center"
        onClick={() => {
          if (smartAccount) {
            logout();
          } else document.getElementById("my_modal_5").showModal();
        }}
      >
        <span>
          {smartAccount
            ? truncateAddress(smartAccount?.accountAddress || "")
            : "Login"}
        </span>
      </div>

      <dialog id="my_modal_5" className="modal sm:modal-middle">
        {/* <LogIn /> */}

        <div className="modal-box">
          {/* <SignIn /> */}
          <LogIn />
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ConnectButton;
