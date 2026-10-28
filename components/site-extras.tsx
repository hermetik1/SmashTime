"use client";
import Image from "next/image";
import Link from "next/link";
import {useSyncExternalStore} from "react";
import {useContent} from "./content-provider";
import {PublicCard,ContentStatus} from "./public-content";
import {assetURL,detailURL,textValue,displayDate,safeURL} from "@/lib/content";

export function HomeUpdates(){
 const {published}=useContent();const stories=published.filter(r=>r.kind==="articles").sort((a,b)=>textValue(b,"date").localeCompare(textValue(a,"date"))).slice(0,3);
 const partners=published.filter(r=>r.kind==="partners");
 return <>{stories.length>0&&<section className="cinema-wrap premium-section"><div className="cinema-section-top"><span className="cinema-label">Aus der Redaktion</span><Link className="cinema-text-link" href="/media">Alle Stories ↗</Link></div><h2>BEYOND <em>THE FIGHT.</em></h2><div className="premium-grid">{stories.map(r=><PublicCard key={r.id} record={r}/>)}</div></section>}{partners.length>0&&<section className="cinema-wrap partner-strip"><span className="cinema-label">Gemeinsam stark / Unsere Partner</span><div>{partners.map(r=><Link key={r.id} href="/partners"><strong>{textValue(r,"name")}</strong><small>{textValue(r,"tier")}</small></Link>)}</div></section>}</>;
}

const subscribe=(notify:()=>void)=>{window.addEventListener("popstate",notify);return()=>window.removeEventListener("popstate",notify);};
export function ArticleDetail(){
 const {published,ready,error}=useContent();const slug=useSyncExternalStore(subscribe,()=>new URLSearchParams(location.search).get("slug")??"",()=>"");
 const record=published.find(r=>r.kind==="articles"&&r.slug===slug);const event=published.find(r=>r.kind==="events"&&r.id===record?.data.event);
 if(!record)return <section className="cinema-wrap premium-section"><ContentStatus/>{ready&&!error&&<><h1>Story nicht verfügbar.</h1><Link href="/media">Zurück zu den Stories</Link></>}</section>;
 const image=assetURL(record.data.image);
 return <article className="cinema-wrap article-page"><Link className="cinema-text-link" href="/media">← Alle Stories</Link><header><span className="cinema-label">{textValue(record,"category")} / {displayDate(record.data.date)}</span><h1>{textValue(record,"name")}</h1><p>{textValue(record,"description")}</p></header>{image&&<div className="article-image"><Image src={image} alt={textValue(record,"name")} fill sizes="(max-width:760px) 100vw, 1000px" priority/></div>}<div className="article-text">{textValue(record,"body").split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>)}</div>{event&&<Link className="cinema-button" href={detailURL(event)}>Zum Event: {textValue(event,"name")} ↗</Link>}{safeURL(record.data.source)&&<p><a className="cinema-text-link" target="_blank" rel="noopener noreferrer" href={safeURL(record.data.source)}>Quelle ↗</a></p>}</article>;
}

export function AboutCopy(){const {published}=useContent();const d=published.find(r=>r.kind==="settings")?.data??{};return <><h2>{String(d.aboutTitle||"MEHR ALS EIN KAMPF.")}</h2><p className="cinema-copy article-text">{String(d.aboutBody||"SmashTime bringt Kampfsport und Live-Erlebnis in St. Pölten zusammen. Leistung, Respekt und Gemeinschaft gehören für uns auf dieselbe Bühne.")}</p></>;}
