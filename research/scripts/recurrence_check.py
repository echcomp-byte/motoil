"""Pull only new low-star reviews for tracked apps and print those that match a tracked pain.

Usage: python3 recurrence_check.py YYYY-MM-DD   (first review date to count as new)
Run from a scratch directory; writes nothing.
"""
import json, re, sys, time, datetime, collections, urllib.request, urllib.parse

CUT = sys.argv[1]
TRACKED = {
    'us': {
        'Thumbtack for Professionals': r'lead|charg|refund|\$\d',
        'Yelp for Business': r'lead|charg|review|\$\d',
        'Nextdoor': r'business|\$\d|lead|subscription',
        'Booksy Biz': r'boost|commission',
        'Angi for Pros': r'lead|charg|refund|credit',
        'Turo': r'\bhost(s|ing)?\b|claim',
        'Paprika Recipe Manager': r'subscri|paid|pay|replac|alternative|switch',
        'Uber Driver': r'deactivat|appeal',
        'DoorDash Dasher': r'deactivat|appeal',
    },
    'il': {
        'Bank Hapoalim': r'english|אנגלית|russian|רוסית|language|שפה',
        'Cal כאל': r'english|אנגלית|russian|רוסית|language|שפה',
        'Isracard ישראכרט': r'english|אנגלית|russian|רוסית|language|שפה',
        'One Zero bank': r'english|אנגלית|russian|רוסית|language|שפה',
        'Maccabi מכבי': r'english|אנגלית|russian|רוסית|language|שפה',
        'Moovit': r'פרסומ|מנוי|\bads?\b|subscri',
    },
}


def get(url):
    for _ in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            return json.load(urllib.request.urlopen(req, timeout=30))
        except Exception:
            time.sleep(1.5)
    return None


norm = lambda s: re.sub(r'\s+', ' ', s)
for country, apps in TRACKED.items():
    counts = collections.Counter()
    newest = '-'
    for name, pattern in apps.items():
        q = urllib.parse.urlencode({'term': name, 'entity': 'software', 'country': country, 'limit': 1})
        found = get('https://itunes.apple.com/search?' + q)
        if not found or not found['results']:
            print('NOAPP', name)
            continue
        app = found['results'][0]
        for page in range(1, 4):
            feed = get(f"https://itunes.apple.com/{country}/rss/customerreviews/page={page}/id={app['trackId']}/sortBy=mostRecent/json")
            entries = (feed or {}).get('feed', {}).get('entry', [])
            if isinstance(entries, dict):
                entries = [entries]
            if not entries:
                break
            old = False
            for e in entries:
                if 'im:rating' not in e:
                    continue
                date = e['updated']['label'][:10]
                newest = max(newest, date)
                if date < CUT:
                    old = True
                    continue
                if int(e['im:rating']['label']) > 3:
                    continue
                counts[app['trackName'][:22]] += 1
                text = e['title']['label'] + ' ' + e['content']['label']
                if re.search(pattern, text, re.I):
                    print(f"- [{e['id']['label']}] {app['trackName'][:22]} | {date} | {e['author']['name']['label']} | {norm(text)[:260]}")
            if old:
                break
            time.sleep(0.2)
    print(country, 'newest review', newest, '| new low-star', sum(counts.values()), dict(counts))
