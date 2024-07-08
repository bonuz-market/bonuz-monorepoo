# bonuz-sdk

## Installation

```bash
npm install @bonuz/sdk
```

## Usage

```tsx
import { BonuzSocialId } from "@bonuz/sdk";

return (
	<WagmiProvider config={config}>
		<QueryClientProvider client={queryClient}>
			...
			<BonuzSocialId />
		</QueryClientProvider>
	</WagmiProvider>
);
```

Add to next.config.js

```javascript
const nextConfig = {
  ...
transpilePackages: ["@bonuz/sdk"],
};
```
