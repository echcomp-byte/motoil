# Lockscreen ICE Widget — UI design

Paper design for the native widgets that consume the snapshot from PR #8. Not a spec for the snapshot itself (see RFC #2 for that). Written while step 3 (native) is blocked on RFC freeze — once unblocked, this is the reference Swift/Kotlin implements against.

## 1. Platform reality check

The product brief says "lock screen widget". The platforms don't fully agree on what that means.

| | what "lock screen" means | what we ship |
|---|---|---|
| **iOS 16+** | First-class lock-screen widgets (`accessoryRectangular`, `accessoryCircular`, `accessoryInline`) live below the clock. Monochrome on iOS 16; accentRendering on iOS 17+. | All three accessory families + a Home Screen widget (small + medium) for richer detail after tap. |
| **Android 12+** | No native lock-screen widgets since Android 5. Two adjacent surfaces matter: (a) the home-screen App Widget (always visible after one unlock, then never re-prompts), (b) Always-On Display on Samsung/Pixel — extremely limited, custom complications only on Samsung. | Home Screen AppWidget (collapsed 4×1 + expanded 4×2). AOD is best-effort, OEM-dependent, **out of MVP scope**. Note this expectation gap back to PM before shipping copy. |

The "no unlock" promise is delivered differently on each:

- **iOS**: tapping the lock-screen widget opens the app via `widgetURL`. The app launches in "protected data unavailable" mode — files marked `complete` are unreadable, but our snapshot lives in App Group `UserDefaults` and the key uses `kSecAttrAccessibleAfterFirstUnlock`. So our `(public)/ice.tsx` screen renders fine.
- **Android**: the home-screen widget is a `RemoteViews` snapshot — already rendered; tapping it fires a `PendingIntent` to MainActivity. After one post-boot unlock, all of this works without further auth.

## 2. Information priority (what to drop when space is tight)

Sorted by criticality to a paramedic doing first response. The native layout for each family picks the prefix that fits.

1. **Brand**: "MotoIL ICE" — always present (recognition + opt-in cue for non-MotoIL users seeing someone else's phone).
2. **Blood type** — biggest visual element when present. Red badge.
3. **Full name**.
4. **Emergency contact #1** — name + phone (LTR even in he locale).
5. **Allergies** — first item shown inline, then "+N more" if truncated.
6. **Medications**.
7. **Conditions**.
8. **Teudat zehut** — relevant for hospital handoff, not roadside.
9. **Kupat holim**.
10. **Additional contacts** (#2, #3).
11. **Primary bike** — make + plate (useful for the tow truck, not for triage).

## 3. iOS layouts

### `accessoryRectangular` (lock screen — primary surface)

Size: 160×76 pt on iPhone 14, scales similarly across phones. Monochrome on iOS 16, white tinted; iOS 17+ may render in `.accented` mode.

```
┌──────────────────────────────────┐
│ MotoIL ICE                       │
│ ▣ O+   ישראל ישראלי              │
│ ☎  +972-54-123-4567 (אישה)       │
└──────────────────────────────────┘
```

- Line 1: brand. 11pt SF Pro semibold.
- Line 2: blood-type badge (filled red rounded rect) + name. Name truncates with `…` at first word boundary if needed.
- Line 3: primary contact. Phone is LTR; relation in parens follows reading direction. Falls off if no contact.
- Tap → `motoil://ice`.

### `accessoryCircular`

Size: 72×72 pt. Practically only fits the badge.

```
   ╭───────╮
  │  O+    │
  │  ICE   │
   ╰───────╯
```

- Blood type centered, "ICE" subscript. If `blood_type` is null → show "MotoIL" with a red-cross glyph.

### `accessoryInline`

Status-bar style, one line, no styling.

```
🩸 ICE: O+ — open MotoIL
```

### Home Screen `systemSmall` (158×158 pt)

The widget the user pins on the home screen after onboarding teaches them about the lock-screen one. Full color, more room.

```
┌────────────────────────────┐
│ MotoIL ICE       🩸        │
│ ─────────────────────────  │
│ ישראל ישראלי               │
│ ▣ O+   ת.ז 000000018       │
│                            │
│ אלרגיות: פניצילין          │
│ ☎ דנה ישראלי               │
│   +972-54-123-4567         │
└────────────────────────────┘
```

### Home Screen `systemMedium` (329×158 pt)

Two-column layout. Left: identity + bloods. Right: contacts.

```
┌──────────────────────────────────────────────────────┐
│ MotoIL ICE                                      🩸   │
│ ─────────────────────────────────────────────────── │
│ ישראל ישראלי              │  ☎ דנה ישראלי (אישה)    │
│ ▣ O+    ת.ז 000000018     │    +972-54-123-4567      │
│ כללית                     │                          │
│                           │  ☎ יוסי כהן (אח)         │
│ אלרגיות:                  │    +972-52-765-4321      │
│   פניצילין                │                          │
│ תרופות: קומדין            │  🏍  Yamaha MT-07         │
│ מצבים:  סוכרת סוג 1       │     12-345-67            │
└──────────────────────────────────────────────────────┘
```

## 4. Android layouts

### Collapsed (4×1 — ≈250×80 dp)

```
┌──────────────────────────────────────┐
│ MotoIL ICE                  🩸 O+    │
│ ישראל ישראלי     ☎ +972-54-123-4567 │
└──────────────────────────────────────┘
```

### Expanded (4×2 — ≈250×160 dp)

```
┌──────────────────────────────────────┐
│ MotoIL ICE                  🩸 O+    │
│ ───────────────────────────────────  │
│ ישראל ישראלי                         │
│ ת.ז 000000018  |  כללית              │
│                                      │
│ אלרגיות: פניצילין                    │
│ תרופות: קומדין                       │
│                                      │
│ ☎ דנה ישראלי                         │
│   +972-54-123-4567 (אישה)            │
└──────────────────────────────────────┘
```

### AOD (Samsung/Pixel) — best effort, OEM-dependent

If supportable: a single-line pill at the bottom of the AOD reading "🩸 MotoIL ICE — O+". Not MVP; track as a flag if a stakeholder asks.

## 5. State diagram

Every family renders one of four states. Native code picks based on snapshot read result.

| state | trigger | iOS rectangular copy | Android collapsed copy |
|---|---|---|---|
| **READY** | snapshot present + decryptable + `schema_version` known | per layouts above | per layouts above |
| **EMPTY** | snapshot file absent (first-run, just signed up, no profile data yet) | `MotoIL ICE` / `פתח את MotoIL לעדכון` / `Open MotoIL to update` | same |
| **STALE** | `schema_version > NATIVE_KNOWN_VERSION` (user app is older than widget bundle, unlikely; or vice versa, plausible) | same copy as EMPTY | same |
| **CORRUPT** | decryption fails (wrong tag, IV malformed, key rotated) | same copy as EMPTY | same |
| **LOCKED** (iOS only) | Keychain read returns `errSecInteractionNotAllowed` — device hasn't been unlocked since boot | `MotoIL ICE` / `בטל נעילה פעם אחת לאחר הפעלה` / `Unlock once after reboot` | n/a — Android Keystore alias uses `setUserAuthenticationRequired(false)`, so this branch is unreachable |

Three failure modes (EMPTY/STALE/CORRUPT) deliberately collapse to one user-facing string. Paramedics shouldn't have to distinguish "app outdated" from "blob corrupt"; the action is the same — open the app.

LOCKED is its own state because the action is different and recoverable in one tap: unlock the phone, the widget re-reads on next timeline reload (iOS auto-reloads on first-unlock).

## 6. Color, contrast, type

- **Brand red**: `#E53935` (light), `#EF5350` (dark). Source: HANDOFF Section B. WCAG check: `#E53935` on white = 4.13:1 (just under AA for normal text — use 14pt+ bold or pair with darker text for body); `#EF5350` on dark background `#0E0E0E` = 5.42:1 (passes AA).
- **Blood-type badge**: filled red rounded rect, 4pt corner radius, 16pt height, white text 13pt bold. Always passes AA regardless of mode.
- **Body text**: system label color. On iOS lock-screen this is forced white-tinted in monochrome mode — design must NOT rely on red being visible there. The blood-type "badge" degrades to a white-stroked rect with the type letter inside; still readable.
- **Type**: SF Pro on iOS, Roboto on Android. Hebrew renders via system fallback chain; no custom font shipped.
- **Iconography**: SF Symbols `drop.fill` for blood; `phone.fill` for contact; `figure.outdoor.cycle` (or motorcycle equiv) for bike. Android equivalents from Material Symbols.

## 7. RTL

- Layout direction: trailing-aligned in `he`, leading-aligned in `en`. iOS widgets respect `.environment(\.layoutDirection, .rightToLeft)`; Android `RemoteViews` respects `android:layoutDirection="locale"`.
- Phone numbers: **LTR even in he** — wrap each number in a `Text` with `.environment(\.layoutDirection, .leftToRight)` so `+972-54-123-4567` doesn't get mirrored. Android: `‎` LRM before each phone string.
- Brand "MotoIL ICE": LTR everywhere. It's a product name, not localized.
- Chevrons / disclosure arrows: mirror in RTL via system `Image(systemName:)` which auto-mirrors when given an `.imageScale` and `.environment(\.layoutDirection)`.
- Punctuation: parenthetical relation "(אישה)" — in he the parens should be `(...)` not `(...)` reversed; `‏` RLM before the open paren prevents the renderer from swapping them when adjacent to LTR phone digits.

## 8. Tap behavior — the "no unlock" path

### iOS

```swift
.widgetURL(URL(string: "motoil://ice"))
```

The app already declares `motoil` as its URL scheme (`app.json` → `expo.scheme`). The destination is a new route group `app/(public)/ice.tsx`:

- The `(public)` group is unguarded — `app/_layout.tsx`'s nav guard must let it through when there's no session.
- The screen reads `IceSnapshot` directly from the App Group via a native module (TBD as part of step 3 — a thin Swift `Module` exporting `getSnapshot(): IceSnapshot | null`).
- One button: "סגור / Close" → `Linking.openURL("motoil://")` or just `router.canGoBack() ? router.back() : router.replace('/')`. Closing returns the user to the lock screen.
- **Coordination with Dev D**: he owns `app/_layout.tsx`. Adding a `(public)` route group needs a small change to his nav guard to allow `/(public)/*` pre-auth. Open issue + spec when step 3 starts.

### Android

`PendingIntent.getActivity(context, 0, MainActivity launch intent with route extra, FLAG_IMMUTABLE | FLAG_UPDATE_CURRENT)`. Expo Router reads the deep link the same way.

## 9. Things to flag before native code begins

These either need PM/Dev signoff or are open questions step 3 will hit:

- **`(public)` route group** doesn't exist yet. Owner of the change: Dev D (he owns `_layout.tsx`'s nav guard). Suggest filing the issue when RFC #2 is signed.
- **iOS WidgetKit Extension target** is added via a follow-up plugin (`withWidgetKitTarget`) — not in PR #8's plugin. Tracked in `modules/lockscreen-bridge/README.md` "Future work".
- **Android `motoil_ice_widget_info.xml`** (widget metadata) needs to ship in `android/app/src/main/res/xml/`. Plugin `withAndroidWidget.js` will need a sibling that copies the resource at prebuild — also "Future work".
- **AOD support**: out of MVP per platform reality check (§1). Flag if anyone insists.
- **Lock screen widget previews / discovery**: on iOS, the user has to *manually* add the widget from the lock-screen widget gallery. Onboarding (Dev D) should include a one-screen "add MotoIL ICE to your lock screen — here's how" step with a recorded GIF. File this as a request to Dev D when step 3 lands.
- **Tap-to-call on contact**: should the widget's contact line itself be a `Link(URL(string: "tel:+972..."))` for one-tap call? Pro: paramedic action is faster. Con: in iOS the lock-screen widget tap area is the whole widget — sub-regions don't get separate URLs in `accessoryRectangular`. So this only works inside the home-screen widget. Recommend: yes for `systemMedium`, where each contact line is a discrete `Link`. Document and confirm with PM.

## 10. References

- RFC: https://github.com/echcomp-byte/motoil/issues/2
- Snapshot builder: `src/features/lockscreen/snapshot.ts`
- Native config plugin: `modules/lockscreen-bridge/`
- WidgetKit accessory family docs: Apple "Add widgets to the Lock Screen" (developer.apple.com)
- Android AppWidget sizing: developer.android.com/guide/topics/appwidgets
