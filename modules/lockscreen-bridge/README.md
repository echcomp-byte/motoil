# lockscreen-bridge

MotoIL Expo config plugin. Owns the **native config surface** for the lock-screen ICE widget:

- **iOS**: adds the App Group entitlement to the main app target so RN and the WidgetKit Extension can share an encrypted snapshot via `UserDefaults(suiteName:)`.
- **Android**: registers the `AppWidgetProvider` receiver in `AndroidManifest.xml`.

Does **not** scaffold the WidgetKit Extension Xcode target itself, nor the AppWidgetProvider Kotlin class — those land in a follow-up plugin pass (post Dev A RFC signoff). Until then this plugin only opens the door.

## Install

Already vendored at `modules/lockscreen-bridge/` — no `npm install` step. Register in `app.json` plugins array. **Do this in a dedicated PR, not bundled with feature work** (`docs/HANDOFF.md` Section E lists `app.json` as a shared, coordinate-first file).

```jsonc
{
  "expo": {
    "plugins": [
      "expo-router",
      "expo-status-bar",
      "expo-localization",
      "expo-apple-authentication",
      [
        "./modules/lockscreen-bridge",
        {
          "appGroupIdentifier": "group.com.echcomp.motoil.ice",
          "androidWidgetReceiverClass": null
        }
      ]
    ]
  }
}
```

## Config schema

| key | type | default | effect |
|---|---|---|---|
| `appGroupIdentifier` | `string \| null` | `"group.com.echcomp.motoil.ice"` | Adds to `com.apple.security.application-groups` in the iOS entitlements. Set to `null` to skip the iOS mod entirely. |
| `androidWidgetReceiverClass` | `string \| null` | `null` | Fully-qualified Java class name (e.g. `"com.echcomp.motoil.widget.IceWidgetProvider"`). When set, registers a `<receiver>` block with an `APPWIDGET_UPDATE` intent-filter and a `meta-data` pointer to `@xml/motoil_ice_widget_info`. **Leave `null` until the Kotlin class and `res/xml/motoil_ice_widget_info.xml` actually exist in the prebuilt project** — registering a receiver against a missing class will crash on broadcast. |
| `iosWidgetExtensionEnabled` | `boolean` | `false` | When `true`: (a) `withWidgetExtensionResources` copies `templates/ios/MotoILWidget/` into `<platformProjectRoot>/MotoILWidget/` via `withDangerousMod` (allowlist of `.swift`/`.plist`/`.entitlements`/`.json`/`.png`/`.pdf`/`.xcassets` — tooling debris like Ruflo's `ruvector.db` is filtered out); (b) `withWidgetExtensionTarget` adds an `app_extension` target named `MotoILWidget` to the Xcode project with Sources/Frameworks (WidgetKit, SwiftUI)/Resources build phases, and embeds it into the main app via a `PBXCopyFilesBuildPhase` with the `app_extension` subfolder spec. The two mods run in that order so the target registration sees files already on disk. Templates today include `Info.plist`, `MotoILWidget.entitlements`, and the six Swift sources (`IceSnapshot`, `SnapshotReader`, `Provider`, `WidgetView`, `MotoILWidget`, `MotoILWidgetBundle`); `warnIfSwiftMissing` stays quiet when they're present. End-to-end validation requires `npx expo prebuild --clean` and an Xcode build on a real device. |

## Idempotency

Wrapped in `createRunOncePlugin` (keyed on package name + version). The mods themselves de-dup: the App Group is only appended if not already present; the receiver block is skipped if one with the same `android:name` already exists. Safe to re-run `expo prebuild`.

## Why a custom plugin and not raw `ios/` / `android/` edits

The `app.json` overlay (`app.config.ts`) is the contract Expo prebuild reads. If anyone re-runs `expo prebuild --clean`, raw edits to `ios/` and `android/` get blown away. All native config changes for this feature MUST flow through this plugin so the prebuild output is reproducible.

## Templates

`templates/ios/MotoILWidget/` holds the WidgetKit extension's `Info.plist` and `.entitlements` as source-of-truth. `withWidgetExtensionResources` copies them into `<platformProjectRoot>/MotoILWidget/` at prebuild time when `iosWidgetExtensionEnabled: true`. See `templates/README.md` for the copy ordering rationale.

The Swift sources land alongside `Info.plist` and `.entitlements` — six files total: `IceSnapshot.swift` (Codable mirror of the RN snapshot schema v1), `SnapshotReader.swift` (App Group `UserDefaults` + Keychain access group + AES-256-GCM decrypt via CryptoKit), `Provider.swift` (`TimelineProvider` with the five-state machine from `widget-ui.md §5`), `WidgetView.swift` (SwiftUI rendering, iOS-16-safe — no `containerBackground`/`contentMarginsDisabled` which are iOS-17-only), `MotoILWidget.swift` (Widget config + supported families), `MotoILWidgetBundle.swift` (`@main` entry).

## Future work (post RFC signoff)

- `withWidgetExtensionTarget` **scaffolded** as of an earlier commit (default disabled). Once Swift sources land in step 3, flip `iosWidgetExtensionEnabled: true` in `app.json` and run `npx expo prebuild --clean` to validate the PBX manipulations end-to-end.
- `withAndroidWidgetResources`: copy `motoil_ice_widget_info.xml` + drawable previews into `android/app/src/main/res/xml/` and `res/drawable/` during prebuild — mirror of `withWidgetExtensionResources` for the Android receiver class assets.

## Tracking

- RFC: https://github.com/echcomp-byte/motoil/issues/2
- Owner: Dev B
- Shared-file touches required to activate: `app.json` (Dev D coordination per Section E).
