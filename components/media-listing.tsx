"use client";

import {useState} from "react";
import {useContent} from "./content-provider";
import {ContentStatus,PublicCard} from "./public-content";
import {textValue} from "@/lib/content";

export function MediaListing(){
 const {published,ready,error}=useContent();
 const [query,setQuery]=useState("");
 const [type,setType]=useState("all");
 const media=published.filter(r=>r.kind==="articles"||r.kind==="videos");
 const records=media.filter(r=>(type==="all"||r.kind===type)&&`${textValue(r,"name")} ${textValue(r,"description")}`.toLocaleLowerCase("de").includes(query.trim().toLocaleLowerCase("de"))).sort((a,b)=>textValue(b,"date").localeCompare(textValue(a,"date"))||b.updated_at.localeCompare(a.updated_at)||textValue(a,"name").localeCompare(textValue(b,"name"),"de"));
 return <section className="cinema-wrap premium-section" aria-label="Stories und Videos">
  <div className="premium-toolbar"><label><span className="sr-only">Medien durchsuchen</span><input type="search" placeholder="Stories und Videos suchen …" value={query} onChange={e=>setQuery(e.target.value)}/></label><select aria-label="Medientyp" value={type} onChange={e=>setType(e.target.value)}><option value="all">Alle Medien</option><option value="articles">Stories</option>{media.some(r=>r.kind==="videos")&&<option value="videos">Videos</option>}</select><span className="cinema-label" role="status">{records.length} {records.length===1?"Beitrag":"Beiträge"}</span></div>
  <ContentStatus/>
  <div className="premium-grid">{records.map(r=><PublicCard record={r} key={r.id}/>)}</div>
  {ready&&!error&&!records.length&&<div className="premium-empty"><h2>{media.length?"Keine Treffer.":"Bald mehr aus der Arena."}</h2><p>{media.length?"Versuche einen anderen Suchbegriff oder zeige alle Medien.":"Neue Stories und Videos erscheinen hier nach ihrer Veröffentlichung."}</p>{media.length>0&&<button className="cinema-button" onClick={()=>{setQuery("");setType("all");}}>Filter zurücksetzen</button>}</div>}
 </section>;
}
