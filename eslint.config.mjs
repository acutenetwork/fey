import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**", "playground/**", "**/*.js", "**/*.mjs", "**/*.json", "**/*.md"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
