import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import eslintJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    ...eslintJs.configs.recommended,
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      curly: "error",
    },
  },
];
