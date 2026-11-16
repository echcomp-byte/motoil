# Market research memory

Nightly startup-idea research. Not part of the app code.

- `market.md` — running market map and the ideas pitched so far (never pitch the same idea twice).
- `pains.md` — pain database: every recurring complaint cluster, with counts, verified quotes and status.
- `scripts/` — data pulls. Run from a scratch directory, not from the repo:
  - `appstore_pull.py` — 1-3 star App Store reviews from the last 45 days for the tracked apps (writes `apps/reviews.json`; needs an `apps/` dir).
  - `hn_pull.py` — Hacker News comments matching pain phrases (needs `since.txt` with a unix timestamp and an `hn/` dir).

Sources reachable from the cloud environment: `itunes.apple.com`, `hn.algolia.com`, `news.ycombinator.com`, plus web search.
Reddit, X, G2, Capterra and Trustpilot are not reachable directly; anything from them comes through web search and is labelled as such.

Rules: only real complaints with a link; quotes are checked as exact substrings of the pulled data; estimates are labelled.
