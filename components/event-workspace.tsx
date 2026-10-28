"use client";
import Link from "next/link";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {Control} from "./control";
import {useContent} from "./content-provider";
import {EditorPreview} from "./editor-preview";
import {PublicFightcard} from "./public-fightcard";
import {fields,displayDate,detailURL,textValue} from "@/lib/content";

const tabs=[['overview','Übersicht'],['visit','Besucher & Tickets'],['fights','Fightcard'],['results','Ergebnisse'],['media','Medien'],['preview','Vorschau']];
const overview=['name','subtitle','date','time','description','image','cancelled','source','slug'];
const visit=['doors','city','venue','address','ticket','priceAdvance','priceDoor','notes','program'];
const results=['fightStatus','resultOutcome','resultMethod','resultRound','resultTime','result','resultConfirmed'];
export function EventWorkspace(){return <Suspense fallback={<main className="control-main">Events werden geladen …</main>}><Workspace/></Suspense>;}
function Workspace(){
 const search=useSearchParams();const {drafts,published,ready,error}=useContent();
 const id=search.get('edit');const tab=tabs.some(([key])=>key===search.get('tab'))?search.get('tab')!:'overview';
 const media=search.get('media')==='videos'?'videos':'articles';
 if(!id||id==='new')return <Control key={id||'list'} kind="events" initialEditor={id||undefined} fieldKeys={["name","date"]} eventLinks/>;
 if(!ready)return <main className="control-main">Event wird geladen …</main>;
 const event=drafts.find(r=>r.kind==='events'&&(r.id===id||r.slug===id));
 if(!event)return <main className="control-main"><h1>Event nicht verfügbar</h1><p>{error||'Dieser Eintrag wurde nicht gefunden.'}</p><Link href="/admin/events/">Zur Eventliste</Link></main>;
 const related=drafts.filter(r=>r.data.event===event.id&&r.status!=='archived');
 const fights=related.filter(r=>r.kind==='fightcards').sort((a,b)=>Number(a.data.order)-Number(b.data.order));
 const href=(key:string,type?:string)=>`/admin/events/?edit=${encodeURIComponent(event.id)}&tab=${key}${type?`&media=${type}`:''}`;
 return <main className="control-main event-workspace">
  <header className="event-workspace-heading"><div><Link href="/admin/events/" className="cinema-label">← Alle Events</Link><h1>{textValue(event,'name')}</h1><p>{displayDate(event.data.date)} · {event.status==='published'?'Veröffentlicht':event.status==='archived'?'Archiviert':'Entwurf'} · {fights.length} Kämpfe</p></div>{published.some(r=>r.id===event.id)&&<Link className="control-outline" href={detailURL(event)} target="_blank">Öffentliche Seite ↗</Link>}</header>
  <nav className="event-workspace-tabs" aria-label="Event-Arbeitsbereiche">{tabs.map(([key,label])=><Link key={key} href={href(key)} scroll={false} aria-current={tab===key?'page':undefined}>{label}{key==='fights'&&<span>{fights.length}</span>}</Link>)}</nav>
  <section aria-label={tabs.find(([key])=>key===tab)?.[1]} key={`${event.id}-${tab}-${media}`}>
   {(tab==='overview'||tab==='visit')&&<Control embedded kind="events" eventId={event.id} initialEditor={event.id} fieldKeys={tab==='overview'?overview:visit}/>}
   {(tab==='fights'||tab==='results')&&<><p className="event-workspace-hint">{tab==='results'?'Ergebnisse direkt am bestehenden Kampf erfassen und vor Veröffentlichung bestätigen.':'Paarungen und Reihenfolge für dieses Event verwalten.'}</p><Control embedded kind="fightcards" initialEditor={search.get("fight")||undefined} eventId={event.id} resultsOnly={tab==='results'} fieldKeys={tab==='results'?results:fields.fightcards.map(f=>f.key).filter(key=>!results.includes(key)||key==='fightStatus').concat('slug')}/></>}
   {tab==='media'&&<><nav className="event-media-tabs" aria-label="Medienart"><Link href={href('media','articles')} scroll={false} aria-current={media==='articles'?'page':undefined}>Stories & News</Link><Link href={href('media','videos')} scroll={false} aria-current={media==='videos'?'page':undefined}>Videos</Link></nav><Control embedded kind={media} initialEditor={search.get("record")||undefined} eventId={event.id}/></>}
   {tab==='preview'&&<><p className="event-workspace-hint">Gespeicherter Entwurf · kompakte Inhaltsvorschau. Die öffentliche Seite zeigt ausschließlich veröffentlichte Inhalte.</p><EditorPreview record={event} records={drafts}/><PublicFightcard fights={fights} records={drafts}/></>}
  </section>
 </main>;
}
