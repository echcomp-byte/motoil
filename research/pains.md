# Pain database

Format: cluster | who | source apps | distinct reviewers (hand tally, approximate) | pays today? | status.
Window for run 1: 2026-10-02 to 2026-11-15. Source: App Store reviews rated 1-3 stars (2,646 reviews, 76 apps) and 403 Hacker News comments.
App Store reviews have no per-review permalink: each quote lists review id, reviewer name, date and the app page.
"Seen in runs" counts how many nightly runs the cluster reappeared in; flag anything at 3+.

## Run 1 — 2026-11-16

| # | Pain | Who | Apps | Reviewers | Pays today | Score /25 | Status | Seen in runs |
|---|------|-----|------|-----------|------------|-----------|--------|--------------|
| P1 | Local service businesses must pay $89-179/month just to reply to neighbours asking for a pro | plumbers, painters, electricians, pet sitters | Nextdoor | ~45 | yes | 22 | PITCHED (idea 1) |2 — run 2: ~29 reviewers again, prices cited up to $300-700/month for several categories |
| P2 | Booking marketplace charges 20-50% "new client" commission on the pro's own or referred clients | barbers, stylists, spa owners | Booksy, Vagaro, Fresha | ~11 | yes | 19 | PITCHED (idea 2) |2 — run 2: 4 Booksy reviewers, none on Vagaro |
| P3 | Hosts lose fees and claims over the 24-hour reporting window; no guest screening | Turo hosts | Turo | ~12 | yes (platform cut) | 20 | PITCHED (idea 3, novelty doubtful) |2 — run 2: 3 repeats, weak |
| P4 | Sellers film their own packing and still lose "not as described" disputes | resellers | eBay, Poshmark, Mercari, Depop | ~40 | no | 20 | KILLED: SurePack, PackVOD, PackageProof already sell this | 1 |
| P5 | Mileage tracker silently stops recording; MileIQ price rise $90 to $140 | self-employed drivers, realtors | MileIQ, QuickBooks | ~26 + ~23 | yes | 19 | KILLED: crowded (Everlance, Stride, Driversnote; TripLog reported free) and native GPS is hard for a no-code build | 1 |
| P6 | Subscription canceller finds few subscriptions and cannot cancel them | consumers | Rocket Money | ~58 | yes ($7-15/mo) | 16 | KILLED: needs bank data or concierge labour; many rivals | 1 |
| P7 | Forced AI listing flow makes listing 2-3x slower | volume resellers | eBay, Poshmark | ~35 | no | 15 | KILLED: third-party listers exist (Vendoo, Crosslist, Nifty, List Perfectly) | 1 |
| P8 | School and daycare messages buried in noise; calendar sync paywalled | parents | ClassDojo, Procare, brightwheel | ~12 (+~35 paywall) | some ($60-70/yr) | 17 | KILLED: Sense, Cozi Max, Ohai, Parendipity already turn school mail into calendar events | 1 |
| P9 | Removed "Payday View" / safe-to-spend forecast | paycheck-to-paycheck budgeters | Rocket Money, Monarch | ~9 | yes | 18 | KILLED: covered by Subby, YNAB and others | 1 |
| P10 | Splitwise free tier capped; users only want to record offline payments | friends, roommates | Splitwise | ~22 | refuse to pay | 12 | KILLED: no willingness to pay, free clones exist | 1 |
| P11 | Shipping weight auto-assigned, post-sale carrier adjustments wipe out profit | low-margin sellers | eBay, Mercari, Depop | ~24 | no | 15 | WATCH | 1 |
| P12 | Cross-listing auto-delist unreliable, double sales | multi-platform resellers | Vendoo | ~7 | yes ($599/yr cited) | 15 | WATCH: clear payment proof, but hard build and funded rivals | 1 |
| P13 | Want to leave a booking platform but migration is too painful | salon and spa owners | Vagaro, Booksy, GlossGenius, Square | ~6 | yes | 16 | WATCH: possible service add-on to idea 2 |2 — run 2: 5 reviewers (GlossGenius, Vagaro) |
| P14 | Daycare parents lack bulk photo download, itemised invoices, message records | tuition-paying parents | Procare, brightwheel | ~12 | no | 13 | WATCH | 1 |
| P15 | Paying patrons cannot find or resume the content they pay for | Patreon members | Patreon, Kajabi | ~26 | no | 12 | KILLED: platform-only fix | 1 |
| P16 | Payout holds and delays | small sellers and contractors | eBay, Poshmark, Mercari, Depop, Wave, QuickBooks | ~45 | fees | 11 | KILLED: underwriting problem |2 — run 2: ~13 Square reviewers with frozen funds ($2,200, $729, $390) |
| P17 | Time clock loses time, timecards fixed by hand | field-service owners | Housecall Pro, Jobber, FreshBooks, Homebase | ~6 | yes | 14 | WATCH | 1 |
| P18 | YouTube filtering and transcript export | heavy YouTube users | Hacker News | 4 | no | 11 | KILLED: weak, no payment signal | 1 |
| P19 | Restaurant food-safety logs faked or forgotten across stores | multi-store operators | Hacker News | 1 | unknown | n/a | WATCH: single comment | 1 |

## Verified quotes (exact substrings of the pulled reviews)

App pages: Nextdoor https://apps.apple.com/us/app/nextdoor-neighborhood-network/id640360962 ·
Booksy Biz https://apps.apple.com/us/app/booksy-biz-for-businesses/id725335996 ·
Vagaro Pro https://apps.apple.com/us/app/vagaro-pro/id346778559 ·
Turo https://apps.apple.com/us/app/turo-better-car-rental/id555063314 ·
Depop https://apps.apple.com/us/app/depop-buy-sell-clothes/id518684914 ·
MileIQ https://apps.apple.com/us/app/mileiq-mileage-tracker-log/id578830929 ·
Rocket Money https://apps.apple.com/us/app/rocket-money-bills-budgets/id1130616675 ·
Vendoo https://apps.apple.com/us/app/vendoo-a-sellers-best-friend/id1612168777 ·
eBay https://apps.apple.com/us/app/ebay-online-shopping-selling/id282614216 ·
ClassDojo https://apps.apple.com/us/app/classdojo/id552602056

- P1 [14780971952] Nextdoor, 2026-11-12, TryingtoMakeABaby: "has made it so a business is unable to reply onto a post without paying a minimum subscription of $89/month!"
- P1 [14671198547] Nextdoor, 2026-10-15, Chris the plumber Pgh: "The cheapest option was $179! That doesn’t include advertisements that’s just to be able to message people!"
- P1 [14782212150] Nextdoor, 2026-11-12, AcronsStoleMyMoneylol: "So why am I paying for the alerts if I’m not being alerted ? I’m literally watching leads go by"
- P1 [14774776309] Nextdoor, 2026-11-10, JayDoe.47: "It was a good run, will be deleting, back to fb groups until a Nextdoor neighbors alternative pops up."
- P2 [14642283345] Booksy Biz, 2026-10-08, gchfcjhdxdrhnc: "This app has been taking money from me for “sending me customers” which are already my customers and charging me outrageous fees and will not refund you your money!"
- P2 [14731738291] Booksy Biz, 2026-10-30, Kjmiller333: "they will consider some of your own first time clients as boost clients and take a percentage for the appointment."
- P2 [14630291864] Vagaro Pro, 2026-10-05, Sportlo: "they still take 20% and send you a message that says “this appointment was booked by Vera” even when it wasn’t."
- P2 [14680183990] Booksy Biz, 2026-10-17, allfreditoo: "they charged me a fee for my client that I already had."
- P3 [14779342499] Turo, 2026-11-11, Crumps06: "Turo denied my request for the $150 smoking-related fee because I reported it outside the 24-hour window."
- P3 [14757089755] Turo, 2026-11-06, CristinaRodC: "Hosts cannot protect their vehicles by declining requests from guests with poor ratings."
- P3 [14790927553] Turo, 2026-11-14, AJ - Crypto User: "Turo doesn’t provide risk scores or prevent high risk drivers from using your car"
- P4 [14730533235] Depop, 2026-10-30, deadmankillz08: "I record the condition of my items, the entire packaging process, and even the shipment of my packages to ensure I have evidence in case a dispute ever arises."
- P5 [14641044503] MileIQ, 2026-10-08, Mark Hillside: "I could be using for several weeks assuming it’s working as it should, only to find out nothing has been tracked for weeks."
- P5 [14769365002] MileIQ, 2026-11-09, court_stone: "a $50 price increase is absurd. I’m cancelling. Guess I have the month of November to choose another app."
- P6 [14748341750] Rocket Money, 2026-11-03, Anonymous&Mad: "So essentially I’m paying money but also I am doing what I paid them to do because they say they can’t."
- P7 [14702356168] eBay, 2026-10-23, MikeFromRI2013: "I can list 20 items on this other app in the time it takes to list a single item correctly on eBay."
- P8 [14651655517] ClassDojo, 2026-10-10, elijahberto: "Students are in multiple classes, with no way to filter by class. Teachers use it for important announcements, but there’s no search function"
- P9 [14769678647] Rocket Money, 2026-11-09, kfd3796(.;: "Payday view was the main reason I have this app. Will unsubscribe."
- P12 [14633911817] Vendoo, 2026-10-06, Urnicnamehasbeenchosen: "What I got for my $599 yearly subscription was a messed up inventory and a bunch of excuses from their customer service."

Other cluster quotes came from reader summaries that reported machine-checking them; only the quotes listed above were re-checked in the final pass.

## Run 2 — 2026-11-17

Window: 2026-10-18 to 2026-11-16. Source: 2,130 App Store reviews rated 1-3 stars across 12 new or kept categories (lead marketplaces, booking, gig drivers, freelancers, tutors, pet care, hosts, construction, restaurant owners, trucking, events, care). 777 kept after filtering consumer-side noise. Hacker News skipped (on the stop-watching list). Gridwise, Cambly and one review feed returned HTTP 403.

| # | Pain | Who | Apps | Reviewers | Pays today | Score /25 | Status | Seen in runs |
|---|------|-----|------|-----------|------------|-----------|--------|--------------|
| P20 | Pay per lead for leads sold to 4-5 pros, fake or dead leads, wrong-lead charges refunded only as credits or not at all | home-service pros | Thumbtack, Angi, Yelp | ~40 distinct (25 shared leads, 24 fake, 19 no dispute path, overlapping) | yes: $30-300 per lead, up to $1,500/month | 22 | PITCHED (idea 4) | 1 |
| P21 | Deactivated or locked out with no explanation and a dead-end appeal | gig drivers | Uber, DoorDash, Instacart, Flex, Spark | ~24 | lawyers, arbitration | 20 | PITCHED (idea 5, weak moat) | 1 |
| P22 | Airbnb policy from 2026-11-20 bans rental agreements, ID copies, waivers, checkout chores | short-term rental hosts | Airbnb | ~22 | 15.5% host fee | 17 | KILLED as a checker: Airbnb ships its own house-rules checker; screening tools (Truvi, Autohost, SuiteOp) already serve direct bookings | 1 |
| P23 | Airbnb host fee 15.5%, hosts moving to direct booking | hosts | Airbnb, Vrbo | ~15 | 15.5% | 14 | KILLED: direct-booking software is crowded | 1 |
| P24 | Billing continues after cancel, cap or hidden status | local businesses | Yelp, Thumbtack, Angi | ~13 | $150-1,500 | 15 | WATCH: could fold into idea 4 | 1 |
| P25 | Yelp hides genuine 5-star reviews | local businesses | Yelp | ~12 | $1,500/month ads | 10 | KILLED: platform-only | 1 |
| P26 | Ratings and metric hits outside the driver's control, no dispute path | gig drivers | all five | ~17 | no | 15 | WATCH: pairs with P21 | 1 |
| P27 | Paid less than the offer shown; drivers screenshot every offer as proof | gig drivers | Instacart, DoorDash, Uber, Flex | ~10 | no | 15 | WATCH | 1 |
| P28 | Paid truck GPS routes badly, features moved to higher tiers | truck drivers | Trucker Path | ~20 | $20-30/month | 13 | KILLED: needs truck map data | 1 |
| P29 | Pay upfront for bids or messaging and get no jobs | cleaners, caregivers | Turno, Care.com | ~10 | $19-130 | 12 | KILLED: marketplace liquidity problem | 1 |
| P30 | Platform takes 20-25% and pays 48 hours late | pet sitters | Rover | ~8 | 20% | 11 | KILLED: off-platform contact gets sitters banned | 1 |
| P31 | Hosts lose damage claims and refund disputes | hosts | Airbnb | ~14 | fees | 14 | WATCH: same shape as P3 | 1 |

Recurring across both runs: P1 (Nextdoor pay-to-reply), P2 (Booksy Boost), P13 (salon migration), P16 (payout holds). None at 3 runs yet.

### Verified quotes, run 2 (exact substrings of the pulled reviews)

App pages: Thumbtack for Professionals https://apps.apple.com/us/app/thumbtack-for-professionals/id908795016 ·
Yelp for Business https://apps.apple.com/us/app/yelp-for-business-app/id936983378 ·
Uber Driver https://apps.apple.com/us/app/uber-driver-drive-deliver/id1131342792 ·
DoorDash Dasher https://apps.apple.com/us/app/doordash-dasher/id1451754591 ·
Spark Driver https://apps.apple.com/us/app/spark-driver/id1483998235 ·
Airbnb https://apps.apple.com/us/app/airbnb/id401626263 ·
Instacart Shopper https://apps.apple.com/us/app/instacart-shopper-earn-money/id1454056744 ·
Square POS https://apps.apple.com/us/app/square-point-of-sale-pos/id335393788

- P20 [14790956819] Thumbtack Pro, 2026-11-14, CharlieA1016: "They overcharge for leads yet give the same lead to 4-5 people. It honestly sucks."
- P20 [14783045561] Thumbtack Pro, 2026-11-12, mira123£: "Instead, they only issue in-app credits, which just get drained again on more bad leads."
- P20 [14772120837] Thumbtack Pro, 2026-11-09, nick13764: "I was even charged for a lead outside my service area, and my refund was denied."
- P20 [14718213696] Thumbtack Pro, 2026-10-27, joe75854478: "75 leads and only 2 hires this is the worst app I have ever spent money on"
- P20 [14758447381] Yelp for Business, 2026-11-06, Sam Roggers: "I’ve spent over 1k in yelp business and haven’t gotten a single legit lead."
- P20 [14767314425] Yelp for Business, 2026-11-08, Rams1245: "I’m spending $1500 a month and 90% of the leads are trash. But the other 10% is decent enough to make it worth while."
- P21 [14747111430] Uber Driver, 2026-11-03, Quinasia Douglas: "without Uber ever identifying which document was allegedly fraudulent or providing a meaningful opportunity to resolve the issue."
- P21 [14790194436] Spark Driver, 2026-11-14, annoyd19774: "emailed support and have filed appeals but only received generic replies telling me that my account remains deactivated."
- P21 [14766597418] DoorDash Dasher, 2026-11-08, gkoeowke: "they genuinely suck at doing their appeals, they dont read the appeals as i stated my reasons clearly"
- P21 [14703130641] DoorDash Dasher, 2026-10-23, AirBroker: "I got attorneys to represent me and immediately after they closed my account"
- P22 [14710750508] Airbnb, 2026-10-25, Asbie2216: "AirBNB has taken away the ability to screen a guest using their legal ID."
- P22 [14695666096] Airbnb, 2026-10-21, Peregrine1974: "Your town requires you to get ID of renters - nope, not allowed."
- P23 [14698491058] Airbnb, 2026-10-22, GraceGS1987: "Two are already gone, and I now book through VRBO and my own direct site."
- P27 [14761739197] Instacart Shopper, 2026-11-07, MsTonyaR: "Screenshot every batch you get because they will steal your money after you’re done shopping."
- P16 [14780534085] Square POS, 2026-11-11, KDOutdoorsol: "A customer paid me a $2,200 deposit for a job, and Square restricted my account, leaving me completely unable to access the funds."
- P1 [14702530762] Nextdoor, 2026-10-23, Uchiha86: "I can't afford $300-$500 a month just to comment on someone's posts throwing my name in a hat and they might not even respond."

## Run 3 — 2026-11-18

Window: 2026-10-19 to 2026-11-17. Source: 1,207 App Store reviews rated 1-3 stars; 681 kept after filtering. New categories: marketplace sellers, freelance tax and banking, hiring and shift work, real estate agents, HOA and tenant portals, gym software, retail inventory, healthcare, auto repair, cleaning and lawn, events. Niche B2B apps (gym, auto repair, cleaning, real estate agent tools) had 0-3 low reviews each in 30 days: too thin to cluster.

**Correction to "Seen in runs".** The newest review in tonight's pull is dated before 2026-11-16: no review was newer than run 2. The repeats of P1, P2, P13, P16 and P20 in runs 2 and 3 are therefore the same reviews read again through overlapping 30-day windows, not fresh complaints. The "2" values written in run 2 overstate recurrence. From now on a pain counts as "seen again" only when at least 3 reviewers post it with dates after the previous run. On that rule every pain is still at 1.

No new pain reached 18/25 this run.

| # | Pain | Who | Apps | Reviewers | Pays today | Score /25 | Status | Seen in runs |
|---|------|-----|------|-----------|------------|-----------|--------|--------------|
| P32 | Shift worked, pay missing or cut, no proof and no human to dispute with | gig shift workers | Instawork, Wonolo | ~14 | lose whole shifts | 15 | KILLED: same shape as the evidence ideas killed before, no spend | 1 |
| P33 | Directory shows a doctor as in-network when they are not | patients | Zocdoc | ~12 | one "almost $800 bill" | 14 | KILLED: needs insurer data; hard to reach these people | 1 |
| P34 | Records scattered across several branded MyChart apps | patients | MyChart | ~11 | time | 13 | KILLED: Epic-dependent, health-record apps exist | 1 |
| P35 | Fees to pay rent or HOA dues online | tenants, owners | Resident Center, DoorLoop, RentCafe, TownSq | ~12 | $1.99-50 per payment | 11 | KILLED: fee is set by the manager; bank bill-pay already avoids it | 1 |
| P36 | Organic reach gone unless paying for traffic or boosts | live and local sellers | Whatnot, OfferUp | ~9 | $4.99 per post, paid traffic | 13 | WATCH | 1 |
| P37 | Fees to reach your own wages | shift workers, employees | Instawork, Gusto | ~5 | $5 + 5% | 10 | KILLED: platform-only | 1 |
| P38 | Unfair seller reviews or strikes with no appeal | marketplace sellers | Facebook Seller, Amazon, Whatnot | ~5 | n/a | 11 | KILLED: platform-only | 1 |

Re-read, not new evidence: P1 (24 business reviewers in window), P20 (about 44), P2 (3), P13 (2), P16 (8, incl. Amazon $3,500 and TikTok $700 frozen), P24 (10), P25 (9), P5 on QuickBooks (4).

### Verified quotes, run 3

- P32 [14778860614] Instawork, 2026-11-11, Biggy Mike 1, https://apps.apple.com/us/app/instawork-work-when-you-want/id1123819773: "I worked an entire shift for over 7+ hours just for them to say I didn’t show up"
- P33 [14767190978] Zocdoc, 2026-11-08, scoopsss, https://apps.apple.com/us/app/zocdoc-find-and-book-doctors/id391062219: "I got bloodwork done from a place that was listed as in network. A few months after I receive an almost $800 bill."
- P34 [14759660320] MyChart, 2026-11-06, Originaldiode, https://apps.apple.com/us/app/mychart/id382952264: "I have several hospitals and practitioners who all have different versions and names of the same Epic Mychart."
- P35 [14741959342] Resident Center, 2026-11-02, Patrick Angus, https://apps.apple.com/us/app/resident-center/id1466854902: "I have to pay $1.99 to make an EFT payment when I know this free for them."
- P36 [14760201506] Whatnot, 2026-11-06, lenny818181, https://apps.apple.com/us/app/whatnot-shop-sell-connect/id1488269261: "You stop using the pay for traffic and you drop from 10-20 before you paid for service to 2-4 people"
- P16 [14705176479] TikTok Shop Seller Center, 2026-10-24, Kenny B.21, https://apps.apple.com/us/app/tiktok-shop-seller-center/id1591003012: "I made two shops and both got banned by ai pretty much for no reason and $700 just frozen"
- P37 [14742813624] Instawork, 2026-11-02, JOC M.: "There is instant pay which costs 5 dollars with a 5% deduction"

## Run 4 — 2026-11-19

Window: 2026-11-05 to 2026-11-17 (14 days; newest review in the feed is dated 2026-11-17). Source: 2,206 App Store reviews rated 1-3 stars across consumer categories (health and fitness, learning, family, productivity, travel, hobbies, dating and social) plus the tracked lead and booking apps. 517 consumer reviews kept after keyword filtering.

No new pain passed both the 18/25 bar and the novelty check.

Recurrence under the corrected rule (reviews dated after the previous run):
- **P1 Nextdoor pay-to-reply: seen again, now 2 runs.** 3 new business reviewers on 2026-11-16 (review ids 14798921085, 14798831303, 14798522936).
- P20 pay-per-lead: 2 new reviewers on 2026-11-16 (14798671448, 14797681044); below the 3-reviewer rule, stays at 1.
- P2 Booksy Boost: no new reviewer.

| # | Pain | Who | Apps | Reviewers | Pays today | Score /25 | Status | Seen in runs |
|---|------|-----|------|-----------|------------|-----------|--------|--------------|
| P39 | Forced update to version 4 moves paid one-time features (import, scanning, sync) behind a subscription | long-time one-time buyers | Paprika Recipe Manager | 125 low reviews in 14 days; 91 mention paying, 22 mention a replacement | $5-100 one-time; now about $10-15/year per reviewers | 19 | KILLED on novelty: Mela, Crouton, Recipe Shelf, CookBook, AnyList already court Paprika leavers, several with Paprika import | 1 |
| P40 | Basic period logging buried under upsell pop-ups; Apple Health sync removed | free users, ex-subscribers | Flo | ~40 | $40-90/year asked | 12 | KILLED: crowded, Apple ships a free tracker | 1 |
| P41 | Fitbit to Google Health migration removed features and stranded history | long-time Fitbit owners | Google Health (Fitbit), Lose It | ~20 | Premium, lifetime Lose It | 13 | KILLED: depends on Google data access | 1 |
| P42 | Basic editing tools moved to Pro or credits | casual video editors | CapCut | ~18 | $9.99-20/month | 10 | KILLED: needs a full video editor | 1 |
| P43 | Calorie trackers paywall barcode scanner and logging basics | dieters; one nutrition coach wants a client diary | MyFitnessPal, Lose It, Noom | ~18 | $100/year; Noom $160 per 3 months | 13 | KILLED: very crowded; coach diary is 1 reviewer | 1 |
| P44 | Location change paywalled | travellers | Hinge | ~10 | $29.99/month | 6 | KILLED: platform-only | 1 |
| P45 | Price doubled again | long-time note takers | Evernote | 1 with figures ($69 to $129 to $249.99/year) | $249.99/year | n/a | WATCH: single review, check next run | 1 |

Also re-seen in a different app: P30 Rover commission (6 sitters).

### Verified quotes, run 4

- P39 [14764149664] Paprika Recipe Manager 4, 2026-11-07, KMT1733, https://apps.apple.com/us/app/paprika-recipe-manager-4/id1303222868: "Social media importing, recipe scanning, syncing across devices and clipboard importing were available in the previous versions. And now they are not available without upgrading to the premium subscription."
- P39 [14766493805] Paprika, 2026-11-08, Genobi: "But yet another subscription bothers me. Give me a $15 dollar one time purchase to upgrade."
- P39 [14799590961] Paprika, 2026-11-16, Lenny5180: "I paid for features when I bought the previous version to now have them taken away in the new version. I will be looking for a replacement immediately."
- P39 [14770245622] Paprika, 2026-11-09, Nepht: "I’ve exported my recipe library and already moved to a new app."
- P1 [14798831303] Nextdoor, 2026-11-16, Monte the Mechanic: "I have to pay $89 a month just to get mechanic jobs is wild!!"
- P20 [14797681044] Thumbtack for Professionals, 2026-11-16, Sam 99gsjsgsh: "I got charged 62$ because a small hole ( a screw hole ) on the wall I ended up charging the customer 50$"
- P41 [14796462644] Google Health (Fitbit), 2026-11-15, PlatoAndSo, https://apps.apple.com/us/app/google-health-fitbit/id462638897: "My sleep history is clearly there in Google Health, yet there seems to be no way to get the missing records into Apple Health."
- P45 [14754328442] Evernote, 2026-11-05, ImranZ, https://apps.apple.com/us/app/evernote-ai-notes-notebook/id281796108: "they raised pricing from $69 to 129 a year, and now nearly doubling that to $249.99 a year!"
- P43 [14771036253] MyFitnessPal, 2026-11-09, Ddelg12345: "push for paid subscriptions has me looking for a different diary app for me and my clients."

## Run 5 — 2026-11-20

New source: the Israeli App Store (`research/scripts/appstore_pull_il.py`). Window: 2026-09-21 to 2026-11-18 (60 days). 473 reviews rated 1-3 stars across 40 local apps, mostly Hebrew. Israeli business tools (iCount, EZcount, Tranzila, PayPlus, Cardcom, Morning) had 0-2 low reviews: too thin. US tracked apps were not re-pulled tonight, so no recurrence check.

| # | Pain | Who | Apps | Reviewers | Pays today | Score /25 | Status | Seen in runs |
|---|------|-----|------|-----------|------------|-----------|--------|--------------|
| P46 | Ads block time-critical bus info; route sharing and other features moved behind a paywall | commuters, soldiers | Moovit | ~89 | Moovit+ at 7 NIS/month per one reviewer | 19 | KILLED on novelty: reviewers already switch to Egg and "אוטובוס קרוב" | 1 |
| P47 | Hebrew-only banking, card and health-fund apps lock out English, Russian and Arabic speakers | olim, foreign residents | Hapoalim, Cal, Isracard, One Zero, Maccabi, Clalit, myVisit | ~18 (25 reviews mention language) | threaten to switch bank; no figures | 18 | PITCHED (idea 6, borderline) | 1 |
| P48 | Bus arrival times wrong, ghost buses | commuters | Moovit | ~36 | lateness | 8 | KILLED: operator data only | 1 |
| P49 | Late or missing delivery orders, token compensation, bot support | delivery customers | Wolt, 10bis | ~34 | 8-20 NIS compensation on ~100 NIS orders | 11 | KILLED: platform-only | 1 |
| P50 | Taxi apps: no drivers, 12 NIS cancellation fee, drivers ask to cancel and pay cash | riders | Gett, Yango | ~15 | 12 NIS fee; 80 demanded vs 58 quoted | 10 | KILLED: platform-only | 1 |
| P51 | No human support at banks and card companies | customers | One Zero, Cal, Isracard, Hapoalim, bit, PayBox | ~14 | weeks of waiting | 8 | KILLED: platform-only | 1 |
| P52 | Paid listings, dealer priority, stale broker listings, unexplained ad rejections | private sellers and renters | Yad2 | ~13 | not stated | 13 | WATCH | 1 |
| P53 | Unnoticed recurring charges that are hard to cancel | consumers | Pango, Cello, Wolt+, Cal, Morning, 10bis, HopOn | ~10 | not stated | 16 | WATCH: Israeli version of P6; RiseUp and bank tools exist | 1 |
| P54 | Orders cancelled for stock after payment | shoppers | Super-Pharm | ~8 | refunds chased | 7 | KILLED: platform-only | 1 |
| P55 | New fees on transfers and withdrawals | users | bit, Max | ~7 | not stated | 7 | KILLED: platform-only | 1 |

### Verified quotes, run 5 (exact substrings; Israeli App Store)

- P47 [14601032176] Bank Hapoalim, 2026-09-27, L-TON154, https://apps.apple.com/il/app/id362123205: "Leumi already make a 5 languages, you can’t put elementary English. I’m already really think about change the bank"
- P47 [14598593893] Maccabi, 2026-09-27, Cool464565747865, https://apps.apple.com/il/app/id379119093: "accessing appointments, test results, prescriptions, and important medical information should not depend on being fluent in Hebrew"
- P47 [14656823996] Bank Hapoalim, 2026-10-12, איגור555: "אני שוקל ברצינות לעבור לבנק מתחרה שמציע חוויית משתמש נגישה ונוחה יותר"
- P46 [14724829521] Moovit, 2026-10-29, Di-Staple, https://apps.apple.com/il/app/id498477945: "אני צריך לבדוק כמה רחוק האוטובוס, והוא משמיע לי פרסומת, ובסוף אני עומד שם 30 שניות ומחכה שהפרסומות יתנגנו, כשהאוטובוס שלי כבר יוצא."
- P46 [14756427396] Moovit, 2026-11-05, עידו מאוכזב מהאפליקציה שלכם: "באמת שאין לי בעיה לשלם כמה שקלים בשביל אפליקציה טובה"
- P53 [14640957709] Pango, 2026-10-07, Diego Jota, https://apps.apple.com/il/app/id434818173: "אתם לא יודעים שהם מחייבים אתכם כל חודש וכשרוצים לבטל זה בלתי אפשרי להשיג אותם"
- P49 [14654430441] Wolt, 2026-10-11, קלארא, https://apps.apple.com/il/app/id943905271: "תשלמו 100 ₪ ויתנו לכם פצוי של 13.7₪"
- P52 [14693401721] Yad2, 2026-10-21, Y.B16, https://apps.apple.com/il/app/id406318295: "נתנו קדימות לסוחרים לראות את המודעות רכב שעה לפני כל האנשים הפרטיים"

## Run 6 — 2026-11-21 (recurrence check only)

Pulled only reviews dated 2026-11-17 to 2026-11-19 for ten tracked US apps: 96 new low-star reviews. No new categories and no new ideas tonight; the purpose was to test which pitched pains keep arriving.

| Pain | New reviewers since the last check | Result |
|------|-----------------------------------|--------|
| P20 pay-per-lead (idea 4, LeadLedger) | 8: Thumbtack 5, Angi 3 | **Seen again: 2 runs.** New details: billing up to 40% over budget, a "~20% minimum lead cost", Angi credits promised and not paid |
| P39 Paprika subscription | 6 | Seen again: 2 runs (still killed on novelty) |
| P21 gig deactivation (idea 5) | 3: DoorDash 2, Uber 1 | Seen again: 2 runs |
| P1 Nextdoor pay-to-reply (idea 1) | 2 | Below the 3-reviewer rule this run; stays at 2 runs |
| P25 Yelp hides reviews | 1 | No change |
| P2 Booksy Boost (idea 2) | 0 | No change; nothing new since run 1 |
| P3 Turo hosts (idea 3) | 0 (feed returned no new reviews) | No change |

Nothing has reached 3 runs yet. P2 and P3 have had no fresh complaint in three checks: weakest evidence among the pitched ideas.

### Verified quotes, run 6 (US App Store)

- P20 [14809031591] Thumbtack for Professionals, 2026-11-19, jmoneyict: "According to customer service they can actually bill you over your budget by up to 40%. At least 30% of the leads I received were unresponsive."
- P20 [14808625749] Thumbtack for Professionals, 2026-11-19, Vladik I.: "If you request a refund, they have 100 reasons not to give your money back."
- P20 [14804420043] Angi for Pros, 2026-11-18, M&N services: "They say they will credit you back but they never do."
- P1 [14808762612] Nextdoor, 2026-11-19, Josiah Miles: "The only ones paying $150 monthly for a business page are big companies that charge an arm and a leg."
- P39 [14803126194] Paprika Recipe Manager 4, 2026-11-17, Murse Dad: "You sold a lifetime plan then introduced a subscription."

## Run 7 — 2026-11-22 (recurrence check only)

Pulled reviews dated 2026-11-20 for nine tracked US apps (23 low-star) and 2026-11-19 to 2026-11-20 for eight tracked Israeli apps (10 low-star). One new day of US data only.

- No new reviewer on P20 (pay-per-lead), P1 (Nextdoor pay-to-reply), P2 (Booksy Boost), P21 (deactivation) or P47 (Hebrew-only apps) in this window.
- P39 Paprika: 1 new. P46 Moovit ads: 3 new (below the count needed to change status; idea stays killed).
- No status changes. Nothing has reached 3 runs.

## Run 8 — 2026-11-23 (recurrence check only)

One new day of data (2026-11-21): 21 US and 2 Israeli low-star reviews on tracked apps.

- P20 pay-per-lead: 2 new Thumbtack reviewers (14817844823, 14816286009), both on instant charges and slow refunds. Below the 3-reviewer rule; stays at 2 runs.
- P39 Paprika: 1 new. P1, P2, P21, P47: none. P3 Turo: one host complains the app is too slow to upload photos (14817418855), not the claim window.
- No status changes. Nothing has reached 3 runs.

Verified quote: P20 [14817844823] Thumbtack for Professionals, 2026-11-21, Danilonew: "You get charged in a matter of seconds, even before a deal is finalized—but if you request a refund, don’t hold your breath, because the wait is absurdly long."

## Run 9 — 2026-11-24 (recurrence check only)

One new day of data (2026-11-22): 5 US and 2 Israeli low-star reviews on tracked apps. No new reviewer on any pitched or tracked pain. No status changes.

## Run 10 — 2026-11-25 (recurrence check only)

One new day of data (2026-11-23): 22 US and 2 Israeli low-star reviews on tracked apps.

- P25 Yelp hides reviews: 2 new. P39 Paprika: 2 new, one names the replacement ("Switching to Recime", review 14824491207).
- P1 Nextdoor pay-to-reply: 1 new, citing $109/month (review 14824814446). P21 deactivation: 1 new (Uber). P20, P2, P47: none.
- No pain reached 3 new reviewers. No status changes.

Verified quote: P1 [14824814446] Nextdoor, 2026-11-23, Bfagikbfr: "No small business can afford to pay $109 a month just a comment on peoples inquiries and hope to get jobs."

## Run 11 — 2026-11-26 (recurrence check only)

One new day of data (2026-11-24): 10 US and 0 Israeli low-star reviews on tracked apps. Run with the new `research/scripts/recurrence_check.py`.

- P1 Nextdoor: 1 new (review 14828709290: paid $90 for a business account, page removed after 3 days). P20 pay-per-lead: 1 new (14829322059). Others: none.
- No pain reached 3 new reviewers. No status changes.

## Run 12 — 2026-11-27 (recurrence check only)

One new day of data (2026-11-25): 8 US and 1 Israeli low-star reviews on tracked apps. None matches a tracked pain. The App Store lookup failed for Maccabi and Moovit tonight, so those two were not checked. No status changes.

## Run 13 — 2026-11-28 (recurrence check only)

One new day of data (2026-11-26): 19 US and 5 Israeli low-star reviews on tracked apps. The DoorDash lookup failed and was skipped.

- **P39 Paprika subscription: 3 new reviewers (14838562970, 14837143946, 14836823669). Seen again: now 3 runs (runs 4, 6, 13). FLAG: first pain to reach 3 runs.** Status unchanged: killed on novelty, because Mela, Crouton, Recipe Shelf and others already serve leavers; one earlier reviewer named Recime as the replacement.
- **P46 Moovit ads: 3 new reviewers (14837231914, 14837193811, 14836248401). Seen again: now 2 runs.** Still killed on novelty (Egg, אוטובוס קרוב).
- P20 pay-per-lead: 2 new (Thumbtack 14838364057, Angi 14837984567), both about refunds never paid. Below the rule; stays at 2 runs.
- P1, P2, P21, P47: none.

Verified quotes:
- P39 [14836823669] Paprika Recipe Manager 4, 2026-11-26, secretgoldfish: "I paid for this app. Now it’s free with the features locked behind a monthly membership."
- P46 [14837231914] Moovit, 2026-11-26, Avrumiel..: "אי אפשר לתפקד עם האפליקציה אם לא משלמים, בלי סוף פרסומות."
