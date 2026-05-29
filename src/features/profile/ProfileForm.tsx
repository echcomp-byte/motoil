import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "@/features/auth/useAuth";
import { useContacts, useProfile, useUpdateProfile } from "@/lib/supabase/queries";
import {
  BLOOD_TYPE_OPTIONS,
  KUPAT_HOLIM_OPTIONS,
  type BloodType,
  type KupatHolim,
} from "@/lib/supabase/types";
import { useTheme } from "@/lib/theme";
import { ChipRow } from "./ChipRow";
import {
  parseList,
  profileSchema,
  serializeList,
  type ProfileFormValues,
} from "./schema";

const EMPTY_VALUES: ProfileFormValues = {
  full_name: "",
  teudat_zehut: null,
  blood_type: null,
  kupat_holim: null,
  allergies: [],
  medications: [],
  conditions: [],
};

export function ProfileForm() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;

  const profileQuery = useProfile(userId);
  const updateMutation = useUpdateProfile(userId ?? "");
  // Light prefetch of contacts so the sub-page lands instantly when the user
  // taps "manage contacts" below. Cache is shared via QueryClient.
  const contactsQuery = useContacts(userId);
  const contactCount = contactsQuery.data?.length ?? 0;

  // Saved-toast state: shown for 2s after a successful save.
  const [savedTick, setSavedTick] = useState(0);
  useEffect(() => {
    if (!savedTick) return;
    const id = setTimeout(() => setSavedTick(0), 2000);
    return () => clearTimeout(id);
  }, [savedTick]);

  const { control, handleSubmit, reset, formState } = useForm<ProfileFormValues>({
    defaultValues: EMPTY_VALUES,
    resolver: zodResolver(profileSchema),
  });

  // Hydrate the form when the profile loads. Each row maps cleanly to a
  // form value; arrays come back as string[] from Supabase and stay that way.
  useEffect(() => {
    const data = profileQuery.data;
    if (!data) return;
    reset({
      full_name: data.full_name ?? "",
      teudat_zehut: data.teudat_zehut,
      blood_type: (data.blood_type as BloodType | null) ?? null,
      kupat_holim: (data.kupat_holim as KupatHolim | null) ?? null,
      allergies: data.allergies ?? [],
      medications: data.medications ?? [],
      conditions: data.conditions ?? [],
    });
  }, [profileQuery.data, reset]);

  if (!userId) {
    // RootGuard should never let us render without a session, but be defensive.
    return null;
  }

  if (profileQuery.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (profileQuery.isError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {t("profile.errors.loadFailed")}
        </Text>
      </View>
    );
  }

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate(values, {
      onSuccess: () => setSavedTick((n) => n + 1),
    });
  });

  const submitting = updateMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: colors.bg }}
      >
        <Text style={[styles.heading, { color: colors.text }]}>
          {t("profile.heading")}
        </Text>
        <Text style={[styles.subheading, { color: colors.textMuted }]}>
          {t("profile.subheading")}
        </Text>

        <Field label={t("profile.fields.fullName")}>
          <Controller
            control={control}
            name="full_name"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  autoCapitalize="words"
                  autoComplete="name"
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("profile.fields.teudatZehut")}>
          <Controller
            control={control}
            name="teudat_zehut"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value ?? ""}
                  onChangeText={(v) => field.onChange(v === "" ? null : v)}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  keyboardType="number-pad"
                  maxLength={11}
                  placeholder={t("profile.placeholders.teudatZehut")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("profile.fields.bloodType")}>
          <Controller
            control={control}
            name="blood_type"
            render={({ field, fieldState }) => (
              <>
                <ChipRow
                  options={BLOOD_TYPE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={submitting}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("profile.fields.kupatHolim")}>
          <Controller
            control={control}
            name="kupat_holim"
            render={({ field, fieldState }) => (
              <>
                <ChipRow
                  options={KUPAT_HOLIM_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  renderLabel={(opt) => t(`profile.kupatHolim.${opt}`)}
                  disabled={submitting}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <ListField
          name="allergies"
          control={control}
          submitting={submitting}
          label={t("profile.fields.allergies")}
          placeholder={t("profile.placeholders.commaSeparated")}
        />
        <ListField
          name="medications"
          control={control}
          submitting={submitting}
          label={t("profile.fields.medications")}
          placeholder={t("profile.placeholders.commaSeparated")}
        />
        <ListField
          name="conditions"
          control={control}
          submitting={submitting}
          label={t("profile.fields.conditions")}
          placeholder={t("profile.placeholders.commaSeparated")}
        />

        {updateMutation.isError ? (
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {t("profile.errors.saveFailed")}
          </Text>
        ) : null}
        {savedTick > 0 ? (
          <Text style={[styles.savedText, { color: colors.success }]}>
            {t("profile.saved")}
          </Text>
        ) : null}

        <Pressable
          style={[
            styles.submit,
            { backgroundColor: colors.primary },
            (submitting || !formState.isDirty) && styles.submitDisabled,
          ]}
          onPress={onSubmit}
          disabled={submitting || !formState.isDirty}
        >
          {submitting ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={[styles.submitText, { color: colors.primaryText }]}>
              {t("common.save")}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.subPageLink, { borderColor: colors.border }]}
          onPress={() => router.push("/profile-contacts")}
        >
          <Text style={[styles.subPageTitle, { color: colors.text }]}>
            {t("profile.manageContacts")}
          </Text>
          <Text style={[styles.subPageMeta, { color: colors.textMuted }]}>
            {t("profile.manageContactsCount", { count: contactCount })}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{label}</Text>
      {children}
    </View>
  );
}

function ErrorText({ error }: { error: string | undefined }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  if (!error) return null;
  return <Text style={[styles.errorText, { color: colors.danger }]}>{t(error)}</Text>;
}

/**
 * Controller wrapper for comma-separated array fields. Keeps a local string
 * mirror so the user can type freely (including trailing commas) without RHF
 * re-rendering the input mid-keystroke.
 */
function ListField({
  name,
  control,
  submitting,
  label,
  placeholder,
}: {
  name: "allergies" | "medications" | "conditions";
  control: ReturnType<typeof useForm<ProfileFormValues>>["control"];
  submitting: boolean;
  label: string;
  placeholder: string;
}) {
  const { colors } = useTheme();
  return (
    <Field label={label}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <ListFieldInput
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={submitting}
            placeholder={placeholder}
            colors={colors}
            error={fieldState.error?.message}
          />
        )}
      />
    </Field>
  );
}

function ListFieldInput({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  colors,
  error,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onBlur: () => void;
  disabled: boolean;
  placeholder: string;
  colors: ReturnType<typeof useTheme>["colors"];
  error: string | undefined;
}) {
  // Local draft mirrors what the user is typing (including trailing commas
  // and whitespace) so the input doesn't fight a parsed-and-re-serialized
  // re-render between keystrokes. Synced from `value` only when the upstream
  // reference changes (e.g. after RHF `reset()` hydrates from useProfile).
  // Pattern: "derived state during render" — recommended over useEffect for
  // prop→state mirroring (see https://react.dev/reference/react/useState#storing-information-from-previous-renders).
  const [draft, setDraft] = useState(() => serializeList(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(serializeList(value));
  }

  return (
    <>
      <TextInput
        style={inputStyle(colors)}
        value={draft}
        onChangeText={(v) => {
          setDraft(v);
          onChange(parseList(v));
        }}
        onBlur={onBlur}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline
      />
      <ErrorText error={error} />
    </>
  );
}

function inputStyle(colors: ReturnType<typeof useTheme>["colors"]) {
  return [
    styles.input,
    { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
  ];
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, paddingBottom: 48, gap: 16 },
  heading: { fontSize: 22, fontWeight: "700" },
  subheading: { fontSize: 13, marginBottom: 8 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
    minHeight: 44,
  },
  errorText: { fontSize: 13 },
  savedText: { fontSize: 13, textAlign: "center" },
  submit: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { fontSize: 16, fontWeight: "700" },
  subPageLink: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 4,
  },
  subPageTitle: { fontSize: 16, fontWeight: "600" },
  subPageMeta: { fontSize: 12 },
});
