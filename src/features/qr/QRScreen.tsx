import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/useAuth";
import { useTheme } from "@/lib/theme";
import { usePublicToken, useRotatePublicToken } from "@/lib/supabase/queries";
import { QRCard, type QRCardHandle } from "./QRCard";
import { RotateConfirmModal } from "./RotateConfirmModal";
import { buildQrUrl } from "./qrUrl";
import { printRescueCard, shareRescueCard } from "./qrShare";

type Action = "print" | "share";

export function QRScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { session } = useAuth();
  const userId = session?.user.id;

  const tokenQuery = usePublicToken(userId);
  const rotate = useRotatePublicToken(userId ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState<Action | null>(null);
  const qrCardRef = useRef<QRCardHandle>(null);

  const onConfirmRotate = async () => {
    try {
      await rotate.mutateAsync();
    } finally {
      setConfirmOpen(false);
    }
  };

  const runAction = async (action: Action, url: string) => {
    if (busy) return;
    setBusy(action);
    try {
      const qrPng = await qrCardRef.current?.getDataURL();
      if (!qrPng) throw new Error("qr_not_ready");
      // The qrShare helpers want a ref with a callback-style toDataURL
      // (matching the SVG ref). We already have the PNG, so the stub just
      // hands it back synchronously — avoids a second SVG → PNG round trip.
      const refStub = { toDataURL: (cb: (s: string) => void) => cb(qrPng) };
      if (action === "print") {
        await printRescueCard({ qrRef: refStub, url });
      } else {
        await shareRescueCard({ qrRef: refStub, url });
      }
    } catch (err) {
      const code = (err as Error).message;
      const key =
        code === "share_unavailable" ? "qr.action.error.shareUnavailable" : "qr.action.error.generic";
      Alert.alert(t("qr.action.error.title"), t(key));
    } finally {
      setBusy(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.text }]}>{t("qr.title")}</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t("qr.subtitle")}</Text>

        {tokenQuery.isLoading || !userId ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.muted, { color: colors.textMuted }]}>{t("qr.loading")}</Text>
          </View>
        ) : tokenQuery.isError || !tokenQuery.data ? (
          <View style={[styles.errorBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.errorTitle, { color: colors.text }]}>{t("qr.error.title")}</Text>
            <Text style={[styles.muted, { color: colors.textMuted }]}>{t("qr.error.body")}</Text>
            <Pressable
              onPress={() => tokenQuery.refetch()}
              style={[styles.retry, { borderColor: colors.primary }]}
              accessibilityRole="button"
            >
              <Text style={[styles.retryText, { color: colors.primary }]}>{t("qr.error.retry")}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <QRCard ref={qrCardRef} url={buildQrUrl(tokenQuery.data.token)} />

            <View style={styles.actions}>
              <View style={styles.row}>
                <ActionButton
                  label={t("qr.action.print")}
                  primary
                  busy={busy === "print"}
                  disabled={busy !== null}
                  onPress={() => runAction("print", buildQrUrl(tokenQuery.data!.token))}
                  colors={colors}
                />
                <ActionButton
                  label={t("qr.action.share")}
                  busy={busy === "share"}
                  disabled={busy !== null}
                  onPress={() => runAction("share", buildQrUrl(tokenQuery.data!.token))}
                  colors={colors}
                />
              </View>
              <Pressable
                onPress={() => setConfirmOpen(true)}
                style={[styles.actionBtn, { borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel={t("qr.rotate.button")}
                disabled={busy !== null}
              >
                <Text style={[styles.actionText, { color: colors.text }]}>{t("qr.rotate.button")}</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <RotateConfirmModal
        visible={confirmOpen}
        loading={rotate.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirmRotate}
      />
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  primary,
  busy,
  disabled,
  onPress,
  colors,
}: {
  label: string;
  primary?: boolean;
  busy: boolean;
  disabled: boolean;
  onPress: () => void;
  colors: { primary: string; border: string; text: string };
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.actionBtn,
        styles.flex1,
        primary
          ? { backgroundColor: colors.primary, borderColor: "transparent" }
          : { borderColor: colors.border },
        disabled ? styles.disabled : null,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={primary ? "#ffffff" : colors.primary} />
      ) : (
        <Text style={[styles.actionText, { color: primary ? "#ffffff" : colors.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 20, gap: 16, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", alignSelf: "stretch", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", alignSelf: "stretch", marginBottom: 8 },
  center: { alignItems: "center", gap: 8, padding: 24 },
  muted: { fontSize: 13 },
  errorBox: { alignSelf: "stretch", borderRadius: 12, borderWidth: 1, padding: 16, gap: 8 },
  errorTitle: { fontSize: 16, fontWeight: "600" },
  retry: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  retryText: { fontSize: 14, fontWeight: "600" },
  actions: { width: "100%", gap: 8, marginTop: 8 },
  row: { flexDirection: "row", gap: 8 },
  flex1: { flex: 1 },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  actionText: { fontSize: 15, fontWeight: "600" },
  disabled: { opacity: 0.5 },
});
