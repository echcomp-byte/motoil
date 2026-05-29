import { zodResolver } from "@hookform/resolvers/zod";
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
import { useTheme } from "@/lib/theme";
import { contactSchema, type ContactFormOutput, type ContactFormValues } from "./schema";

export type ContactFormProps = {
  initial?: ContactFormValues;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (output: ContactFormOutput) => void;
  onCancel: () => void;
};

const EMPTY: ContactFormValues = { name: "", phone: "", relation: "" };

export function ContactForm({
  initial,
  submitting,
  submitError,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { control, handleSubmit, formState } = useForm<
    ContactFormValues,
    unknown,
    ContactFormOutput
  >({
    defaultValues: initial ?? EMPTY,
    resolver: zodResolver(contactSchema),
  });

  const submit = handleSubmit((output) => onSubmit(output));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Field label={t("contacts.fields.name")}>
          <Controller
            control={control}
            name="name"
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
                  placeholder={t("contacts.placeholders.name")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("contacts.fields.phone")}>
          <Controller
            control={control}
            name="phone"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  placeholder={t("contacts.placeholders.phone")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("contacts.fields.relation")}>
          <Controller
            control={control}
            name="relation"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  autoCapitalize="words"
                  placeholder={t("contacts.placeholders.relation")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        {submitError ? (
          <Text style={[styles.error, { color: colors.danger }]}>{t(submitError)}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.btnSecondary, { borderColor: colors.border }]}
            onPress={onCancel}
            disabled={submitting}
          >
            <Text style={[styles.btnText, { color: colors.text }]}>{t("common.cancel")}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.btn,
              styles.btnPrimary,
              { backgroundColor: colors.primary },
              (submitting || !formState.isDirty) && styles.btnDisabled,
            ]}
            onPress={submit}
            disabled={submitting || !formState.isDirty}
          >
            {submitting ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={[styles.btnText, { color: colors.primaryText }]}>
                {t("common.save")}
              </Text>
            )}
          </Pressable>
        </View>
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
  return <Text style={[styles.error, { color: colors.danger }]}>{t(error)}</Text>;
}

function inputStyle(colors: ReturnType<typeof useTheme>["colors"]) {
  return [
    styles.input,
    { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
  ];
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
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
  error: { fontSize: 13 },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
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
