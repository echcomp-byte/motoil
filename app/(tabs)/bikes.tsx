import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { BikeCard, BikeForm, type BikeFormValues } from "@/features/bike";
import {
  useAddBike,
  useBikes,
  useDeleteBike,
  useSetPrimaryBike,
  useUpdateBike,
  type BikeRow,
} from "@/lib/supabase/queries";
import { useTheme } from "@/lib/theme";

type ModalState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; bike: BikeRow };

const EMPTY_FORM: BikeFormValues = {
  make: "",
  model: "",
  year: "",
  license_plate: "",
  is_primary: false,
};

export default function BikesTab() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?.id;
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const query = useBikes(userId);
  const addMutation = useAddBike(userId ?? "");
  const updateMutation = useUpdateBike(userId ?? "");
  const deleteMutation = useDeleteBike(userId ?? "");
  const setPrimaryMutation = useSetPrimaryBike(userId ?? "");

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
        <Text style={[styles.muted, { color: colors.danger }]}>{t("bikes.loadFailed")}</Text>
      </View>
    );
  }

  const bikes = query.data ?? [];
  const submitting =
    addMutation.isPending || updateMutation.isPending || setPrimaryMutation.isPending;

  function openAdd() {
    setSubmitError(null);
    setModal({ mode: "add" });
  }
  function openEdit(bike: BikeRow) {
    setSubmitError(null);
    setModal({ mode: "edit", bike });
  }
  function close() {
    setModal({ mode: "closed" });
    setSubmitError(null);
  }

  function confirmDelete(bike: BikeRow) {
    Alert.alert(
      t("bikes.deleteConfirmTitle"),
      t("bikes.deleteConfirmBody", { name: `${bike.make} ${bike.model}` }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteMutation.mutate(bike.id),
        },
      ],
    );
  }

  // The mutation hook layer enforces the demote-then-promote dance per
  // migration 0002 — we express "I want this bike to be primary" as a single
  // call that internally does both writes.
  async function applyPrimaryChange(targetId: string, makePrimary: boolean) {
    if (makePrimary) {
      await setPrimaryMutation.mutateAsync(targetId);
    } else {
      const current = bikes.find((b) => b.is_primary);
      if (current && current.id === targetId) {
        await setPrimaryMutation.mutateAsync(null);
      }
      // Otherwise nothing to do — they unchecked is_primary on a bike that
      // wasn't primary anyway.
    }
  }

  function onSubmit(output: {
    make: string;
    model: string;
    year: number | null;
    license_plate: string | null;
    is_primary: boolean;
  }) {
    setSubmitError(null);
    const handleSuccess = () => close();
    const handleError = () => setSubmitError("bikes.errors.saveFailed");

    if (modal.mode === "edit") {
      const targetId = modal.bike.id;
      const wasPrimary = modal.bike.is_primary;
      const wantsPrimary = output.is_primary;
      // Update non-primary fields first; the primary flag goes through the
      // dedicated mutation so the invariant is honored in one place.
      updateMutation.mutate(
        {
          id: targetId,
          patch: {
            make: output.make,
            model: output.model,
            year: output.year,
            license_plate: output.license_plate,
          },
        },
        {
          onSuccess: async () => {
            if (wasPrimary !== wantsPrimary) {
              try {
                await applyPrimaryChange(targetId, wantsPrimary);
              } catch {
                handleError();
                return;
              }
            }
            handleSuccess();
          },
          onError: handleError,
        },
      );
    } else if (modal.mode === "add") {
      // For add: insert with is_primary=false first, then promote if requested.
      // Two-step keeps the partial-unique-index check happy regardless of
      // whether another primary already exists.
      addMutation.mutate(
        {
          make: output.make,
          model: output.model,
          year: output.year,
          license_plate: output.license_plate,
          is_primary: false,
        },
        {
          onSuccess: async (row) => {
            if (output.is_primary) {
              try {
                await applyPrimaryChange(row.id, true);
              } catch {
                handleError();
                return;
              }
            }
            handleSuccess();
          },
          onError: handleError,
        },
      );
    }
  }

  const initial: BikeFormValues | undefined =
    modal.mode === "edit"
      ? {
          make: modal.bike.make,
          model: modal.bike.model,
          year: modal.bike.year !== null ? String(modal.bike.year) : "",
          license_plate: modal.bike.license_plate ?? "",
          is_primary: modal.bike.is_primary,
        }
      : modal.mode === "add"
        ? EMPTY_FORM
        : undefined;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["bottom"]}>
      <FlatList
        data={bikes}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[styles.lead, { color: colors.textMuted }]}>{t("bikes.lead")}</Text>
        }
        ListEmptyComponent={
          <Text style={[styles.muted, { color: colors.textMuted }]}>{t("bikes.empty")}</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <BikeCard
            bike={item}
            onEdit={() => openEdit(item)}
            onDelete={() => confirmDelete(item)}
          />
        )}
      />
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={openAdd}
          disabled={submitting}
        >
          <Text style={[styles.addBtnText, { color: colors.primaryText }]}>
            {t("bikes.addCta")}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={modal.mode !== "closed"}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={close}
      >
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.bg }]}>
          {initial ? (
            <BikeForm
              initial={initial}
              submitting={submitting}
              submitError={submitError}
              onSubmit={onSubmit}
              onCancel={close}
            />
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16 },
  lead: { fontSize: 13, marginBottom: 12, textAlign: "center" },
  muted: { fontSize: 14, textAlign: "center", marginTop: 24 },
  sep: { height: 10 },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  addBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  addBtnText: { fontSize: 16, fontWeight: "600" },
  modalSafe: { flex: 1 },
});
