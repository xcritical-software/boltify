const [{
  rules
}] = require('@xcritical/eslint-plugin-xc-front-lint/overrides/typescript');

module.exports = {
  extends: ['plugin:@xcritical/eslint-plugin-xc-front-lint/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    ...rules,
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unnecessary-condition': ['error', { ignoreRhs: true }]
  },
  plugins: ['@typescript-eslint']
};