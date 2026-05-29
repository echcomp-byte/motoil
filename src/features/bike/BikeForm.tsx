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
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "@/lib/theme";
import { bikeSchema, type BikeFormOutput, type BikeFormValues } from "./schema";

export type BikeFormProps = {
  initial?: BikeFormValues;
  submitting: boolean;
  submitError: string | null;
  onSubmit: (output: BikeFormOutput) => void;
  onCancel: () => void;
};

const EMPTY: BikeFormValues = {
  make: "",
  model: "",
  year: "",
  license_plate: "",
  is_primary: false,
};

export function BikeForm({ initial, submitting, submitError, onSubmit, onCancel }: BikeFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { control, handleSubmit, formState } = useForm<BikeFormValues, unknown, BikeFormOutput>({
    defaultValues: initial ?? EMPTY,
    resolver: zodResolver(bikeSchema),
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
        <Field label={t("bikes.fields.make")}>
          <Controller
            control={control}
            name="make"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  autoCapitalize="words"
                  placeholder={t("bikes.placeholders.make")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("bikes.fields.model")}>
          <Controller
            control={control}
            name="model"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  placeholder={t("bikes.placeholders.model")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("bikes.fields.year")}>
          <Controller
            control={control}
            name="year"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder={t("bikes.placeholders.year")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Field label={t("bikes.fields.licensePlate")}>
          <Controller
            control={control}
            name="license_plate"
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  style={inputStyle(colors)}
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  editable={!submitting}
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="characters"
                  placeholder={t("bikes.placeholders.licensePlate")}
                  placeholderTextColor={colors.textMuted}
                />
                <ErrorText error={fieldState.error?.message} />
              </>
            )}
          />
        </Field>

        <Controller
          control={control}
          name="is_primary"
          render={({ field }) => (
            <View
              style={[styles.primaryRow, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <View style={styles.primaryText}>
                <Text style={[styles.primaryTitle, { color: colors.text }]}>
                  {t("bikes.fields.isPrimary")}
                </Text>
                <Text style={[styles.primaryHint, { color: colors.textMuted }]}>
                  {t("bikes.isPrimaryHint")}
                </Text>
              </View>
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                disabled={submitting}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>
          )}
        />

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
  primaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  primaryText: { flex: 1, gap: 2 },
  primaryTitle: { fontSize: 15, fontWeight: "600" },
  primaryHint: { fontSize: 12 },
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
