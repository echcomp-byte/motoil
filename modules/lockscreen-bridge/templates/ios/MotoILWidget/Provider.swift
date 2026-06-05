import WidgetKit

struct IceEntry: TimelineEntry {
    let date: Date
    let state: IceWidgetState
}

enum IceWidgetState {
    case ready(IceSnapshot)
    case empty       // snapshot file absent (new user, no profile yet)
    case stale       // schema_version > knownSchemaVersion (app is older than widget bundle)
    case corrupt     // decryption / decode / generic Keychain error
    case locked      // device not yet unlocked since boot — Keychain returns errSecInteractionNotAllowed
}

// Hourly heartbeat keeps the timeline alive when the app hasn't pushed
// a reload via WidgetCenter — RN-side writeIceSnapshot calls
// WidgetCenter.shared.reloadAllTimelines() on every successful write
// (lands in step 3c), so under normal usage this hourly fallback only
// matters when the user never reopens the app.
private let kRefreshInterval: TimeInterval = 60 * 60

struct IceProvider: TimelineProvider {
    private static let reader = IceSnapshotReader(
        appGroupId: "group.com.echcomp.motoil.ice",
        keychainKeyAlias: "motoil_ice_v1",
        storageKey: "ice_snapshot_v1",
        knownSchemaVersion: 1
    )

    func placeholder(in context: Context) -> IceEntry {
        IceEntry(date: Date(), state: .empty)
    }

    func getSnapshot(in context: Context, completion: @escaping (IceEntry) -> Void) {
        completion(currentEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<IceEntry>) -> Void) {
        let entry = currentEntry()
        let nextRefresh = Date().addingTimeInterval(kRefreshInterval)
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }

    private func currentEntry() -> IceEntry {
        let now = Date()
        switch Self.reader.read() {
        case .success(let snapshot):
            return IceEntry(date: now, state: .ready(snapshot))
        case .failure(.missing):
            return IceEntry(date: now, state: .empty)
        case .failure(.keychainLocked):
            return IceEntry(date: now, state: .locked)
        case .failure(.schemaTooNew):
            return IceEntry(date: now, state: .stale)
        case .failure(.decryptionFailed),
             .failure(.decodeFailed),
             .failure(.keychainOther):
            return IceEntry(date: now, state: .corrupt)
        }
    }
}
