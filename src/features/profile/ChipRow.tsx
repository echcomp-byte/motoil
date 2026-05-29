import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useTheme } from "@/lib/theme";

type ChipRowProps<T extends string> = {
  options: readonly T[];
  value: T | null;
  onChange: (next: T | null) => void;
  /**
   * Optional label-renderer. Defaults to identity — useful when the option
   * value is the storage canon (e.g. "clalit") but the UI shows a translated
   * label (e.g. "כללית"). The caller supplies the translation.
   */
  renderLabel?: (value: T) => string;
  disabled?: boolean;
};

/**
 * A horizontally-scrollable row of selectable chips. Tapping the active chip
 * clears the selection (sets it back to null) — useful for "no answer" /
 * optional fields like blood type and kupat holim.
 *
 * Chosen over a modal Picker because:
 *   - Option sets are tiny (≤ 8 for blood type, 4 for kupat holim).
 *   - One-tap selection is faster than open-modal-select-confirm.
 *   - Visible state communicates that the field is optional.
 *
 * RTL: ScrollView reverses naturally under forceRTL; no extra style needed.
 */
export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
  disabled,
}: ChipRowProps<T>) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((opt) => {
        const selected = opt === value;
        return (
          <Pressable
            key={opt}
            disabled={disabled}
            onPress={() => onChange(selected ? null : opt)}
            style={[
              styles.chip,
              {
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary : colors.surface,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.primaryText : colors.text },
              ]}
            >
              {renderLabel ? renderLabel(opt) : opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: { fontSize: 14, fontWeight: "600" },
});
