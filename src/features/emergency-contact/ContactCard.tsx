import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme";
import type { ContactRow } from "@/lib/supabase/queries";

export type ContactCardProps = {
  contact: ContactRow;
  onEdit: () => void;
  onDelete: () => void;
};

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onEdit}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.main}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={[styles.phone, { color: colors.textMuted }]} numberOfLines={1}>
          {contact.phone}
        </Text>
        {contact.relation ? (
          <Text style={[styles.relation, { color: colors.textMuted }]} numberOfLines={1}>
            {contact.relation}
          </Text>
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
  main: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: "700" },
  phone: { fontSize: 14 },
  relation: { fontSize: 12 },
  deleteBtn: { paddingHorizontal: 4 },
  deleteText: { fontSize: 13, fontWeight: "600" },
});
