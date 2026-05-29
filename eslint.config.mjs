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
      // Sub-projects with their own tooling — never linted by the RN root.
      "web/",                    // Next.js project; own eslint-config-next
      "supabase/functions/",     // Deno project; own deno.json + Deno linter
    ],
  },
];
