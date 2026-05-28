import type { ExpoConfig } from "expo/config";
import appJson from "./app.json";

// Reverses an iOS OAuth client ID into the URL scheme the GoogleSignin plugin needs.
// e.g. "123456-abc.apps.googleusercontent.com" → "com.googleusercontent.apps.123456-abc"
function googleIosUrlSchemeFrom(clientId: string | undefined): string | null {
  if (!clientId) return null;
  const suffix = ".apps.googleusercontent.com";
  if (!clientId.endsWith(suffix)) return null;
  return `com.googleusercontent.apps.${clientId.slice(0, -suffix.length)}`;
}

export default (): ExpoConfig => {
  const base = appJson.expo as ExpoConfig;
  const plugins = [...(base.plugins ?? [])];

  const iosUrlScheme = googleIosUrlSchemeFrom(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);
  if (iosUrlScheme) {
    plugins.push(["@react-native-google-signin/google-signin", { iosUrlScheme }]);
  }

  return {
    ...base,
    plugins,
  };
};
