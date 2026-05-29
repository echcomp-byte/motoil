import type { IceSnapshotInput } from './types';

export const MOCK_ICE_SNAPSHOT_INPUT: IceSnapshotInput = {
  locale: 'he',
  profile: {
    full_name: 'ישראל ישראלי',
    teudat_zehut: '000000018',
    blood_type: 'O+',
    allergies: ['פניצילין'],
    medications: ['קומדין'],
    conditions: ['סוכרת סוג 1'],
    kupat_holim: 'כללית',
  },
  emergency_contacts: [
    { name: 'דנה ישראלי', phone: '+972541234567', relation: 'אישה' },
    { name: 'יוסי כהן', phone: '+972527654321', relation: 'אח' },
  ],
  primary_bike: {
    make: 'Yamaha',
    model: 'MT-07',
    license_plate: '12-345-67',
  },
};

export const MOCK_ICE_SNAPSHOT_INPUT_EMPTY: IceSnapshotInput = {
  locale: 'he',
  profile: {
    full_name: 'משתמש חדש',
    teudat_zehut: null,
    blood_type: null,
    allergies: [],
    medications: [],
    conditions: [],
    kupat_holim: null,
  },
  emergency_contacts: [],
  primary_bike: null,
};
