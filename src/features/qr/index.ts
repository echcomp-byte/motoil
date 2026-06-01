export { QRScreen } from "./QRScreen";
export { QRCard, type QRCardHandle } from "./QRCard";
export { buildQrUrl, getQrBaseUrl } from "./qrUrl";
export { printRescueCard, shareRescueCard, getQrPng } from "./qrShare";
export { buildPrintableHtml } from "./printableHtml";
export {
  EXPIRY_PRESETS,
  computeExpiresAt,
  detectPreset,
  isExpired,
  type ExpiryPreset,
} from "./expiry";
