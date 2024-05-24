// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:sonarjs/recommended-legacy', 'plugin:unicorn/recommended', 'prettier'],
  plugins: ['simple-import-sort', 'sonarjs', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'unicorn/better-regex': 'warn',
  },
};
