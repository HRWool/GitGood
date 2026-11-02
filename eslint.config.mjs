// ESLint config for Git Good: plain browser scripts (no build step).
// js/*.js are classic <script> files that share globals, and every HTML page
// has an inline script that uses them, so eslint-plugin-html lints those too.
import js from "@eslint/js";
import html from "eslint-plugin-html";
import globals from "globals";

// Globals defined in js/data.js and js/app.js and shared by every page.
const shared = Object.fromEntries(
  ["SKILLS", "AVATARS", "DEFAULT_STATE", "FRESH_STATE", "BADGES", "QUESTS", "DAILY",
    "CLASSES", "LB_APP", "LB_CLASS", "LB_FRIENDS", "FEED", "PAGES", "GG"]
    .map((name) => [name, "readonly"])
);

export default [
  { ignores: ["node_modules/**"] },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.html"],
    plugins: { html },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...shared, confetti: "readonly" },
    },
    rules: {
      // Top-level declarations in shared scripts are used by other files.
      "no-unused-vars": ["warn", { vars: "local", args: "after-used" }],
      "no-redeclare": ["error", { builtinGlobals: false }],
    },
  },
];
