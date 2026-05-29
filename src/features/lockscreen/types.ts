export const SCHEMA_VERSION = 1 as const;

export const LIMITS = {
  MAX_LIST_ITEMS: 6,
  MAX_ITEM_CHARS: 40,
  MAX_CONTACTS: 3,
} as const;

export const NATIVE_KEYS = {
  IOS_APP_GROUP: 'group.com.echcomp.motoil.ice',
  ANDROID_SHARED_PREFS_FILE: 'motoil_ice',
  SNAPSHOT_KEY: 'ice_snapshot_v1',
  KEYCHAIN_KEY_ALIAS: 'motoil_ice_v1',
} as const;

export type IceProfile = {
  full_name: string;
  teudat_zehut: string | null;
  blood_type: string | null;
  allergies: string[];
  medications: string[];
  conditions: string[];
  kupat_holim: string | null;
};

export type IceEmergencyContact = {
  name: string;
  phone: string;
  relation: string | null;
};

export type IcePrimaryBike = {
  make: string;
  model: string;
  license_plate: string | null;
};

export type IceSnapshotInput = {
  locale: 'he' | 'en';
  profile: IceProfile;
  emergency_contacts: IceEmergencyContact[];
  primary_bike: IcePrimaryBike | null;
};

export type IceSnapshot = IceSnapshotInput & {
  schema_version: typeof SCHEMA_VERSION;
  updated_at: string;
};
