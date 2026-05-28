import { Link } from "expo-router";
import { useState } from "react";
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

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setInfo(null);
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "הזנה לא תקינה");
      return;
    }
    setSubmitting(true);
    const { error: authError } = await signUp(parsed.data.email, parsed.data.password);
    setSubmitting(false);
    if (authError) {
      setError(authError);
      return;
    }
    setInfo("נשלח אליך מייל אישור. אנא לחץ על הקישור במייל ואז התחבר.");
    setEmail("");
    setPassword("");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>הרשמה</Text>

          <TextInput
            style={styles.input}
            placeholder="אימייל"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            editable={!submitting}
          />
          <TextInput
            style={styles.input}
            placeholder="סיסמה (לפחות 6 תווים)"
            placeholderTextColor="#999"
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
            editable={!submitting}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>הירשם</Text>
            )}
          </Pressable>

          <Link href="/(auth)/login" style={styles.link}>
            כבר יש לי חשבון? התחבר
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: "center", gap: 12 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    textAlign: "right",
  },
  error: { color: "#c0392b", fontSize: 14, textAlign: "center" },
  info: { color: "#15803d", fontSize: 14, textAlign: "center" },
  button: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", color: "#2563eb", marginTop: 12, fontSize: 14 },
});
