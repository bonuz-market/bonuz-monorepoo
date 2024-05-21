import {
	DOMAINS,
	MESSAGING_APPS,
	SOCIAL_ACCOUNTS,
	UTILITY_TOOLS,
	VALIDATORS,
	WALLETS,
} from "../types/socialAccount";

import { Icon } from "@iconify-icon/react";
export const supportedLinks: Record<string, any> = {
	facebook: {
		handle: "",
		isPublic: true,
		type: "facebook",
	},
	instagram: {
		handle: "",
		isPublic: true,
		type: "instagram",
	},
	x: {
		handle: "",
		isPublic: true,
		type: "x",
	},
	tiktok: {
		handle: "",
		isPublic: true,
		type: "tiktok",
	},
	snapchat: {
		handle: "",
		isPublic: true,
		type: "snapchat",
	},
	linkedin: {
		handle: "",
		isPublic: true,
		type: "linkedin",
	},
	discord: {
		handle: "",
		isPublic: true,
		type: "discord",
	},
	pinterest: {
		handle: "",
		isPublic: true,
		type: "pinterest",
	},
	twitch: {
		handle: "",
		isPublic: true,
		type: "twitch",
	},
	reddit: {
		handle: "",
		isPublic: true,
		type: "reddit",
	},
	mastadon: {
		handle: "",
		isPublic: true,
		type: "mastadon",
	},
	youmeme: {
		handle: "",
		isPublic: true,
		type: "youmeme",
	},
	rumble: {
		handle: "",
		isPublic: true,
		type: "rumble",
	},
	youtube: {
		handle: "",
		isPublic: true,
		type: "youtube",
	},
	vk: {
		handle: "",
		isPublic: true,
		type: "vk",
	},
	qq: {
		handle: "",
		isPublic: true,
		type: "qq",
	},
};
export const ICONS_MAPPING = {
	[SOCIAL_ACCOUNTS.s_facebook]: (
		<Icon icon="mdi:facebook" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_x]: (
		<Icon icon="ri:twitter-x-line" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_tiktok]: (
		<Icon icon="simple-icons:tiktok" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_snapchat]: (
		<Icon icon="mdi:snapchat" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_instagram]: (
		<Icon icon="mdi:instagram" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_linkedin]: (
		<Icon icon="mdi:linkedin" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_discord]: (
		<Icon icon="mdi:discord" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_pinterest]: (
		<Icon icon="mdi:pinterest" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_twitch]: (
		<Icon icon="mdi:twitch" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_reddit]: (
		<Icon icon="mdi:reddit" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_mastadon]: (
		<Icon icon="mdi:mastodon" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_youmeme]: (
		<img
			src={require("./icons/platforms/youmeme.jpg").src}
			width={20}
			height={20}
			alt="youmeme"
		/>
	),
	[SOCIAL_ACCOUNTS.s_rumble]: (
		<Icon icon="simple-icons:rumble" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_youtube]: (
		<Icon icon="mdi:youtube" size={20} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_vk]: <Icon icon="mdi:vk" size={20} color="white" />,
	[SOCIAL_ACCOUNTS.s_qq]: <Icon icon="mdi:qqchat" size={20} color="white" />,
	[MESSAGING_APPS.m_whatsapp]: (
		<Icon icon="mdi:whatsapp" size={20} color="white" />
	),
	[MESSAGING_APPS.m_telegram]: (
		<Icon icon="mdi:telegram" size={20} color="white" />
	),
	[MESSAGING_APPS.m_signal]: <Icon icon="mdi:signal" size={20} color="white" />,
	[MESSAGING_APPS.m_weChat]: <Icon icon="mdi:wechat" size={20} color="white" />,
	[WALLETS.w_solana]: <Icon icon="formkit:solana" size={20} color="white" />,
	[WALLETS.w_btc]: <Icon icon="mdi:bitcoin" size={20} color="white" />,
	[WALLETS.w_near]: <Icon icon="simple-icons:near" size={20} color="white" />,
	[WALLETS.w_cardano]: (
		<Icon icon="simple-icons:cardano" size={20} color="white" />
	),
	// [WALLETS.w_venom]: 'mdi:venom',
	[WALLETS.w_walletConnect]: (
		<Icon icon="simple-icons:walletconnect" size={20} color="white" />
	),
	[WALLETS.w_sui]: (
		<img
			src={require("./icons/platforms/sui.png").src}
			width={20}
			height={20}
			alt="sui"
		/>
	),
	[WALLETS.w_aptos]: (
		<img
			src={require("./icons/platforms/aptos.png").src}
			width={20}
			height={20}
			alt="aptos"
		/>
	),
	[WALLETS.w_cosmos]: (
		<img
			src={require("./icons/platforms/cosmos.png").src}
			width={20}
			height={20}
			alt="cosmos"
		/>
	),
	[WALLETS.w_icp]: <Icon icon="cryptocurrency:icp" size={20} color="white" />,
	[WALLETS.w_doge]: (
		<Icon icon="simple-icons:dogecoin" size={20} color="white" />
	),
	[WALLETS.w_polkadot]: (
		<Icon icon="simple-icons:polkadot" size={20} color="white" />
	),
	[WALLETS.w_lukso]: (
		<img
			src={require("./icons/platforms/lukso.png").src}
			width={20}
			height={20}
			alt="lukso"
		/>
	),
	[UTILITY_TOOLS.u_notion]: (
		<Icon icon="simple-icons:notion" size={20} color="white" />
	),
	[UTILITY_TOOLS.u_figma]: (
		<Icon icon="ph:figma-logo" size={20} color="white" />
	),
	[UTILITY_TOOLS.u_cheatcodeLabel]: <></>,
	[UTILITY_TOOLS.u_aluna]: <></>,
	[VALIDATORS.v_idSign]: <></>,
	[VALIDATORS.v_lens]: (
		<img
			src={require("./icons/platforms/lens.png").src}
			width={20}
			height={20}
			alt="lens"
		/>
	),
	[VALIDATORS.v_polygonID]: (
		<Icon icon="devicon-plain:polygon" size={20} color="white" />
	),
	[VALIDATORS.v_uXXPass]: <></>,
	[VALIDATORS.v_blockpassKYC]: (
		<img
			src={require("./icons/platforms/blockpass.png").src}
			width={20}
			height={20}
			alt="blockpass"
		/>
	),
	[DOMAINS.d_ens]: <Icon icon="cryptocurrency:eth" size={20} color="white" />,
} satisfies Record<string, React.ReactNode>;
export const ICONS_MAPPING_SMALL = {
	[SOCIAL_ACCOUNTS.s_facebook]: (
		<Icon icon="mdi:facebook" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_x]: (
		<Icon icon="ri:twitter-x-line" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_tiktok]: (
		<Icon icon="simple-icons:tiktok" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_snapchat]: (
		<Icon icon="mdi:snapchat" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_instagram]: (
		<Icon icon="mdi:instagram" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_linkedin]: (
		<Icon icon="mdi:linkedin" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_discord]: (
		<Icon icon="mdi:discord" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_pinterest]: (
		<Icon icon="mdi:pinterest" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_twitch]: (
		<Icon icon="mdi:twitch" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_reddit]: (
		<Icon icon="mdi:reddit" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_mastadon]: (
		<Icon icon="mdi:mastodon" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_youmeme]: (
		<img
			src={require("./icons/platforms/youmeme.jpg").src}
			width={4}
			height={4}
			alt="youmeme"
		/>
	),
	[SOCIAL_ACCOUNTS.s_rumble]: (
		<Icon icon="simple-icons:rumble" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_youtube]: (
		<Icon icon="mdi:youtube" size={16} color="white" />
	),
	[SOCIAL_ACCOUNTS.s_vk]: <Icon icon="mdi:vk" size={16} color="white" />,
	[SOCIAL_ACCOUNTS.s_qq]: <Icon icon="mdi:qqchat" size={16} color="white" />,
	[MESSAGING_APPS.m_whatsapp]: (
		<Icon icon="mdi:whatsapp" size={16} color="white" />
	),
	[MESSAGING_APPS.m_telegram]: (
		<Icon icon="mdi:telegram" size={16} color="white" />
	),
	[MESSAGING_APPS.m_signal]: <Icon icon="mdi:signal" size={16} color="white" />,
	[MESSAGING_APPS.m_weChat]: <Icon icon="mdi:wechat" size={16} color="white" />,
	[WALLETS.w_solana]: <Icon icon="formkit:solana" size={16} color="white" />,
	[WALLETS.w_btc]: <Icon icon="mdi:bitcoin" size={16} color="white" />,
	[WALLETS.w_near]: <Icon icon="simple-icons:near" size={16} color="white" />,
	[WALLETS.w_cardano]: (
		<Icon icon="simple-icons:cardano" size={16} color="white" />
	),
	// [WALLETS.w_venom]: 'mdi:venom',
	[WALLETS.w_walletConnect]: (
		<Icon icon="simple-icons:walletconnect" size={16} color="white" />
	),
	[WALLETS.w_sui]: (
		<img
			src={require("./icons/platforms/sui.png").src}
			width={4}
			height={4}
			alt="sui"
		/>
	),
	[WALLETS.w_aptos]: (
		<img
			src={require("./icons/platforms/aptos.png").src}
			width={4}
			height={4}
			alt="aptos"
		/>
	),
	[WALLETS.w_cosmos]: (
		<img
			src={require("./icons/platforms/cosmos.png").src}
			width={4}
			height={4}
			alt="cosmos"
		/>
	),
	[WALLETS.w_icp]: <Icon icon="cryptocurrency:icp" size={16} color="white" />,
	[WALLETS.w_doge]: (
		<Icon icon="simple-icons:dogecoin" size={16} color="white" />
	),
	[WALLETS.w_polkadot]: (
		<Icon icon="simple-icons:polkadot" size={16} color="white" />
	),
	[WALLETS.w_lukso]: (
		<img
			src={require("./icons/platforms/lukso.png").src}
			width={4}
			height={4}
			alt="lukso"
		/>
	),
	[UTILITY_TOOLS.u_notion]: (
		<Icon icon="simple-icons:notion" size={16} color="white" />
	),
	[UTILITY_TOOLS.u_figma]: (
		<Icon icon="ph:figma-logo" size={16} color="white" />
	),
	[UTILITY_TOOLS.u_cheatcodeLabel]: <></>,
	[UTILITY_TOOLS.u_aluna]: <></>,
	[VALIDATORS.v_idSign]: <></>,
	[VALIDATORS.v_lens]: (
		<img
			src={require("./icons/platforms/lens.png").src}
			width={4}
			height={4}
			alt="lens"
		/>
	),
	[VALIDATORS.v_polygonID]: (
		<Icon icon="devicon-plain:polygon" size={16} color="white" />
	),
	[VALIDATORS.v_uXXPass]: <></>,
	[VALIDATORS.v_blockpassKYC]: (
		<img
			src={require("./icons/platforms/blockpass.png").src}
			width={4}
			height={4}
			alt="blockpass"
		/>
	),
	[DOMAINS.d_ens]: <Icon icon="cryptocurrency:eth" size={16} color="white" />,
} satisfies Record<string, React.ReactNode>;
