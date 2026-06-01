import Foundation

// Mirrors src/features/lockscreen/types.ts (schema_version=1).
// JSON key naming is snake_case to match RN writer output verbatim —
// CodingKeys are listed explicitly so a refactor of the Swift names
// would not silently break decode.

struct IceSnapshot: Codable {
    let schemaVersion: Int
    let updatedAt: String
    let locale: String
    let profile: IceProfile
    let emergencyContacts: [IceEmergencyContact]
    let primaryBike: IcePrimaryBike?

    enum CodingKeys: String, CodingKey {
        case schemaVersion = "schema_version"
        case updatedAt = "updated_at"
        case locale
        case profile
        case emergencyContacts = "emergency_contacts"
        case primaryBike = "primary_bike"
    }
}

struct IceProfile: Codable {
    let fullName: String
    let teudatZehut: String?
    let bloodType: String?
    let allergies: [String]
    let medications: [String]
    let conditions: [String]
    let kupatHolim: String?

    enum CodingKeys: String, CodingKey {
        case fullName = "full_name"
        case teudatZehut = "teudat_zehut"
        case bloodType = "blood_type"
        case allergies
        case medications
        case conditions
        case kupatHolim = "kupat_holim"
    }
}

struct IceEmergencyContact: Codable {
    let name: String
    let phone: String
    let relation: String?
}

struct IcePrimaryBike: Codable {
    let make: String
    let model: String
    let licensePlate: String?

    enum CodingKeys: String, CodingKey {
        case make
        case model
        case licensePlate = "license_plate"
    }
}
