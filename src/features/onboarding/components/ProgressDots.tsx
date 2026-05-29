import { StyleSheet, View } from "react-native";
import { useTheme } from "@/lib/theme";

type Props = { step: number; total: number };

export function ProgressDots({ step, total }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessible accessibilityRole="progressbar">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === step ? colors.primary : colors.border,
              width: i === step ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  dot: { height: 8, borderRadius: 4 },
});
