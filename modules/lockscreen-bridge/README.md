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
| `iosWidgetExtensionEnabled` | `boolean` | `false` | When `true`, adds an `app_extension` target named `MotoILWidget` to the Xcode project with Sources/Frameworks (WidgetKit, SwiftUI)/Resources build phases, and embeds it into the main app via a `PBXCopyFilesBuildPhase` with the `app_extension` subfolder spec. **Leave `false` until `ios/MotoILWidget/{Info.plist,MotoILWidget.entitlements,MotoILWidget.swift}` exist** — when `true` and those files are missing, the mod logs a warning and the resulting Xcode project will compile the main app fine but fail on the extension target. End-to-end validation requires `npx expo prebuild --clean` after Swift sources land in step 3. |

## Idempotency

Wrapped in `createRunOncePlugin` (keyed on package name + version). The mods themselves de-dup: the App Group is only appended if not already present; the receiver block is skipped if one with the same `android:name` already exists. Safe to re-run `expo prebuild`.

## Why a custom plugin and not raw `ios/` / `android/` edits

The `app.json` overlay (`app.config.ts`) is the contract Expo prebuild reads. If anyone re-runs `expo prebuild --clean`, raw edits to `ios/` and `android/` get blown away. All native config changes for this feature MUST flow through this plugin so the prebuild output is reproducible.

## Templates

`templates/ios/MotoILWidget/` holds the WidgetKit extension's `Info.plist` and `.entitlements` as source-of-truth. They are NOT copied into `ios/` yet — that's a step-3 plugin enhancement (`withWidgetExtensionResources` + `withDangerousMod`). See `templates/README.md` for the copy plan.

The Swift source (`MotoILWidget.swift`) is deliberately absent — it lands when RFC #2 schema v1 is frozen and there's a stable snapshot shape to compile against.

## Future work (post RFC signoff)

- `withWidgetExtensionTarget` **scaffolded** as of an earlier commit (default disabled). Once Swift sources land in step 3, flip `iosWidgetExtensionEnabled: true` in `app.json` and run `npx expo prebuild --clean` to validate the PBX manipulations end-to-end.
- `withWidgetExtensionResources`: copy `templates/ios/MotoILWidget/{Info.plist,MotoILWidget.entitlements,MotoILWidget.swift}` into `ios/MotoILWidget/` during prebuild via `withDangerousMod`. Stub described in `templates/README.md`.
- `withAndroidWidgetResources`: copy `motoil_ice_widget_info.xml` + drawable previews into `android/app/src/main/res/xml/` and `res/drawable/` during prebuild.

## Tracking

- RFC: https://github.com/echcomp-byte/motoil/issues/2
- Owner: Dev B
- Shared-file touches required to activate: `app.json` (Dev D coordination per Section E).
