import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { formatIsraeliLicensePlate } from "@/lib/validation";
import type { BikeRow } from "@/lib/supabase/queries";
import { useTheme } from "@/lib/theme";

export type BikeCardProps = {
  bike: BikeRow;
  onEdit: () => void;
  onDelete: () => void;
};

/**
 * Renders a single bike. Primary bikes show a ★ badge in the brand color so
 * the user knows which one feeds the lockscreen widget.
 */
export function BikeCard({ bike, onEdit, onDelete }: BikeCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const display = bike.license_plate ? formatIsraeliLicensePlate(bike.license_plate) : null;

  return (
    <Pressable
      onPress={onEdit}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.main}>
        <View style={styles.headRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {bike.make} {bike.model}
          </Text>
          {bike.is_primary ? (
            <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.primaryText, { color: colors.primaryText }]}>
                {t("bikes.primaryBadge")}
              </Text>
            </View>
          ) : null}
        </View>
        {bike.year || display ? (
          <View style={styles.metaRow}>
            {bike.year ? (
              <Text style={[styles.meta, { color: colors.textMuted }]}>{bike.year}</Text>
            ) : null}
            {display ? (
              <Text style={[styles.plate, { color: colors.text }]}>{display}</Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
      >
        <Text style={[styles.deleteText, { color: colors.danger }]}>{t("common.delete")}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  main: { flex: 1, gap: 4 },
  headRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "700", flex: 1 },
  primaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  primaryText: { fontSize: 11, fontWeight: "700" },
  metaRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  meta: { fontSize: 13 },
  plate: { fontSize: 13, fontWeight: "600", letterSpacing: 0.5 },
  deleteBtn: { paddingHorizontal: 4 },
  deleteText: { fontSize: 13, fontWeight: "600" },
});
