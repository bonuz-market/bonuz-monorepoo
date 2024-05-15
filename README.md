# bonuz-social-id

## Installation

```bash
npm install @bonuz/social-id
```

## Usage

```tsx
import { BonuzSocialId } from "@bonuz/social-id";

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
transpilePackages: ["@bonuz/social-id"],
};
```
