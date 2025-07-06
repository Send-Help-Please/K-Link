// eslint.config.js
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignore build output and dependencies
  {
    ignores: ["dist/**", "build/**", "node_modules/**"]
  },

  // Base JS/TS configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // Recommended overrides
      "no-unused-vars": "off", // handled by TS plugin
      "@typescript-eslint/no-unused-vars": ["warn"],

      // Optional: stricter practices
      "no-console": "warn",
      "eqeqeq": ["error", "always"]
    }
  }
]);
