import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.profile") }} />
      <Tabs.Screen name="bikes" options={{ title: t("tabs.bikes") }} />
      <Tabs.Screen name="qr" options={{ title: t("tabs.qr") }} />
      <Tabs.Screen name="settings" options={{ title: t("tabs.settings") }} />
    </Tabs>
  );
}
