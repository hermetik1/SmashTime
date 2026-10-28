"use client";

import Image from "next/image";
import Link from "next/link";
import {assetURL,safeURL,textValue,displayDate,type ContentRecord} from "@/lib/content";
import {EventCountdown,useClock} from "./event-countdown";
import {eventTimestamp} from "@/lib/event-time";
import {fightResult,fightState} from "@/lib/fight";
import {PublicFightcard} from "./public-fightcard";

export function EventDetail({event,records,fights}:{event:ContentRecord;records:ContentRecord[];fights:ContentRecord[]}){
 const image=assetURL(event.data.image),ticket=safeURL(event.data.ticket);
 const now=useClock(),start=eventTimestamp(event.data.date,event.data.time);
 const elapsed=Boolean(now&&start!==null&&start<=now),cancelled=Boolean(event.data.cancelled);
 const canBook=Boolean(ticket&&!elapsed&&!cancelled);
 const reservation=ticket?/(^|\.)instagram\.com$/i.test(new URL(ticket).hostname):false;
 const ticketLabel=reservation?"Platz reservieren":"Tickets beim Anbieter";
 const facts=[["Datum",displayDate(event.data.date)],["Beginn",textValue(event,"time")],["Einlass",textValue(event,"doors")],["Location",textValue(event,"venue")],["Adresse",textValue(event,"address")],["Stadt",textValue(event,"city")]].filter(([,value])=>value);
 return <div className="event-page">
  <section className="premium-detail-hero"><div className={`cinema-wrap premium-detail-grid ${image?"":"without-image"}`}><div><Link href="/events/" className="cinema-label">← Alle Events</Link><h1>{textValue(event,"name")}</h1><p className="premium-detail-sub">{[displayDate(event.data.date),textValue(event,"venue"),textValue(event,"city")].filter(Boolean).join(" · ")}</p>{cancelled&&<p className="cancelled-label">Abgesagt</p>}{textValue(event,"description")&&<p>{textValue(event,"description")}</p>}<div className="event-actions">{canBook&&<a className="cinema-button" href={ticket} target="_blank" rel="noopener noreferrer">{ticketLabel} ↗</a>}<a className="cinema-text-link" href="#fightcard">{elapsed?"Fightcard & Ergebnisse":"Fightcard ansehen"} ↓</a></div></div>{image&&<div className="premium-detail-image"><Image src={image} fill sizes="(max-width:760px) 100vw, 40vw" alt={textValue(event,"name")} priority/></div>}</div></section>
  <div className="cinema-wrap"><nav className="event-section-nav" aria-label="Eventbereiche"><a href="#fightcard">Fightcard{elapsed?" & Ergebnisse":""}</a><a href="#besuch">Tickets & Besuch</a>{event.data.program&&<a href="#programm">Programm</a>}</nav>
   <section className="premium-section event-fights" id="fightcard"><span className="cinema-label">Die Paarungen</span><h2>{elapsed?"FIGHTCARD & ERGEBNISSE.":"DIE FIGHTCARD."}</h2>{elapsed&&!cancelled&&fights.some(f=>fightState(f)!=="Abgesagt"&&!fightResult(f,records))&&<p>Ausstehende Ergebnisse werden nach Prüfung ergänzt.</p>}{fights.length?<PublicFightcard fights={fights} records={records}/>:<p>Bestätigte Paarungen werden nach ihrer Veröffentlichung hier angezeigt.</p>}</section>
   <section className="premium-section event-visitor" id="besuch"><span className="cinema-label">Dein Besuch</span><h2>TICKETS & INFORMATIONEN.</h2><div className="premium-detail-grid"><div><dl className="premium-facts">{facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{!elapsed&&!cancelled&&<EventCountdown event={event}/>}</div><div className="event-ticket-panel"><div className="ticket-grid">{[["Vorverkauf","priceAdvance"],["Abendkasse","priceDoor"]].filter(([,key])=>event.data[key]!==undefined&&event.data[key]!=="").map(([label,key])=><div key={key}><span>{label}</span><strong>{new Intl.NumberFormat("de-AT",{style:"currency",currency:"EUR"}).format(Number(event.data[key]))}</strong><small>{key==="priceDoor"?"Verfügbarkeit vorbehalten":reservation?"Reservierung beim Veranstalter":"Preis laut Veranstalter"}</small></div>)}</div>{event.data.notes&&<p className="article-text">{textValue(event,"notes")}</p>}{canBook?<a className="cinema-button" href={ticket} target="_blank" rel="noopener noreferrer">{ticketLabel} ↗</a>:<p>{cancelled?"Für dieses abgesagte Event werden keine Tickets angeboten.":elapsed?"Der angekündigte Veranstaltungsbeginn liegt in der Vergangenheit.":"Informationen zur Buchung werden hier ergänzt."}</p>}</div></div></section>
   {event.data.program&&<section className="premium-section" id="programm"><span className="cinema-label">Rund um die Kämpfe</span><h2>DAS PROGRAMM.</h2><p className="article-text event-program-copy">{textValue(event,"program")}</p></section>}
  </div>
 </div>;
}
