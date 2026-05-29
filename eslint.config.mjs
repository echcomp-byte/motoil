// Flat config (ESLint 9). Pulls Expo's preset and Prettier conflict-resolver.
import expoConfig from "eslint-config-expo/flat.js";
import prettier from "eslint-config-prettier";

export default [
  ...expoConfig,
  prettier,
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "dist/",
      "web-build/",
      "android/",
      "ios/",
      "supabase/migrations/",
    ],
  },
  {
    // Node scripts run on the host machine, not in RN — give them Node globals
    // so things like Buffer / process / require don't trip no-undef.
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
  },
];
