import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";
import { OnboardingScreen } from "@/features/onboarding/components/OnboardingScreen";
import { useHasSeenOnboarding } from "@/features/onboarding/storage";
import { track } from "@/lib/analytics";
import { useTheme } from "@/lib/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { markSeen } = useHasSeenOnboarding();

  // TODO(Dev D, root-guard PR): move 'install' to app/_layout.tsx so it fires
  // once per fresh install rather than on every welcome-screen mount.
  useEffect(() => {
    track("install");
  }, []);

  async function onPressNext() {
    // TODO(Dev D, next session): swap to router.push('/(onboarding)/what-is-ice')
    // when screens 2-4 land. For now, complete the flow so the mock is testable end-to-end.
    await markSeen();
    router.replace("/(tabs)");
  }

  return (
    <OnboardingScreen
      step={0}
      total={4}
      title={t("onboarding.welcome.title")}
      body={t("onboarding.welcome.body")}
      illustration={<Text style={styles.illustration}>🏍️</Text>}
      actions={
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onPressNext}
        >
          <Text style={[styles.ctaText, { color: colors.primaryText }]}>
            {t("onboarding.welcome.cta")}
          </Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  illustration: { fontSize: 120 },
  cta: { borderRadius: 8, paddingVertical: 16, alignItems: "center" },
  ctaText: { fontSize: 16, fontWeight: "600" },
});
