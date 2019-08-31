const overrides = require('@xcritical/eslint-plugin-xc-front-lint/overrides/typescript');

module.exports = {
  extends: ['plugin:@xcritical/eslint-plugin-xc-front-lint/base'],
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    ecmaFeatures: {
      jsx: true
    },
    "tsconfigRootDir": __dirname
  },
  overrides,
};
