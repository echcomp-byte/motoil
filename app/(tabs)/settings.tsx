import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { useHasSeenOnboarding } from "@/features/onboarding/storage";
import { SettingsRow } from "@/features/settings/components/SettingsRow";
import { deleteMyAccount } from "@/features/settings/deleteAccount";
import i18nInstance from "@/lib/i18n";
import { ensureRTL } from "@/lib/i18n/rtl";
import { setStoredLanguage, type Language } from "@/lib/i18n/storage";
import { useUpdateProfile } from "@/lib/supabase/queries";
import { useTheme, type ThemeMode } from "@/lib/theme";

export default function SettingsTab() {
  const { t, i18n } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { reset } = useHasSeenOnboarding();
  const updateProfile = useUpdateProfile(user?.id ?? "");
  const currentLanguage: Language = i18n.language === "en" ? "en" : "he";

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

  function onPressDeleteAccount() {
    Alert.alert(t("settings.delete.confirmTitle"), t("settings.delete.confirmBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.delete.confirmCta"),
        style: "destructive",
        onPress: async () => {
          const { errorKey } = await deleteMyAccount();
          if (errorKey) {
            Alert.alert(t(errorKey));
            return;
          }
          // Sign out so RootGuard sends the now-orphaned session to /(auth)/login,
          // then surface a success toast. Order matters: showing the alert before
          // signOut keeps the message visible during the redirect animation.
          Alert.alert(t("settings.delete.successTitle"), t("settings.delete.successBody"));
          await signOut();
        },
      },
    ]);
  }

  async function onPressRestartOnboarding() {
    await reset();
    router.push("/(onboarding)/welcome");
  }

  function onPressLanguage() {
    const options: { key: Language; label: string }[] = [
      { key: "he", label: t("settings.language.he") },
      { key: "en", label: t("settings.language.en") },
    ];
    Alert.alert(t("settings.language.chooseTitle"), undefined, [
      ...options.map((o) => ({
        text: o.label + (o.key === currentLanguage ? "  ✓" : ""),
        onPress: () => {
          if (o.key === currentLanguage) return;
          applyLanguageChange(o.key);
        },
      })),
      { text: t("common.cancel"), style: "cancel" as const },
    ]);
  }

  function applyLanguageChange(next: Language) {
    Alert.alert(t("settings.language.reloadTitle"), t("settings.language.reloadBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.language.reloadCta"),
        style: "destructive",
        onPress: async () => {
          await setStoredLanguage(next);
          // Write-through to profiles.locale so Dev B's widget-snapshot writer picks up the
          // change (issue #27 part B). Best-effort: degraded gracefully if the write fails —
          // the local UI change still applies.
          if (user?.id) {
            try {
              await updateProfile.mutateAsync({ locale: next });
            } catch (err) {
              // TODO(post-day-15): forward to Sentry.captureException when init lands
              if (__DEV__) console.warn("[settings] locale write-through failed:", err);
            }
          }
          await i18nInstance.changeLanguage(next);
          // ensureRTL reads stored language; reloadAsync fires inside if RTL must flip
          await ensureRTL();
        },
      },
    ]);
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
            label={t("settings.language.label")}
            value={t(`settings.language.${currentLanguage}`)}
            onPress={onPressLanguage}
          />
          <SettingsRow
            label={t("settings.theme.label")}
            value={t(`settings.theme.${mode}`)}
            onPress={onPressTheme}
          />
        </Section>

        <Section title={t("settings.sections.account")} color={colors.textMuted}>
          <SettingsRow label={t("settings.logout")} onPress={onPressLogout} />
          <SettingsRow
            label={t("settings.delete.label")}
            destructive
            onPress={onPressDeleteAccount}
          />
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
