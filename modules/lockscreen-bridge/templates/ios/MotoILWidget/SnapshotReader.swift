import CryptoKit
import Foundation
import Security

enum SnapshotReadError: Error {
    case missing
    case keychainLocked
    case keychainOther(OSStatus)
    case decryptionFailed
    case decodeFailed
    case schemaTooNew
}

// Reads the encrypted ICE snapshot blob from the App Group's shared
// UserDefaults, decrypts it with a key kept in the shared Keychain
// access group, decodes JSON, and verifies the schema version is one
// this widget understands.
//
// Blob layout (matches RN writer in src/features/lockscreen/snapshot.ts +
// the writer wrapper that lands in step 3c):
//
//   blob = IV(12B) || AES-256-GCM ciphertext || tag(16B)
//
// All blob bytes are base64-encoded inside UserDefaults.
struct IceSnapshotReader {
    let appGroupId: String
    let keychainKeyAlias: String
    let storageKey: String
    let knownSchemaVersion: Int

    private static let ivLength = 12
    private static let tagLength = 16

    func read() -> Result<IceSnapshot, SnapshotReadError> {
        guard
            let defaults = UserDefaults(suiteName: appGroupId),
            let base64 = defaults.string(forKey: storageKey),
            let blob = Data(base64Encoded: base64)
        else {
            return .failure(.missing)
        }

        guard blob.count >= Self.ivLength + Self.tagLength else {
            return .failure(.decryptionFailed)
        }

        switch fetchKey() {
        case .failure(let e):
            return .failure(e)
        case .success(let keyData):
            return decryptAndDecode(blob: blob, keyData: keyData)
        }
    }

    private func decryptAndDecode(blob: Data, keyData: Data) -> Result<IceSnapshot, SnapshotReadError> {
        let iv = blob.prefix(Self.ivLength)
        let rest = blob.suffix(from: Self.ivLength)
        let cipherEnd = rest.count - Self.tagLength
        let ciphertext = rest.prefix(cipherEnd)
        let tag = rest.suffix(Self.tagLength)

        do {
            let key = SymmetricKey(data: keyData)
            let nonce = try AES.GCM.Nonce(data: iv)
            let sealed = try AES.GCM.SealedBox(nonce: nonce, ciphertext: ciphertext, tag: tag)
            let plaintext = try AES.GCM.open(sealed, using: key)

            let snapshot: IceSnapshot
            do {
                snapshot = try JSONDecoder().decode(IceSnapshot.self, from: plaintext)
            } catch {
                return .failure(.decodeFailed)
            }

            guard snapshot.schemaVersion <= knownSchemaVersion else {
                return .failure(.schemaTooNew)
            }
            return .success(snapshot)
        } catch {
            return .failure(.decryptionFailed)
        }
    }

    // Keychain key is stored as a generic password keyed on the alias,
    // scoped to the App Group access group so both the main app and the
    // extension target can read it. Accessibility is
    // kSecAttrAccessibleAfterFirstUnlock — widget reads work after the
    // first post-boot unlock, never before (LOCKED state in the design
    // doc's §5 state diagram).
    private func fetchKey() -> Result<Data, SnapshotReadError> {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: keychainKeyAlias,
            kSecAttrAccessGroup as String: appGroupId,
            kSecAttrSynchronizable as String: false,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        switch status {
        case errSecSuccess:
            guard let data = item as? Data, data.count == 32 else {
                return .failure(.keychainOther(status))
            }
            return .success(data)
        case errSecInteractionNotAllowed:
            return .failure(.keychainLocked)
        case errSecItemNotFound:
            return .failure(.missing)
        default:
            return .failure(.keychainOther(status))
        }
    }
}
