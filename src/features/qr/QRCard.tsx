import { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useTheme } from "@/lib/theme";
import { getQrPng, type QrSvgRef } from "./qrShare";

type Props = {
  url: string;
  size?: number;
};

export type QRCardHandle = {
  /** Resolves to a base64 PNG (without the data: prefix). Used for print/share. */
  getDataURL: () => Promise<string>;
};

/**
 * Big, high-contrast QR card. Renders black-on-white regardless of theme
 * because scanners read black-modules-on-light-background more reliably
 * than the reverse. The card frame follows the theme; the QR module pair
 * is locked.
 *
 * Exposes an imperative `getDataURL()` via forwardRef so the screen can
 * grab a base64 PNG of the QR for the printable HTML.
 */
export const QRCard = forwardRef<QRCardHandle, Props>(function QRCard(
  { url, size = 280 },
  ref,
) {
  const { colors } = useTheme();
  const svgRef = useRef<QrSvgRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      getDataURL: () => getQrPng(svgRef.current),
    }),
    [],
  );

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
          getRef={(c) => {
            svgRef.current = c;
          }}
        />
      </View>
      <Text style={[styles.url, { color: colors.textMuted }]} selectable numberOfLines={2}>
        {url}
      </Text>
    </View>
  );
});

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
