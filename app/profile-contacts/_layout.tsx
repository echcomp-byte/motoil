import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme";

/**
 * Sub-flow of the profile tab: list, add/edit, and reorder emergency contacts.
 * Presented as a modal stack so the user feels they're "drilling in" from the
 * profile screen and can dismiss back to it without losing tab state.
 *
 * Routing note: PM asked for `(profile-contacts)` route-group syntax. Switched
 * to plain folder `profile-contacts/` because Expo Router groups don't appear
 * in URLs — `(profile-contacts)/index.tsx` would collide with `(tabs)/index.tsx`
 * (both resolve to `/`). The plain folder gives clean URLs:
 *   /profile-contacts
 *   /profile-contacts/edit
 *   /profile-contacts/reorder
 * Same UX (modal presentation, three screens), no route collision.
 */
export default function ProfileContactsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: t("contacts.title") }} />
      <Stack.Screen name="edit" options={{ title: t("contacts.editTitle") }} />
      <Stack.Screen name="reorder" options={{ title: t("contacts.reorderTitle") }} />
    </Stack>
  );
}
