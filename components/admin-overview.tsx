"use client";
import Link from "next/link";
import {useState} from "react";
import {useContent} from "./content-provider";
import {useClock} from "./event-countdown";
import {nextEvent,eventTimestamp} from "@/lib/event-time";
import {adminRecordURL} from "@/lib/admin-links";
import {assetURL,displayDate,labels,textValue} from "@/lib/content";

export function AdminOverview(){
 const {drafts,published}=useContent();const now=useClock();const [tab,setTab]=useState("tasks");const [page,setPage]=useState(1);
 const active=drafts.filter(r=>r.status!=="archived");const event=now?nextEvent(published,now):undefined;
 const tasks=active.filter(r=>r.kind==="fighters"&&(!assetURL(r.data.image)||!r.data.recordVerified));
 const pending=active.filter(r=>r.status==="draft");const recent=[...active].sort((a,b)=>b.updated_at.localeCompare(a.updated_at));
 const records=tab==="tasks"?tasks:tab==="drafts"?pending:recent;
 const pages=Math.max(1,Math.ceil(records.length/6));const current=Math.min(page,pages);
 const days=event&&now?Math.ceil((eventTimestamp(event.data.date,event.data.time)!-now)/86400000):null;
 return <div className="admin-overview">
  <section className="admin-next-event"><div><span className="cinema-label">Nächstes veröffentlichtes Event</span><h2>{event?textValue(event,"name"):"Nächstes Event planen"}</h2><p>{event?[displayDate(event.data.date),textValue(event,"venue"),textValue(event,"city")].filter(Boolean).join(" · "):"Noch kein kommendes Event mit Datum und Beginn veröffentlicht."}</p></div><div className="admin-next-actions">{days!==null&&<span className="control-status published">{days<=1?"In weniger als 24 Stunden":`In ${days} Tagen`}</span>}<Link className="control-outline" href={event?adminRecordURL(event):"/admin/events/"}>{event?"Event verwalten →":"Events öffnen →"}</Link></div></section>
  <section className="admin-worklist" aria-label="Redaktionelle Arbeit">
   <div className="admin-list-tabs" role="group" aria-label="Arbeitslisten">{[["tasks","Offene Aufgaben",tasks.length],["drafts","Entwürfe",pending.length],["recent","Zuletzt bearbeitet",recent.length]].map(([key,label,count])=><button key={key} aria-pressed={tab===key} onClick={()=>{setTab(String(key));setPage(1);}}>{label}<span>{count}</span></button>)}</div>
   <p className="admin-list-description">{tab==="tasks"?"Athleten mit fehlendem Portrait oder ungeprüftem Rekord. Beide Hinweise stehen am selben Eintrag.":tab==="drafts"?"Gespeicherte Entwürfe prüfen und gezielt veröffentlichen.":"Die zuletzt geänderten Inhalte, unabhängig vom Bereich."}</p>
   <div className="admin-worklist-rows">{records.slice((current-1)*6,current*6).map(r=><Link className="admin-work-row" href={adminRecordURL(r)} key={r.id}><div><strong>{textValue(r,"name")}</strong><small>{labels[r.kind]}{tab==="recent"?` · ${new Date(r.updated_at).toLocaleDateString("de-AT")}`:""}</small></div><div className="admin-row-labels">{tab==="tasks"?<>{!assetURL(r.data.image)&&<span>Portrait fehlt</span>}{!r.data.recordVerified&&<span>Rekord ungeprüft</span>}</>:<span>{r.status==="draft"?"Entwurf":"Veröffentlicht"}</span>}<b aria-hidden="true">→</b></div></Link>)}{!records.length&&<p className="admin-list-empty">{tab==="tasks"?"Keine offenen Portrait- oder Rekordprüfungen.":"Keine Einträge in dieser Ansicht."}</p>}</div>
   {pages>1&&<nav className="control-pagination" aria-label="Arbeitslistenseiten"><button className="control-outline" disabled={current===1} onClick={()=>setPage(current-1)}>← Zurück</button><span>Seite {current} von {pages}</span><button className="control-outline" disabled={current===pages} onClick={()=>setPage(current+1)}>Weiter →</button></nav>}
  </section>
 </div>;
}
