import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme";
import { EXPIRY_PRESETS, type ExpiryPreset } from "./expiry";

type Props = {
  visible: boolean;
  current: ExpiryPreset | null;
  pendingPreset: ExpiryPreset | null;
  onSelect: (preset: ExpiryPreset) => void;
  onCancel: () => void;
};

/**
 * Bottom-sheet style modal with the 5 expiry presets. The currently
 * applied preset is highlighted; a tap fires the mutation and the
 * mutation's onSettled closes the modal. `pendingPreset` shows a
 * spinner on the row that's mid-flight without disabling the others
 * (the mutation will overwrite anything the user mashes through).
 */
export function ExpiryPicker({ visible, current, pendingPreset, onSelect, onCancel }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="button">
        <Pressable
          // Stop the outer Pressable from closing the sheet when the sheet
          // itself is tapped. Pressable instead of View for this exact reason.
          onPress={() => undefined}
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{t("qr.expiry.title")}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t("qr.expiry.subtitle")}</Text>

          <View style={styles.list}>
            {EXPIRY_PRESETS.map((preset) => {
              const isCurrent = preset === current;
              const isPending = preset === pendingPreset;
              return (
                <Pressable
                  key={preset}
                  onPress={() => onSelect(preset)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isCurrent }}
                  style={[
                    styles.row,
                    {
                      borderColor: isCurrent ? colors.primary : colors.border,
                      backgroundColor: isCurrent ? colors.primaryTint : colors.bg,
                    },
                  ]}
                >
                  <Text style={[styles.rowText, { color: colors.text, fontWeight: isCurrent ? "700" : "500" }]}>
                    {t(`qr.expiry.preset.${preset}`)}
                  </Text>
                  {isPending ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : isCurrent ? (
                    <Text style={[styles.check, { color: colors.primary }]}>✓</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onCancel}
            style={[styles.cancelBtn, { borderColor: colors.border }]}
            accessibilityRole="button"
          >
            <Text style={[styles.cancelText, { color: colors.text }]}>{t("qr.expiry.cancel")}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { fontSize: 13, marginBottom: 8 },
  list: { gap: 8, marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 52,
  },
  rowText: { fontSize: 16 },
  check: { fontSize: 18, fontWeight: "700" },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600" },
});
