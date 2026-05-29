import type { Lang } from "@/lib/lang";

export const DICT: Record<Lang, Record<string, string>> = {
  he: {
    "page.title": "כרטיס חירום — MotoIL",
    "page.subtitle": "מידע רפואי לרוכב/ת",
    "switch.lang": "English",
    "switch.print": "הדפסה",
    "section.identity": "זיהוי",
    "section.medical": "מידע רפואי",
    "section.contacts": "אנשי קשר לחירום",
    "section.bike": "אופנוע",
    "field.fullName": "שם מלא",
    "field.teudatZehut": "תעודת זהות",
    "field.bloodType": "סוג דם",
    "field.allergies": "אלרגיות",
    "field.medications": "תרופות",
    "field.conditions": "מצבים רפואיים",
    "field.kupatHolim": "קופת חולים",
    "field.relation": "קרבה",
    "field.phone": "טלפון",
    "field.make": "יצרן",
    "field.model": "דגם",
    "field.year": "שנה",
    "field.licensePlate": "מספר רישוי",
    "empty.value": "לא צוין",
    "empty.list": "אין מידע",
    "footer.disclaimer":
      "המידע סופק על ידי הרוכב/ת לשימוש צוותי חירום בלבד.",
    "error.notFound.title": "כרטיס לא נמצא",
    "error.notFound.body":
      "ה-QR שסרקת אינו תקף. ייתכן שהוא בוטל או פג תוקפו.",
    "error.serverTitle": "שגיאה זמנית",
    "error.serverBody": "נסה שוב בעוד רגע.",
  },
  en: {
    "page.title": "Emergency Card — MotoIL",
    "page.subtitle": "Medical information for the rider",
    "switch.lang": "עברית",
    "switch.print": "Print",
    "section.identity": "Identity",
    "section.medical": "Medical information",
    "section.contacts": "Emergency contacts",
    "section.bike": "Motorcycle",
    "field.fullName": "Full name",
    "field.teudatZehut": "National ID",
    "field.bloodType": "Blood type",
    "field.allergies": "Allergies",
    "field.medications": "Medications",
    "field.conditions": "Medical conditions",
    "field.kupatHolim": "Health fund",
    "field.relation": "Relation",
    "field.phone": "Phone",
    "field.make": "Make",
    "field.model": "Model",
    "field.year": "Year",
    "field.licensePlate": "License plate",
    "empty.value": "Not provided",
    "empty.list": "None",
    "footer.disclaimer":
      "Information provided by the rider for emergency-responder use only.",
    "error.notFound.title": "Card not found",
    "error.notFound.body":
      "The QR you scanned is not valid. It may have been revoked or expired.",
    "error.serverTitle": "Temporary error",
    "error.serverBody": "Please try again in a moment.",
  },
};

export function t(lang: Lang, key: string): string {
  return DICT[lang][key] ?? key;
}
