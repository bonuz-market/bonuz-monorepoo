// Learn more https://docs.expo.dev/guides/monorepos
// eslint-disable-next-line unicorn/import-style
import { join, resolve } from 'node:path';

import { getDefaultConfig } from 'expo/metro-config';
import { FileStore } from 'metro-cache';

// eslint-disable-next-line no-undef
const projectRoot = __dirname;
const workspaceRoot = resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot];
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  resolve(projectRoot, 'node_modules'),
  resolve(workspaceRoot, 'node_modules'),
];

config.resolver = {
  ...config.resolver,
  fs: require.resolve('react-native-fs'),
  'node:fs': require.resolve('react-native-fs'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  assert: require.resolve('assert'),
};

config.resolver.sourceExts.push('mjs');

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  fs: require.resolve('react-native-fs'),
  'node:fs': require.resolve('react-native-fs'),

  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  assert: require.resolve('assert'),
};

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({
    root: join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

config.transformer.getTransformOptions = () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

export default config;
