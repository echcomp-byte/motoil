import json,urllib.request,urllib.parse,time,datetime,sys
cats={
'il_business':['חשבונית ירוקה morning','iCount','EZcount','Rivhit','Tranzila','Grow payments Meshulam','PayPlus','Cardcom','Wix Owner','Lunch 10bis business'],
'il_payments':['bit ביט','PayBox','Max מקס','Cal כאל','Isracard ישראכרט','Pepper','One Zero bank','Bank Hapoalim','Leumi','Discount bank'],
'il_services':['Yad2','Wolt','10bis תן ביס','Cibus Pluxee','Gett','Moovit','Pango פנגו','Cellopark','Yango','Rav-Pass'],
'il_health_gov':['Maccabi מכבי','Clalit כללית','Meuhedet','Leumit','gov.il','My Visit','Super-Pharm','Shufersal','Rami Levy','Tipat Halav'],
'il_work':['AllJobs','Drushim','Midrag מדרג','Easy איזי','Zap','Madlan','Homeis','Tabit','Ontopo','Fiverr'],
}
cut=datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(days=60)
def get(u):
    for i in range(3):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30))
        except Exception as e: err=e; time.sleep(1.5)
    print('ERR',u,err); return None
allr=[]
for cat,names in cats.items():
    for n in names:
        d=get('https://itunes.apple.com/search?'+urllib.parse.urlencode({'term':n,'entity':'software','country':'il','limit':1}))
        if not d or not d['results']: print('NOAPP',n); continue
        a=d['results'][0]; aid=a['trackId']; cnt=0; tot=0
        for p in range(1,11):
            r=get(f'https://itunes.apple.com/il/rss/customerreviews/page={p}/id={aid}/sortBy=mostRecent/json')
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
