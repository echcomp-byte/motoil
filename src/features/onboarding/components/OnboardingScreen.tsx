import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedView, useEnterAnimation } from "@/lib/animations";
import { useTheme } from "@/lib/theme";
import { ProgressDots } from "./ProgressDots";

type Props = {
  step: number;
  total: number;
  title: string;
  body: string;
  illustration?: ReactNode;
  actions: ReactNode;
};

export function OnboardingScreen({ step, total, title, body, illustration, actions }: Props) {
  const { colors } = useTheme();
  const illustrationEnter = useEnterAnimation({ duration: 600 });
  const contentEnter = useEnterAnimation({ delay: 150, duration: 600 });
  const actionsEnter = useEnterAnimation({ delay: 300, duration: 500 });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.container}>
        <AnimatedView style={[styles.illustration, illustrationEnter]}>{illustration}</AnimatedView>
        <AnimatedView style={[styles.content, contentEnter]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>{body}</Text>
        </AnimatedView>
        <AnimatedView style={[styles.footer, actionsEnter]}>
          <ProgressDots step={step} total={total} />
          <View style={styles.actions}>{actions}</View>
        </AnimatedView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 24 },
  illustration: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { gap: 12, paddingHorizontal: 12, marginVertical: 16 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  body: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  footer: { gap: 20 },
  actions: { gap: 12 },
});
