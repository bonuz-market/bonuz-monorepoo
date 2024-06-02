// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('node:path');

// eslint-disable-next-line no-undef
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// #1 - Watch all files in the monorepo
config.watchFolders = [workspaceRoot];
// #2 - Try resolving with project modules first, then workspace modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver = {
  ...config.resolver,
  fs: require.resolve('react-native-fs'),
  'node:fs': require.resolve('react-native-fs'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  assert: require.resolve('assert'),
};

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
    root: path.join(projectRoot, 'node_modules', '.cache', 'metro'),
  }),
];

config.transformer.getTransformOptions = () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
