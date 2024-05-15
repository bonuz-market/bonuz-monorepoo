import { isBonuzWallet } from "../hooks/bonuzSocialId/bonuzSociald.helpers";
import { useWalletInfo } from "@web3modal/wagmi/react";

import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { HiXCircle } from "react-icons/hi";
import { useAccount } from "wagmi";

interface BonuzIdModalProps {
	address: string;
}
const BonuzIdModal = ({ address }: BonuzIdModalProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen((state: boolean) => !state)}
				type="button"
				style={{
					padding: "0.5rem",
					borderRadius: "9999px",
					borderStyle: "none",
					backgroundColor: "#6366F1",
					cursor: "pointer",
					boxShadow:
						"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
				}}
			>
				{!isOpen ? (
					<img
						src={"https://bonuz.market/_next/static/media/icon-1.d33d96ee.svg"}
						width={48}
						height={48}
						alt="bonuz"
					/>
				) : (
					<HiXCircle size={48} />
				)}
			</button>
			<Transition appear show={isOpen} as={Fragment}>
				<div
					style={{
						overflowY: "auto",
						position: "fixed",
						right: "1rem",
						bottom: "6rem",
					}}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<iframe
							src={`https://bonuz.id/${address}`}
							width="400px"
							height="450px"
							style={{
								borderRadius: "0.25rem",
								borderStyle: "none",
								backgroundColor: "#1F2937",
							}}
						/>
					</Transition.Child>
				</div>
			</Transition>
		</>
	);
};

export const BonuzSocialId = () => {
	const { walletInfo } = useWalletInfo();
	const isEnabled = !!walletInfo?.name && isBonuzWallet(walletInfo.name);
	const { address } = useAccount();

	if (!isEnabled) return null;

	return (
		<div style={{ position: "fixed", right: "1rem", bottom: "1rem" }}>
			<BonuzIdModal address={address!} />
		</div>
	);
};
