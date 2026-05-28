import * as AppleAuthentication from "expo-apple-authentication";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";
import { credentialsSchema } from "@/features/auth/schema";
import { useTheme } from "@/lib/theme";

type Busy = "email" | "apple" | "google" | null;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const { signIn, signInWithApple, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Busy>(null);

  async function submitEmail() {
    setError(null);
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "auth.errors.invalidInput");
      return;
    }
    setBusy("email");
    const { errorKey } = await signIn(parsed.data.email, parsed.data.password);
    setBusy(null);
    if (errorKey) {
      setError(errorKey);
      return;
    }
    router.replace("/(tabs)");
  }

  async function submitApple() {
    setError(null);
    setBusy("apple");
    const { errorKey } = await signInWithApple();
    setBusy(null);
    if (errorKey) setError(errorKey);
  }

  async function submitGoogle() {
    setError(null);
    setBusy("google");
    const { errorKey } = await signInWithGoogle();
    setBusy(null);
    if (errorKey) setError(errorKey);
  }

  const anyBusy = busy !== null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>{t("auth.login.title")}</Text>

          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
            ]}
            placeholder={t("auth.login.email")}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            editable={!anyBusy}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
            ]}
            placeholder={t("auth.login.password")}
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoComplete="current-password"
            value={password}
            onChangeText={setPassword}
            editable={!anyBusy}
          />

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{t(error)}</Text> : null}

          <Pressable
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              anyBusy && styles.buttonDisabled,
            ]}
            onPress={submitEmail}
            disabled={anyBusy}
          >
            {busy === "email" ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.primaryText }]}>
                {t("auth.login.submit")}
              </Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>
              {t("auth.login.or")}
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {Platform.OS === "ios" ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={
                isDark
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={8}
              style={styles.appleButton}
              onPress={submitApple}
            />
          ) : null}

          <Pressable
            style={[
              styles.googleButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
              anyBusy && styles.buttonDisabled,
            ]}
            onPress={submitGoogle}
            disabled={anyBusy}
          >
            {busy === "google" ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={[styles.googleText, { color: colors.text }]}>
                {t("auth.login.withGoogle")}
              </Text>
            )}
          </Pressable>

          <Link href="/(auth)/signup" style={[styles.link, { color: colors.primary }]}>
            {t("auth.login.noAccount")}
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  error: { fontSize: 14, textAlign: "center" },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { fontSize: 16, fontWeight: "600" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  appleButton: { height: 48 },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    height: 48,
  },
  googleText: { fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", marginTop: 12, fontSize: 14 },
});
