import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { ContactCard } from "@/features/emergency-contact";
import { useContacts, useDeleteContact } from "@/lib/supabase/queries";
import { useTheme } from "@/lib/theme";

export default function ContactsListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;
  const query = useContacts(userId);
  const deleteMutation = useDeleteContact(userId ?? "");

  if (!userId) return null;

  if (query.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.muted, { color: colors.danger }]}>{t("contacts.loadFailed")}</Text>
      </View>
    );
  }

  const contacts = query.data ?? [];
  const canReorder = contacts.length >= 2;

  function confirmDelete(id: string, name: string) {
    Alert.alert(
      t("contacts.deleteConfirmTitle"),
      t("contacts.deleteConfirmBody", { name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["bottom"]}>
      <FlatList
        data={contacts}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.lead, { color: colors.textMuted }]}>{t("contacts.lead")}</Text>
        }
        ListEmptyComponent={
          <Text style={[styles.muted, { color: colors.textMuted }]}>{t("contacts.empty")}</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <ContactCard
            contact={item}
            onEdit={() => router.push({ pathname: "/profile-contacts/edit", params: { id: item.id } })}
            onDelete={() => confirmDelete(item.id, item.name)}
          />
        )}
      />

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.btn, styles.btnSecondary, { borderColor: colors.border }]}
          onPress={() => router.push("/profile-contacts/reorder")}
          disabled={!canReorder}
        >
          <Text
            style={[
              styles.btnText,
              { color: canReorder ? colors.text : colors.textMuted },
            ]}
          >
            {t("contacts.reorderCta")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/profile-contacts/edit")}
        >
          <Text style={[styles.btnText, { color: colors.primaryText }]}>
            {t("contacts.addCta")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16, gap: 0 },
  sep: { height: 10 },
  lead: { fontSize: 13, marginBottom: 12, textAlign: "center" },
  muted: { fontSize: 14, textAlign: "center", marginTop: 24 },
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
  btnText: { fontSize: 16, fontWeight: "600" },
});
