# Illustrations brief — onboarding

4 illustrations are needed for the onboarding flow. Until they land, the screens fall back to a 120pt emoji (set in each screen's `illustration` prop). Replace by dropping the asset into `assets/onboarding/` and swapping the emoji `<Text>` for an `<Image>` or `<SvgUri>`.

To be commissioned in Phase 2 polish (post-MVP freeze, after 2026-06-12).

| screen | route | placeholder | brief |
|---|---|---|---|
| Welcome | `app/(onboarding)/welcome.tsx` | 🏍️ | A rider on a motorcycle, calm/confident — sets the brand tone. Avoid action shots; this is the first impression, not a hero shot. |
| What is ICE | `app/(onboarding)/what-is-ice.tsx` | (TBD next session) | "ICE = In Case of Emergency" — a card / wallet / phone with a clearly-marked emergency badge. Show the concept, not the app UI. |
| How it saves lives | `app/(onboarding)/how-it-saves-lives.tsx` | (TBD next session) | A first-responder reading the card at the scene of an accident. Keep tasteful — no blood, no panic. Focus on the transfer of information. |
| Let's begin | `app/(onboarding)/lets-begin.tsx` | (TBD next session) | A finished card / completion checkmark / road ahead. Forward motion, positive tone. |

## Constraints

- **Style:** flat or semi-flat. No photographic. Hebrew users skew younger and prefer illustrated apps over photo-realistic ones for safety contexts.
- **Format:** SVG preferred (scales for all densities, dark-mode friendly via `currentColor`). PNG @1x/@2x/@3x acceptable as fallback.
- **Color:** primary brand `#E53935` (light) / `#EF5350` (dark) — see `src/lib/theme/colors.ts`. Illustrations should adapt or be neutral enough to read on both.
- **Aspect:** roughly square (1:1). The `OnboardingScreen` layout primitive gives the illustration the upper `flex:1` slot.
- **RTL:** if directional (rider facing a direction, arrow, etc.), face right-to-left or be neutral. The app is Hebrew-first.
- **Accessibility:** alt text per illustration — Dev D will wire `accessibilityLabel` from i18n.

## Process

1. PM commissions illustrator.
2. Illustrator delivers SVG + 1x/2x/3x PNG fallback per screen.
3. Drop into `assets/onboarding/{welcome,what-is-ice,how-it-saves-lives,lets-begin}.svg`.
4. Dev D swaps the emoji `<Text>` for an `<Image>` or `<SvgUri>` in each screen and removes the `TODO(post-MVP)` comment.
5. Verify on iOS + Android, light + dark mode, RTL.
