import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme";

type Props = {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Two-step confirmation for revoking the current QR and minting a new
 * one. Friction is intentional — once the user confirms, every printed
 * sticker stops working and must be reprinted. Easy to undo accidentally
 * is the wrong default here.
 */
export function RotateConfirmModal({ visible, loading, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={loading ? undefined : onCancel}
    >
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("qr.rotate.title")}
          </Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>
            {t("qr.rotate.body")}
          </Text>
          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={[styles.btn, { borderColor: colors.border }]}
              accessibilityRole="button"
            >
              <Text style={[styles.btnText, { color: colors.text }]}>{t("qr.rotate.cancel")}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={[styles.btnText, styles.btnTextPrimary]}>{t("qr.rotate.confirm")}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: "700" },
  body: { fontSize: 14, lineHeight: 20 },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 96,
    alignItems: "center",
  },
  btnPrimary: { borderColor: "transparent" },
  btnText: { fontSize: 15, fontWeight: "600" },
  btnTextPrimary: { color: "#ffffff" },
});
