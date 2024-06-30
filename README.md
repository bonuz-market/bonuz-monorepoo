# Bonuz Monorepo

Run the following command:

```sh
pnpm dev
```

## Installing a package

```bash
pnpm install:in <workspace-package-name> <package-name>
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `bonuz-id`: a [Next.js](https://nextjs.org/) app (in /apps) consumer web version of bonuz
- `app-bonuz-market`: a [Next.js](https://nextjs.org/) app (in /apps) business web dashboard of bonuz
- `@bonuz/smart-contracts`: Types, ABIs, SubGraphs, audits (in /@bonuz)
- `@bonuz/social-id`: React components & hooks library (which contains `<BonuzSocialId>` and `useSocialId()`) (in /@bonuz)
