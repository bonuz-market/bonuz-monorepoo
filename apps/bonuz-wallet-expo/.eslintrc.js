// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:sonarjs/recommended-legacy', 'plugin:unicorn/recommended', 'prettier'],
  plugins: ['simple-import-sort', 'import', 'sonarjs', 'prettier'],
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
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
};
