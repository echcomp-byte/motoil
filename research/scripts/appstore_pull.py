import json,urllib.request,urllib.parse,time,datetime,sys
cats={
'field_service':['Jobber','Housecall Pro','ServiceTitan Mobile','Workiz','Joist estimates'],
'invoicing_books':['QuickBooks Online Accounting','FreshBooks Invoicing','Wave Invoicing','Invoice2go','Xero Accounting','MileIQ'],
'booking_beauty':['Vagaro Pro','Booksy Biz','Square Appointments','GlossGenius','Fresha for business','Mindbody Business','MoeGo'],
'landlord':['TurboTenant','Avail Landlord','RentRedi','Buildium','Innago','Zillow Rental Manager'],
'shift_restaurant':['Homebase Employee Scheduling','7shifts','When I Work','Toast Now','Connecteam','Deputy shift'],
'sellers':['Etsy Seller','eBay Seller Hub','Shopify','Poshmark','Vendoo','Mercari','Depop'],
'creators':['Later social media','Linktree','Buffer social media','Metricool','Stan Store','Patreon','Kajabi'],
'health_practice':['SimplePractice','TherapyNotes','Jane App','Headway therapist','Trainerize','TrueCoach','My PT Hub'],
'childcare_edu':['Brightwheel','Procare child care','ClassDojo','TutorBird','My Music Staff','TeachersPayTeachers','Lessonspace'],
'personal_finance':['YNAB','Monarch Money','Rocket Money','Copilot Money','Splitwise','Expensify'],
'real_estate_auto':['Follow Up Boss','kvCORE','Turo','Tekmetric','Shopmonkey','Motive Driver','Showingtime'],
'community':['Planning Center Church','TeamSnap','GroupMe','Band app','Heja','SportsEngine','Nextdoor'],
}
cut=datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(days=45)
def get(u):
    for i in range(3):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30))
        except Exception as e: err=e; time.sleep(1.5)
    print('ERR',u,err); return None
allr=[]
for cat,names in cats.items():
    for n in names:
        d=get('https://itunes.apple.com/search?'+urllib.parse.urlencode({'term':n,'entity':'software','country':'us','limit':1}))
        if not d or not d['results']: print('NOAPP',n); continue
        a=d['results'][0]; aid=a['trackId']; cnt=0; tot=0
        for p in range(1,11):
            r=get(f'https://itunes.apple.com/us/rss/customerreviews/page={p}/id={aid}/sortBy=mostRecent/json')
            if not r: break
            es=r.get('feed',{}).get('entry',[])
            if isinstance(es,dict): es=[es]
            if not es: break
            old=False
            for e in es:
                if 'im:rating' not in e: continue
                dt=datetime.datetime.fromisoformat(e['updated']['label'])
                if dt<cut: old=True; continue
                tot+=1
                rt=int(e['im:rating']['label'])
                if rt<=3:
                    cnt+=1
                    allr.append({'cat':cat,'app':a['trackName'],'app_id':aid,'url':a['trackViewUrl'].split('?')[0],'review_id':e['id']['label'],'date':e['updated']['label'][:10],'rating':rt,'author':e['author']['name']['label'],'title':e['title']['label'],'text':e['content']['label'],'votes':e.get('im:voteSum',{}).get('label')})
            if old: break
            time.sleep(0.2)
        print(cat,'|',n,'->',a['trackName'],'|',a.get('sellerName'),'| total45d',tot,'low',cnt,'| rating',a.get('averageUserRating'),a.get('userRatingCount'),flush=True)
json.dump(allr,open('apps/reviews.json','w'))
print(len(allr))
