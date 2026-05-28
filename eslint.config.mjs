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
];
