import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { useHasSeenOnboarding } from "@/features/onboarding/storage";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { useTheme, type ThemeMode } from "@/lib/theme";

export default function SettingsTab() {
  const { t } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const router = useRouter();
  const { signOut } = useAuth();
  const { reset } = useHasSeenOnboarding();

  const version = Constants.expoConfig?.version ?? "—";
  const build =
    Platform.OS === "ios"
      ? (Constants.expoConfig?.ios?.buildNumber ?? "—")
      : String(Constants.expoConfig?.android?.versionCode ?? "—");

  function onPressLogout() {
    Alert.alert(t("settings.logoutConfirmTitle"), t("settings.logoutConfirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.logout"),
        style: "destructive",
        onPress: async () => {
          const { errorKey } = await signOut();
          if (errorKey) Alert.alert(t(errorKey));
          // RootGuard redirects to /(auth)/login on session === null
        },
      },
    ]);
  }

  async function onPressRestartOnboarding() {
    await reset();
    router.push("/(onboarding)/welcome");
  }

  function onPressTheme() {
    const options: { key: ThemeMode; label: string }[] = [
      { key: "system", label: t("settings.theme.system") },
      { key: "light", label: t("settings.theme.light") },
      { key: "dark", label: t("settings.theme.dark") },
    ];
    Alert.alert(t("settings.theme.chooseTitle"), undefined, [
      ...options.map((o) => ({
        text: o.label + (o.key === mode ? "  ✓" : ""),
        onPress: () => {
          void setMode(o.key);
        },
      })),
      { text: t("common.cancel"), style: "cancel" as const },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>{t("tabs.settings")}</Text>

        <Section title={t("settings.sections.preferences")} color={colors.textMuted}>
          <SettingsRow
            label={t("settings.theme.label")}
            value={t(`settings.theme.${mode}`)}
            onPress={onPressTheme}
          />
        </Section>

        <Section title={t("settings.sections.account")} color={colors.textMuted}>
          <SettingsRow label={t("settings.logout")} destructive onPress={onPressLogout} />
        </Section>

        <Section title={t("settings.sections.about")} color={colors.textMuted}>
          <SettingsRow label={t("settings.version")} value={version} />
          <SettingsRow label={t("settings.build")} value={build} />
        </Section>

        {__DEV__ ? (
          <Section title={t("onboarding.debug.title")} color={colors.textMuted}>
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
          </Section>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, gap: 8 },
  title: { fontSize: 28, fontWeight: "700", marginVertical: 8 },
  section: { marginTop: 16, gap: 6 },
  sectionTitle: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", paddingHorizontal: 4 },
  sectionBody: { borderRadius: 12, overflow: "hidden" },
  debugButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  debugButtonText: { fontSize: 14, fontWeight: "600" },
});
