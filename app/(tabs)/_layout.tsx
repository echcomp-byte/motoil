import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "פרופיל" }} />
      <Tabs.Screen name="bikes" options={{ title: "אופנועים" }} />
      <Tabs.Screen name="qr" options={{ title: "QR" }} />
      <Tabs.Screen name="settings" options={{ title: "הגדרות" }} />
    </Tabs>
  );
}
