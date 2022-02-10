// Inspired by https://robertcooper.me/post/using-eslint-and-prettier-in-a-typescript-project

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  rules: {
    "import/newline-after-import": ["error", { count: 1 }],
    "import/order": [
      "error",
      {
        warnOnUnassignedImports: true,
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
