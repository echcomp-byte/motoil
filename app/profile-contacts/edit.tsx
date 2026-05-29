import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useAuth } from "@/features/auth/useAuth";
import { ContactForm } from "@/features/emergency-contact";
import {
  useAddContact,
  useContacts,
  useUpdateContact,
} from "@/lib/supabase/queries";
import { useTheme } from "@/lib/theme";

/**
 * Shared add/edit screen. If `id` search-param is present, prefill from cache
 * and update the existing row; otherwise insert a new row.
 *
 * No standalone load — we read from the queries cache. The list screen has
 * always loaded contacts before the user could reach edit (you can only edit
 * what was visible). If the cache is empty (cold navigation), we still render
 * an empty form; the server validates user_id ownership on update.
 */
export default function ContactEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const userId = user?.id;
  const { colors } = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const list = useContacts(userId);
  const addMutation = useAddContact(userId ?? "");
  const updateMutation = useUpdateContact(userId ?? "");

  if (!userId) return null;

  const editing = params.id ? (list.data ?? []).find((c) => c.id === params.id) : undefined;
  const initial = editing
    ? { name: editing.name, phone: editing.phone, relation: editing.relation ?? "" }
    : undefined;

  const submitting = addMutation.isPending || updateMutation.isPending;

  function onSubmit(output: { name: string; phone: string; relation: string | null }) {
    setSubmitError(null);
    const handleSuccess = () => router.back();
    const handleError = () => setSubmitError("contacts.errors.saveFailed");

    if (editing) {
      updateMutation.mutate(
        { id: editing.id, patch: output },
        { onSuccess: handleSuccess, onError: handleError },
      );
    } else {
      addMutation.mutate(output, { onSuccess: handleSuccess, onError: handleError });
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["bottom"]}>
      <ContactForm
        initial={initial}
        submitting={submitting}
        submitError={submitError}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
