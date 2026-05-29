import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";
import { OnboardingScreen } from "@/features/onboarding/components/OnboardingScreen";
import { useTheme } from "@/lib/theme";

export default function WhatIsIceScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  function onPressNext() {
    router.push("/(onboarding)/how-it-saves-lives");
  }

  return (
    <OnboardingScreen
      step={1}
      total={4}
      title={t("onboarding.whatIsIce.title")}
      body={t("onboarding.whatIsIce.body")}
      // TODO(post-MVP): replace 🆔 with custom illustration
      illustration={<Text style={styles.illustration}>🆔</Text>}
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
            {t("onboarding.common.next")}
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
