import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useTheme } from "@/lib/theme";

type Props = {
  url: string;
  size?: number;
};

/**
 * Big, high-contrast QR card. Renders white-on-black regardless of theme
 * because scanners read black-modules-on-light-background more reliably
 * than the reverse. The card itself follows the theme; only the QR module
 * pair is locked.
 */
export function QRCard({ url, size = 280 }: Props) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityLabel="QR code"
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.qrWrap}>
        <QRCode
          value={url}
          size={size}
          color="#000000"
          backgroundColor="#ffffff"
          // Higher EC level so the code stays scannable when partially
          // worn out on a helmet sticker. ~30% redundancy at "H".
          ecl="H"
          quietZone={12}
        />
      </View>
      <Text style={[styles.url, { color: colors.textMuted }]} selectable numberOfLines={2}>
        {url}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  qrWrap: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
  },
  url: {
    fontSize: 12,
    textAlign: "center",
  },
});
