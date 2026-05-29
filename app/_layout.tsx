import "@/lib/i18n";

import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { useAuth } from "@/features/auth/useAuth";
import { useFireInstallOnce, useHasSeenOnboarding } from "@/features/onboarding/storage";
import { ensureRTL } from "@/lib/i18n/rtl";
import { QueryProvider } from "@/lib/query";
import { ThemeProvider, useTheme } from "@/lib/theme";

export default function RootLayout() {
  useEffect(() => {
    ensureRTL();
  }, []);
  useFireInstallOnce();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <ThemedStatusBar />
            <RootGuard />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

function RootGuard() {
  const { session, loading } = useAuth();
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const { value: hasSeenOnboarding } = useHasSeenOnboarding();

  useEffect(() => {
    if (loading) return;
    if (hasSeenOnboarding === null) return;
    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === "(auth)";
    const inOnboardingGroup = firstSegment === "(onboarding)";
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace(hasSeenOnboarding ? "/(tabs)" : "/(onboarding)/welcome");
    } else if (session && !hasSeenOnboarding && !inOnboardingGroup) {
      router.replace("/(onboarding)/welcome");
    }
  }, [session, loading, hasSeenOnboarding, segments, router]);

  if (loading || hasSeenOnboarding === null) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: "center", justifyContent: "center" },
});
