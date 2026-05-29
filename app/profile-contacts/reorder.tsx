import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import {
  useContacts,
  useReorderContacts,
  type ContactRow,
} from "@/lib/supabase/queries";
import { useTheme } from "@/lib/theme";

/**
 * Reorder screen — adjusts emergency-contact priority for the lockscreen
 * widget's first-N selection (per issue #2 snapshot, current N = 3).
 *
 * UX: arrows up/down rather than drag-and-drop. Reasoning:
 *   - Avoids adding `react-native-draggable-flatlist` (~40KB + native deps).
 *   - For 3-8 contacts, arrow moves are 1-2 taps; the drag UX advantage is
 *     marginal at that scale.
 *   - "Save explicit" pattern (vs. save-on-each-move) means one mutation
 *     instead of N, and supports Cancel.
 * If user research shows people don't grok the arrow UX, swapping in
 * draggable-flatlist later is a contained change to this file only.
 */
export default function ReorderScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;
  const list = useContacts(userId);
  const reorder = useReorderContacts(userId ?? "");

  // Local pending order. Initialized from the loaded list; Save dispatches it.
  const [pending, setPending] = useState<ContactRow[] | null>(null);

  if (!userId) return null;

  if (list.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Initialize pending order from the query data on first render-with-data.
  const ordered = pending ?? list.data ?? [];

  function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    setPending(next);
  }

  function onSave() {
    reorder.mutate(
      ordered.map((c) => c.id),
      { onSuccess: () => router.back() },
    );
  }

  const dirty = pending !== null;
  const submitting = reorder.isPending;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["bottom"]}>
      <FlatList
        data={ordered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.lead, { color: colors.textMuted }]}>{t("contacts.reorderLead")}</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.row,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.rank}>
              <Text style={[styles.rankText, { color: colors.textMuted }]}>{index + 1}</Text>
            </View>
            <View style={styles.main}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.phone, { color: colors.textMuted }]} numberOfLines={1}>
                {item.phone}
              </Text>
            </View>
            <View style={styles.arrows}>
              <Pressable
                onPress={() => move(index, -1)}
                disabled={index === 0 || submitting}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.arrowBtn,
                  index === 0 && styles.arrowDisabled,
                  pressed && { opacity: 0.5 },
                ]}
              >
                <Text style={[styles.arrowText, { color: colors.text }]}>↑</Text>
              </Pressable>
              <Pressable
                onPress={() => move(index, 1)}
                disabled={index === ordered.length - 1 || submitting}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.arrowBtn,
                  index === ordered.length - 1 && styles.arrowDisabled,
                  pressed && { opacity: 0.5 },
                ]}
              >
                <Text style={[styles.arrowText, { color: colors.text }]}>↓</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.btn, styles.btnSecondary, { borderColor: colors.border }]}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>{t("common.cancel")}</Text>
        </Pressable>
        <Pressable
          style={[
            styles.btn,
            styles.btnPrimary,
            { backgroundColor: colors.primary },
            (!dirty || submitting) && styles.btnDisabled,
          ]}
          onPress={onSave}
          disabled={!dirty || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={[styles.btnText, { color: colors.primaryText }]}>{t("common.save")}</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16 },
  lead: { fontSize: 13, marginBottom: 12, textAlign: "center" },
  sep: { height: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rank: { width: 24, alignItems: "center" },
  rankText: { fontSize: 14, fontWeight: "700" },
  main: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: "600" },
  phone: { fontSize: 12 },
  arrows: { flexDirection: "row", gap: 4 },
  arrowBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowDisabled: { opacity: 0.3 },
  arrowText: { fontSize: 20, fontWeight: "700" },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  btn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPrimary: {},
  btnSecondary: { borderWidth: 1 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontWeight: "600" },
});
