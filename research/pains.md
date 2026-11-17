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
