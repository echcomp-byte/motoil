import json,sys,html,re,urllib.request,urllib.parse,time,os
since=int(open('since.txt').read())
phrases=["I wish there was","is there a tool that","I'd pay for","I would pay for","why is it so hard to","switching from","still doing this manually","still do this manually","does anyone know a tool","looking for a tool","no good solution","I'd happily pay","would gladly pay","pain in the ass","there's no good","hate using","we built an internal tool","spreadsheet hell","copy and paste","manually every week"]
out={}
for p in phrases:
    for page in range(3):
        q=urllib.parse.urlencode({'query':'"%s"'%p,'tags':'comment','numericFilters':'created_at_i>%d'%since,'hitsPerPage':100,'page':page})
        try:
            d=json.load(urllib.request.urlopen('https://hn.algolia.com/api/v1/search_by_date?'+q,timeout=30))
        except Exception as e:
            print('ERR',p,e);break
        for h in d['hits']:
            t=re.sub(r'<[^>]+>',' ',html.unescape(h.get('comment_text') or ''))
            if p.lower() not in t.lower(): continue
            out[h['objectID']]={'id':h['objectID'],'date':h['created_at'][:10],'author':h['author'],'story':h.get('story_title'),'story_id':h.get('story_id'),'phrase':p,'text':t}
        if page>=d['nbPages']-1: break
        time.sleep(0.3)
    print(p,len(out))
json.dump(list(out.values()),open('hn/comments.json','w'))
