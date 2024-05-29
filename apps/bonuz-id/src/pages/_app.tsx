import "@/styles/globals.css";

import type { AppProps } from "next/app";

const metadata = {
	name: "Next Starter Template",
	description: "A Next.js starter template with Web3Modal v3 + Wagmi",
	url: "https://web3modal.com",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};



export default function App({ Component, pageProps }: AppProps) {

	return (
		<Component {...pageProps} />
	);
}
