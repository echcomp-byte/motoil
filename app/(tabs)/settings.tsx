import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHasSeenOnboarding } from "@/features/onboarding/storage";
import { useTheme } from "@/lib/theme";

export default function SettingsTab() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { reset } = useHasSeenOnboarding();

  // TODO(Dev D): real settings UI (language toggle, dark mode override, delete
  // account, sign out, version info) — this session is scaffold only.
  async function onPressRestartOnboarding() {
    await reset();
    router.push("/(onboarding)/welcome");
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>{t("tabs.settings")}</Text>
        <Text style={[styles.muted, { color: colors.textMuted }]}>
          {t("placeholders.settingsSoon")}
        </Text>

        {__DEV__ ? (
          <View style={[styles.debugBlock, { borderColor: colors.border }]}>
            <Text style={[styles.debugLabel, { color: colors.textMuted }]}>
              {t("onboarding.debug.title")}
            </Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.debugButton,
                { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={onPressRestartOnboarding}
            >
              <Text style={[styles.debugButtonText, { color: colors.primary }]}>
                {t("onboarding.debug.restart")}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 24 },
  title: { fontSize: 24, fontWeight: "700" },
  muted: { fontSize: 14 },
  debugBlock: {
    marginTop: 40,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
    width: "100%",
  },
  debugLabel: { fontSize: 12, textAlign: "center" },
  debugButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  debugButtonText: { fontSize: 14, fontWeight: "600" },
});
