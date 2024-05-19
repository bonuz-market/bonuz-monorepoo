import { useAccount } from "wagmi";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useBonuzSocialId } from "@/hooks";
export const UserDetails = () => {
	const { address } = useAccount();
	const { data } = useBonuzSocialId({ address });

	if (!data || !address) return null;
	return (
		<div className="flex flex-col justify-end pt-2 bg-[linear-gradient(15deg,#0E2875_9.18%,#4B2EA2_90.82%)] max-w-[700px] rounded-[30px]">
			<div className="justify-center self-center px-4 py-1 text-2xl tracking-tight leading-7 text-center text-white">
				On-Chain Social ID
			</div>
			<div className="justify-center pr-3 pb-10 pl-3.5 w-full max-md:max-w-full">
				<div className="flex gap-5 max-md:flex-col max-md:gap-0">
					<div className="flex flex-col w-2/5 max-md:ml-0 max-md:w-full">
						<div className="flex flex-col tracking-tight text-white max-md:mt-10">
							<img
								loading="lazy"
								src={data?.profileImage}
								className="self-center max-w-full aspect-square w-[140px]"
							/>
							<div className="mt-4 text-3xl font-bold leading-8 text-center">
								{data?.name}
							</div>
							<div className="mt-2 text-sm leading-5 text-center">
								@{data?.handle}
							</div>
							<div className="flex gap-3 px-2.5 py-2 mt-3 text-base leading-6 whitespace-nowrap rounded-xl bg-blend-overlay backdrop-blur-[20px] bg-neutral-400">
								<div className="flex gap-2 justify-center">
									<img
										loading="lazy"
										src={data?.profileImage}
										className="shrink-0 w-6 aspect-square"
									/>
									<div className="text-ellipsis">
										{address.slice(0, 6)}...{address.slice(-4)}
									</div>
								</div>
								<img
									loading="lazy"
									src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d68f9cf667288c3458a02e9dcc8002458192be49096982ffdf6b2d4382606c2?"
									className="shrink-0 my-auto w-5 aspect-square"
								/>
							</div>
						</div>
					</div>
					<div className="flex flex-col ml-5 w-3/5 max-md:ml-0 max-md:w-full">
						<Accordion type="single" collapsible>
							<AccordionItem value="item-1">
								<AccordionTrigger>
									<div className="flex flex-1 gap-4">
										<div className="flex justify-center items-center p-1.5 w-10 h-10 bg-blue-600 rounded-xl">
											<img
												loading="lazy"
												src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
												className="w-7 aspect-square"
											/>
										</div>
										<div className="flex flex-1 gap-1 my-auto tracking-tight text-white">
											<div className="text-base leading-6 capitalize">
												Social media accounts
											</div>
											<div className="justify-center p-1 text-sm leading-4 text-center whitespace-nowrap bg-blend-overlay bg-neutral-400 rounded-[50px]">
												2
											</div>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									{Object.values(data.userSocials)
										.filter((social) => !!social.handle)
										.map((social) => (
											<div
												key={social.type}
												className="flex gap-3 p-3 w-full rounded-3xl bg-blend-overlay bg-neutral-400"
											>
												<div className="w-80 h-12 p-2 bg-neutral-400 rounded-xl backdrop-blur-2xl justify-start items-center gap-2 inline-flex">
													<div className="w-8 h-8 opacity-60 justify-center items-center flex">
														<img
															loading="lazy"
															src={
																"https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
															}
															className="w-7 aspect-square"
														/>
													</div>
													<div className="justify-start items-center gap-0.5 flex">
														<div className="opacity-70 text-white text-base font-normal font-['Inter'] leading-normal">
															{social.handle}
														</div>
													</div>
												</div>
											</div>
										))}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger>
									<div className="flex flex-1 gap-4">
										<div className="flex justify-center items-center p-1.5 w-10 h-10 bg-blue-600 rounded-xl">
											<img
												loading="lazy"
												src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
												className="w-7 aspect-square"
											/>
										</div>
										<div className="flex flex-1 gap-1 my-auto tracking-tight text-white">
											<div className="text-base leading-6 capitalize">
												Messaging Apps
											</div>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									{Object.values(data.userMessagingApps)
										.filter((social) => !!social.handle)
										.map((social) => (
											<div
												key={social.type}
												className="flex gap-3 p-3 w-full rounded-3xl bg-blend-overlay bg-neutral-400"
											>
												<div className="w-80 h-12 p-2 bg-neutral-400 rounded-xl backdrop-blur-2xl justify-start items-center gap-2 inline-flex">
													<div className="w-8 h-8 opacity-60 justify-center items-center flex">
														<img
															loading="lazy"
															src={
																"https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
															}
															className="w-7 aspect-square"
														/>
													</div>
													<div className="justify-start items-center gap-0.5 flex">
														<div className="opacity-70 text-white text-base font-normal font-['Inter'] leading-normal">
															{social.handle}
														</div>
													</div>
												</div>
											</div>
										))}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger>
									<div className="flex flex-1 gap-4">
										<div className="flex justify-center items-center p-1.5 w-10 h-10 bg-blue-600 rounded-xl">
											<img
												loading="lazy"
												src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
												className="w-7 aspect-square"
											/>
										</div>
										<div className="flex flex-1 gap-1 my-auto tracking-tight text-white">
											<div className="text-base leading-6 capitalize">
												Blockchain & Wallets
											</div>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									{Object.values(data.userWallets)
										.filter((social) => !!social.handle)
										.map((social) => (
											<div
												key={social.type}
												className="flex gap-3 p-3 w-full rounded-3xl bg-blend-overlay bg-neutral-400"
											>
												<div className="w-80 min-h-12 p-2 bg-neutral-400 rounded-xl backdrop-blur-2xl justify-start items-center gap-2 inline-flex">
													<div className="w-8 h-8 opacity-60 justify-center items-center flex">
														<img
															loading="lazy"
															src={
																"https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
															}
															className="w-7 aspect-square"
														/>
													</div>
													<div className="justify-start items-center gap-0.5 flex">
														<div className="opacity-70 text-white text-base font-normal font-['Inter'] leading-normal">
															{social.handle?.slice(0, 6)}...
															{social.handle?.slice(-4)}
														</div>
													</div>
												</div>
											</div>
										))}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-4">
								<AccordionTrigger>
									<div className="flex flex-1 gap-4">
										<div className="flex justify-center items-center p-1.5 w-10 h-10 bg-blue-600 rounded-xl">
											<img
												loading="lazy"
												src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
												className="w-7 aspect-square"
											/>
										</div>
										<div className="flex flex-1 gap-1 my-auto tracking-tight text-white">
											<div className="text-base leading-6 capitalize">
												Decentralized Identifiers
											</div>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									{Object.values(data.decentralizedIdentifiers)
										.filter((social) => !!social.handle)
										.map((social) => (
											<div
												key={social.type}
												className="flex gap-3 p-3 w-full rounded-3xl bg-blend-overlay bg-neutral-400"
											>
												<div className="w-80 h-12 p-2 bg-neutral-400 rounded-xl backdrop-blur-2xl justify-start items-center gap-2 inline-flex">
													<div className="w-8 h-8 opacity-60 justify-center items-center flex">
														<img
															loading="lazy"
															src={
																"https://cdn.builder.io/api/v1/image/assets/TEMP/ef642e4563756a93b400b6efba23427c9a8eed026cb231dbe4165461f8edb973?"
															}
															className="w-7 aspect-square"
														/>
													</div>
													<div className="justify-start items-center gap-0.5 flex">
														<div className="opacity-70 text-white text-base font-normal font-['Inter'] leading-normal">
															{social.handle}
														</div>
													</div>
												</div>
											</div>
										))}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			</div>
		</div>
	);
};
