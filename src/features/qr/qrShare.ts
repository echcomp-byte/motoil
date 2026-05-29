import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { buildPrintableHtml } from "./printableHtml";

/**
 * Internal ref type exposed by react-native-qrcode-svg's getRef callback.
 * The library types it as `any` so we narrow it ourselves to the bit we use.
 */
export type QrSvgRef = {
  toDataURL: (cb: (dataURL: string) => void) => void;
} | null;

export async function getQrPng(ref: QrSvgRef): Promise<string> {
  if (!ref || typeof ref.toDataURL !== "function") {
    throw new Error("qr_not_ready");
  }
  return new Promise<string>((resolve) => {
    ref.toDataURL((dataURL) => {
      // react-native-qrcode-svg returns the base64 payload without the
      // data: prefix; expo-print's HTML expects the same form embedded as
      // `data:image/png;base64,<this string>`.
      resolve(dataURL);
    });
  });
}

export type PrintShareArgs = {
  qrRef: QrSvgRef;
  url: string;
};

/**
 * Opens the platform print dialog (iOS UIPrintInteractionController, Android
 * PrintManager) with the rescue card pre-rendered. The user picks a printer
 * or AirPrint / Save to PDF.
 */
export async function printRescueCard({ qrRef, url }: PrintShareArgs): Promise<void> {
  const qrPng = await getQrPng(qrRef);
  const html = buildPrintableHtml({ qrPng, url });
  await Print.printAsync({ html });
}

/**
 * Materialises the rescue card as a PDF in the app's cache directory, then
 * hands it to the system share sheet. Users typically pick "Save to Files",
 * "AirDrop", or "WhatsApp" from there. AirDrop to a print shop is the
 * intended flow for riders without a home printer.
 *
 * Throws "share_unavailable" if the device cannot present a share sheet
 * (e.g. an emulator without share targets). Caller should translate the
 * key for the toast.
 */
export async function shareRescueCard({ qrRef, url }: PrintShareArgs): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error("share_unavailable");
  const qrPng = await getQrPng(qrRef);
  const html = buildPrintableHtml({ qrPng, url });
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: "MotoIL — Emergency card",
  });
}
