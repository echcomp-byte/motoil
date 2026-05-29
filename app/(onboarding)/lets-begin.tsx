import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";
import { OnboardingScreen } from "@/features/onboarding/components/OnboardingScreen";
import { useHasSeenOnboarding } from "@/features/onboarding/storage";
import { useTheme } from "@/lib/theme";

export default function LetsBeginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { markSeen } = useHasSeenOnboarding();

  async function onPressDone() {
    await markSeen();
    router.replace("/(tabs)");
  }

  return (
    <OnboardingScreen
      step={3}
      total={4}
      title={t("onboarding.letsBegin.title")}
      body={t("onboarding.letsBegin.body")}
      // TODO(post-MVP): replace ✅ with custom illustration
      illustration={<Text style={styles.illustration}>✅</Text>}
      actions={
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onPressDone}
        >
          <Text style={[styles.ctaText, { color: colors.primaryText }]}>
            {t("onboarding.letsBegin.cta")}
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
