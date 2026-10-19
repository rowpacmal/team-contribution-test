import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["node_modules/", "dist/"] },
  js.configs.recommended,
  tseslint.configs.strict,
  reactHooks.configs.flat.recommended,

  // File naming (CONTRIBUTING.md Part 5). Later blocks override earlier ones.
  {
    files: ["**/*.{ts,js}"],
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": [
        "error",
        { case: "kebabCase", checkDirectories: false },
      ],
    },
  },
  {
    files: ["**/hooks/**/*.ts"],
    rules: {
      "unicorn/filename-case": [
        "error",
        { case: "camelCase", checkDirectories: false },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": [
        "error",
        { case: "pascalCase", checkDirectories: false },
      ],
    },
  },
);
