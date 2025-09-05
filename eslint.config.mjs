// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // ignore build artifacts
  //{ ignores: ["dist/**", "node_modules/**"] },
  { ignores: ["dist/**", "node_modules/**", "ecosystem.config.js", "deploy/**"] },

  // JS recommended
  js.configs.recommended,

  // TypeScript recommended (no type-aware rules; fast + simple)
  ...tseslint.configs.recommended,

  // Project rules
  {
    files: ["**/*.ts"],
    plugins: { import: pluginImport },
    rules: {
      "import/order": ["error", { "newlines-between": "always" }],
      // ignore unused params that start with underscore (e.g., _next)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // turn off formatting-related lint rules so Prettier owns formatting
  eslintConfigPrettier,
];
