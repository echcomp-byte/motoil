import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/useAuth";

export default function ProfileTab() {
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>פרופיל</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>התנתק</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  email: { fontSize: 14, color: "#666" },
  button: {
    marginTop: 24,
    backgroundColor: "#1f2937",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
