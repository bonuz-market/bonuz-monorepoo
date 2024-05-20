# Bonuz Private Monorepo

how to use [Monorepos & Workspace](https://turbo.build/repo/docs/core-concepts/monorepos/configuring-workspaces)?

## Using this example

Run the following command:

```sh
pnpm dev
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `admin-bonuz-xyz`: an [Express](https://expressjs.com/) server with payloadcms and graphql (in /apps)
- `bonuz-id`: a [Next.js](https://nextjs.org/) app (in /apps)
- `partner-bonuz-xyz`: a [Vite](https://vitejs.dev/) single page app (in /apps)
- `@bonuz/smart-contracts`: Types, ABIs, SubGraphs, audits
- `@bonuz/social-id`: React components & hooks library (which contains `<BonuzSocialId>` and `useSocialId()`)

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities


- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
