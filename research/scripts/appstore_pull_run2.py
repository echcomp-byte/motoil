import json,urllib.request,urllib.parse,time,datetime,sys
cats={
'lead_marketplaces':['Thumbtack for Professionals','Angi for Pros','Yelp for Business','Nextdoor','Houzz Pro','Google Business Profile'],
'booking_beauty':['Booksy Biz','Vagaro Pro','GlossGenius','StyleSeat','Fresha for business'],
'gig_drivers':['Uber Driver','DoorDash Dasher','Instacart Shopper','Gridwise','Solo gig','Amazon Flex','Spark Driver'],
'freelancers':['Upwork for Freelancers','Fiverr','HoneyBook','Dubsado','Bonsai freelance','Thumbtack'],
'teachers_tutors':['Preply Tutor','italki','Outschool','TakeLessons','Varsity Tutors','Cambly Tutors'],
'pet_care':['Rover','Wag Pet Caregiver','Time To Pet','Gingr','PetDesk','Scout for Pet Care'],
'str_hosts':['Airbnb','Vrbo Owner','Hospitable','Turno','Hostaway','Turo'],
'construction':['Buildertrend','CompanyCam','Procore','JobNimbus','Fieldwire','Raken'],
'restaurant_owners':['DoorDash Business Manager','Uber Eats Manager','Grubhub for Restaurants','Toast Now','Square Point of Sale','Clover Go'],
'trucking':['DAT One','Truckstop Go','Trucker Path','Motive Driver','TruckSmarter','Amazon Relay'],
'photographers_events':['Pixieset','ShootProof','The Knot Pro','Eventbrite Organizer','GigSalad','The Bash'],
'giving_care':['Tithe.ly','Givelify','Care.com','CareLinx','CaringBridge','GoFundMe'],
}
cut=datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(days=30)
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
