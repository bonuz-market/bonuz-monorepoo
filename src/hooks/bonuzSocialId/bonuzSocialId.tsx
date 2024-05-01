import { useReadContract } from "wagmi";
import { BonuzSocialIdAbi } from "./bonuzSociald.abi";
import {
	BONUZ_SOCIAL_ID_ADDRESS,
	BONUZ_SOCIAL_ID_CHAIN,
	SUPPORTED_PLATFORMS,
} from "./bonuzSocialId.config";
import { Address, parseAbi } from "viem";
import { prepareSocialId } from "./bonuzSociald.helpers";

export const useBonuzSocialWallet = (address?: Address) => {
	return useReadContract({
		abi: parseAbi(BonuzSocialIdAbi),
		address: BONUZ_SOCIAL_ID_ADDRESS,
		functionName: "getUserProfileAndSocialLinks",
		chainId: BONUZ_SOCIAL_ID_CHAIN.id,
		args: [address!, SUPPORTED_PLATFORMS],
		query: {
			enabled: !!address,
			select: prepareSocialId,
		},
	});
};
