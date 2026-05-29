import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/lib/theme";

type Props = {
  label: string;
  value?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
};

export function SettingsRow({ label, value, onPress, trailing, destructive, disabled }: Props) {
  const { colors } = useTheme();
  const labelColor = destructive ? colors.danger : colors.text;
  const interactive = !!onPress && !disabled;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={interactive ? onPress : undefined}
      disabled={!interactive}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && interactive ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.trailing}>
        {value ? (
          <Text style={[styles.value, { color: colors.textMuted }]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        {trailing}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.4 },
  label: { fontSize: 16, flexShrink: 1 },
  trailing: { flexDirection: "row", alignItems: "center", gap: 8 },
  value: { fontSize: 14 },
});
