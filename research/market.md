# Market file

Running record. Newest run on top. Ideas listed under "Pitched" must never be pitched again.

## Pitched ideas (do not repeat)

| Date | Idea | Pain | Score | Status |
|------|------|------|-------|--------|
| 2026-11-16 | Neighbour recommendation link for local trades (working name: VouchLink) | P1 | 22/25 | test this week |
| 2026-11-16 | Boost commission audit for barbers and stylists (working name: Boost Audit) | P2 | 19/25 | backup |
| 2026-11-16 | Trip close-out checklist for Turo hosts (working name: Trip Closeout) | P3 | 20/25 | novelty doubtful, check FleetSnap first |
| 2026-11-16 | Done-for-you migration off Booksy/Vagaro for salons | P13 | 16/25 | below bar, mentioned on request |
| 2026-11-16 | Subscription finder from uploaded statements, no bank link | P6 | 16/25 | below bar, mentioned on request |
| 2026-11-16 | One-time-fee time clock for 1-3 employees | P17 | 15/25 | below bar, mentioned on request |
| 2026-11-16 | Parcel weight proof against carrier adjustments for resellers | P11 | 15/25 | below bar, mentioned on request |

## Markets to stop watching

- 2026-11-16: Hacker News phrase mining for non-developer ideas. 403 comments gave two small clusters and no payment signal.

---

## Run 1 — 2026-11-16

### Scope and limits

- Asked for "everything", B2B and B2C, founder is a non-coder building with AI tools, no exclusions.
- Evidence base: 2,646 App Store reviews rated 1-3 stars across 76 apps in 12 categories, and 403 Hacker News comments, all dated 2026-10-02 to 2026-11-15.
- Not reachable this run: Reddit, X, G2, Capterra, Trustpilot (network policy; a paid scraping connector was out of credits). Anything attributed to them below came through web search and is marked "via search".
- The market map is shallow: funding, growth and new-entrant data for the last 12 months was not collected in depth. Treat the map as a first sketch.

### Market map

1. **Who pays whom.** Small service businesses and solo sellers pay platforms twice: a subscription, then a cut. Seen in reviews: Nextdoor $89-179/month to reply to neighbours; Booksy Boost 30% of a first visit (via search: $10 minimum, $100-150 maximum, sources disagree); Vendoo $599/year; Turo "30% or more" per one host.
2. **Biggest products and prices seen.** MileIQ $90 to $140/year (reviews); Rocket Money $7-15/month (reviews); NiceJob $75/month and Podium $249-399+/month for review requests (via search, sources disagree); ClassDojo Plus $60-70/year (reviews); YNAB about $100/year (reviews).
3. **Growing.** Vertical software: one secondary source says it took about 40% of 2025 SaaS funding, up from about 20% in 2020 ([SaaSRise](https://www.saasrise.com/blog/vertical-saas-ma-vc-report-2026)). Nextdoor reported Q3 2026 revenue growth of 14% with self-serve SMB advertising at about 69% of revenue ([Finviz](https://finviz.com/news/416838/nextdoor-reports-third-quarter-2026-results)); figures differ between sources.
4. **Dying or under pressure.** Narrow point tools: a Q3 2026 spend report says SMBs are cutting specialist point solutions ([Vertice](https://www.vertice.one/insights/share-of-spend)). Maple (family calendar) is reported to shut down on 2026-12-31 (via search). Splitwise and Rocket Money are drawing heavy paywall anger.
5. **Pay a lot and still complain.** Local trades on Nextdoor (about 45 reviewers), beauty pros on booking marketplaces (about 11), resellers on Vendoo (about 7, $599/year), mileage loggers on MileIQ (about 49).

### Idea 1 — VouchLink (working name) — 22/25

**Pitch.** After every job, a tradesperson texts the customer one link; the customer taps once to copy a ready-made recommendation and post it in their own neighbourhood group, and the pro gets a public "recommended by neighbours in [area]" page.

**Gap.** Nextdoor now charges businesses to answer "need a plumber" posts. Review-request tools (NiceJob, Podium, GatherUp) push Google reviews; a web search found none that target neighbour-group word of mouth. Neighbours can still post; businesses cannot.

**Who has the pain.** Owner-operators of 1-5 person service businesses (painting, plumbing, electrical, pet sitting, handyman), at the moment a neighbour asks for a recommendation and they cannot answer without an $89-179/month plan.

**Proof** (App Store, Nextdoor, https://apps.apple.com/us/app/nextdoor-neighborhood-network/id640360962):
- "has made it so a business is unable to reply onto a post without paying a minimum subscription of $89/month!" — TryingtoMakeABaby, 2026-11-12, review 14780971952
- "The cheapest option was $179! That doesn’t include advertisements that’s just to be able to message people!" — Chris the plumber Pgh, 2026-10-15, review 14671198547
- "So why am I paying for the alerts if I’m not being alerted ? I’m literally watching leads go by" — AcronsStoleMyMoneylol, 2026-11-12, review 14782212150

**Score.** Frequency 5 (about 45 reviewers in 45 days) · Intensity 4 · Willingness to pay 5 (already charged $89-179/month) · Reachability 4 · Buildability 4.

**Competitors and why they miss.**
- Nextdoor for Business: is the cause of the pain.
- NiceJob ($75/month via search), Podium ($249-399+/month via search), GatherUp ($99/month via search): collect Google reviews, priced at or above the Nextdoor fee.
- Thumbtack, Angi: pay-per-lead marketplaces, not word of mouth.
- Facebook groups: free, where reviewers say they are going, no tool for the pro.

**Pricing guess (estimate).** $19/month. Reasoning: must sit far below the $89 floor these owners are refusing, and below NiceJob at $75.

**MVP.**
- Core: pro enters customer name and phone; customer gets an SMS with a page holding a pre-written, editable recommendation, a copy button and a share button; each posted recommendation is logged on the pro's public page.
- Skip: accounts for customers, Google review sync, any posting automation inside Nextdoor or Facebook (against their rules), analytics.
- Stack: Lovable or Claude Code for the web app, Supabase for data, Twilio for SMS, Stripe payment link.
- 14 days: days 1-2 landing page and waitlist; 3-6 send flow and customer page; 7-9 public page; 10-11 Stripe and onboarding; 12-14 run it by hand with 5 pros.

**First 10 customers.** The reviewers themselves are unreachable, so go where they said they were going: local Facebook groups for contractors and "[city] small business" groups, plus trade subreddits. DM: "Saw Nextdoor now charges $89+ a month to answer neighbours. I'm testing a $19 tool that gets your happy customers to recommend you in their own neighbourhood group with one tap. Want me to set it up free for your next 5 jobs?"

**Biggest risk and cheapest test.** Customers may not bother to post. Test this week with no software: for 5 local pros, hand-write the recommendation text, send it to 5 past customers each by SMS, and count how many post within 48 hours. Under 20% posting kills it.

**WHAT WOULD KILL THIS IDEA?**
- Fewer than 1 in 5 customers post when asked.
- Nextdoor or Facebook groups remove such posts as promotional (some reviewers say neighbours were blocked from recommending a business without a page).
- Nextdoor reverses the paywall.
- A review-request tool already has this feature and the search missed it.
- A big player could copy it in a weekend: yes, the feature is simple; the only defence is price and focus.

### Idea 2 — Boost Audit (working name) — 19/25

**Pitch.** A barber uploads their contact list and their Boost charges; the tool flags every commission taken on someone who was already their client and writes the claim to file.

**Gap.** Booksy charges a one-time commission on "new" clients from its marketplace, and pros say existing and referred clients get counted. A search found advice articles from rival booking apps but no tool that audits charges or prepares claims.

**Who has the pain.** Independent barbers and stylists with an established book who switched Boost on, at the moment they see a fee on a regular's or a referral's first Booksy booking.

**Proof** (App Store, Booksy Biz https://apps.apple.com/us/app/booksy-biz-for-businesses/id725335996 and Vagaro Pro https://apps.apple.com/us/app/vagaro-pro/id346778559):
- "This app has been taking money from me for “sending me customers” which are already my customers and charging me outrageous fees and will not refund you your money!" — gchfcjhdxdrhnc, 2026-10-08, review 14642283345
- "they will consider some of your own first time clients as boost clients and take a percentage for the appointment." — Kjmiller333, 2026-10-30, review 14731738291
- "they still take 20% and send you a message that says “this appointment was booked by Vera” even when it wasn’t." — Sportlo, Vagaro, 2026-10-05, review 14630291864

Also via search, not verified at source: Trustpilot reviews and a Better Business Bureau complaint dated 2026-01-18 describe the same charge.

**Score.** Frequency 3 (about 11 reviewers) · Intensity 4 · Willingness to pay 3 · Reachability 5 (barbers are public on Instagram and Booksy) · Buildability 4.

**Competitors and why they miss.**
- Booksy's own claim form in the Boost Clients section: exists, but the pro must assemble the evidence.
- Rival booking apps (Setora, GlossGenius, Square Appointments): answer is "switch to us", which reviewers say is too painful.

**Pricing guess (estimate).** 25% of refunded commission, or $29 for a one-time audit. Reasoning: no result, no fee lowers the trust barrier; fees are $10-150 per client, so recoveries are small.

**MVP.**
- Core: upload phone contacts export and a screenshot or export of Boost charges; match names and numbers; output a list of disputed charges and a filled claim text for each. Add a "before you switch Boost on" checklist.
- Skip: any Booksy login or scraping, automatic claim filing, Vagaro and Fresha support.
- Stack: Lovable or Claude Code web app, Claude API to read screenshots and match records, Stripe.
- 14 days: days 1-3 do 5 audits by hand; 4-8 upload and matching; 9-11 claim text and checklist; 12-14 charge the first users.

**First 10 customers.** Instagram barbers with a Booksy link in bio, and barber Facebook groups. DM: "Does Booksy Boost ever take 30% on clients who were already yours? I'm checking Boost charges for barbers for free this week and writing the refund claims. Want me to check yours?"

**Biggest risk and cheapest test.** Booksy may refuse claims however good the evidence. Test this week: do 5 audits by hand, file the claims, see whether any refund lands.

**WHAT WOULD KILL THIS IDEA?**
- Booksy rejects well-evidenced claims (one reviewer already says refunds are refused).
- Booksy does not let pros export Boost charges or client lists; not confirmed either way.
- Each pro needs it once, so there is no recurring revenue.
- Only about 11 reviewers in 45 days: the pain may be loud but small.
- Booksy can end it by fixing attribution.

### Idea 3 — Trip Closeout (working name) — 20/25, novelty doubtful

**Pitch.** A checklist for Turo hosts that starts a 24-hour countdown at trip end, walks them through timestamped photos, fuel, mileage and smoke checks, and produces a claim-ready packet before the window closes.

**Gap.** Turo requires damage to be reported within 24 hours of trip end and charges a $25 fee when pre-trip photos are missing ([Turo help](https://help.turo.com/en_us/turos-damage-claim-process-us-hosts-SymY8VlN5), via search). Hosts lose fees on the deadline. FleetSnap and RepairSnap already sell damage documentation to hosts; whether they cover the deadline workflow was not checked.

**Who has the pain.** Turo hosts with 1-10 cars, at trip end, especially late or off-site returns.

**Proof** (App Store, Turo https://apps.apple.com/us/app/turo-better-car-rental/id555063314):
- "Turo denied my request for the $150 smoking-related fee because I reported it outside the 24-hour window." — Crumps06, 2026-11-11, review 14779342499
- "Hosts cannot protect their vehicles by declining requests from guests with poor ratings." — CristinaRodC, 2026-11-06, review 14757089755
- "Turo doesn’t provide risk scores or prevent high risk drivers from using your car" — AJ - Crypto User, 2026-11-14, review 14790927553

Only the first quote supports this exact product; the other two are about guest screening, which a third party cannot fix.

**Score.** Frequency 4 (about 12 hosts) · Intensity 5 · Willingness to pay 3 · Reachability 5 (host Facebook groups, r/turo) · Buildability 3.

**Competitors and why they miss.** FleetSnap (AI damage detection and estimates), RepairSnap (claims guide and service), Turo's own trip photos. Unknown whether they miss anything: this is the open question.

**Pricing guess (estimate).** $9 per car per month. Reasoning: one saved $150 fee pays for more than a year.

**MVP.** Core: trip list entered by hand, countdown reminders by SMS, guided photo capture, one PDF packet. Skip: Turo integration, AI damage detection. Stack: Lovable or Claude Code, Supabase, Twilio. 14 days: 1-3 interview 10 hosts; 4-9 checklist and reminders; 10-12 packet; 13-14 pilot with 5 hosts.

**First 10 customers.** Turo host Facebook groups and r/turo. DM: "Have you ever lost a smoking, fuel or damage claim because of Turo's 24-hour window? I'm building a close-out checklist with a countdown. Can I ask what you do today?"

**Biggest risk and cheapest test.** FleetSnap may already do this. Test today: sign up for FleetSnap and RepairSnap and check, then ask 10 hosts what they use.

**WHAT WOULD KILL THIS IDEA?**
- FleetSnap or RepairSnap already covers deadline reminders and claim packets.
- Hosts say Turo's in-app photos are enough and the lost claims are rare.
- Only one of the three quotes is about the deadline; the evidence is thin.
- Turo can add a reminder itself in one release.

### Killed this run

See `pains.md` for the full list with reasons: packing-video proof, mileage tracker, subscription canceller, fast eBay lister, school-mail digest, payday forecast, bill splitting.

### Strongest quote of the night

"So essentially I’m paying money but also I am doing what I paid them to do because they say they can’t." — Anonymous&Mad, Rocket Money, 2026-11-03, review 14748341750
