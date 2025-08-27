// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  // ignore build artifacts
  { ignores: ["dist/**", "node_modules/**"] },

  // JS recommended
  js.configs.recommended,

  // TypeScript recommended (no type-aware rules; fast + simple)
  ...tseslint.configs.recommended,

  // Project rules
  {
    files: ["**/*.ts"],
    plugins: { import: pluginImport },
    rules: {
      // keep your import ordering from before
      "import/order": ["error", { "newlines-between": "always" }],
    },
  },

  // turn off formatting-related lint rules so Prettier owns formatting
  eslintConfigPrettier,
];
