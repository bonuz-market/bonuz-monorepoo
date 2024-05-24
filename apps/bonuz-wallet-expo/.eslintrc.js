// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:sonarjs/recommended-legacy', 'plugin:unicorn/recommended', 'prettier'],
  plugins: ['simple-import-sort', 'sonarjs', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'unicorn/better-regex': 'warn',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
          camelCase: true,
        },
      },
    ],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-module': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'react-hooks/exhaustive-deps': 'error',
  },
};
