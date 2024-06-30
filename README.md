# Bonuz Monorepo

how to use [Monorepos & Workspace](https://turbo.build/repo/docs/core-concepts/monorepos/configuring-workspaces)?

## Using this example

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

- `bonuz-id`: a [Next.js](https://nextjs.org/) app (in /apps)
- `app-bonuz-market`: a [Vite](https://vitejs.dev/) single page app (in /apps)
- `@bonuz/smart-contracts`: Types, ABIs, SubGraphs, audits
- `@bonuz/social-id`: React components & hooks library (which contains `<BonuzSocialId>` and `useSocialId()`)
