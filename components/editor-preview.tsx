"use client";
import {PublicFightcard} from "./public-fightcard";
import Image from "next/image";
import {useState} from "react";
import {sectionPrefixes,assetURL,displayDate,textValue,type ContentRecord} from "@/lib/content";
import {EventCountdown} from "./event-countdown";

export function EditorPreview({record:r,records,section="Startseite"}:{record:ContentRecord;records:ContentRecord[];section?:string}) {
 const [mobile,setMobile]=useState(false);const settings=r.kind==="settings";const prefix=settings?sectionPrefixes[section]:undefined;const image=assetURL(prefix?r.data[`${prefix}PageImage`]:r.data.image);
 const lookup=(id:unknown)=>records.find(x=>x.id===id)?.data.name||"Noch nicht ausgewählt";
 return <section className="editor-preview"><div className="preview-toolbar"><div><span className="cinema-label">Live-Vorschau</span><p>Dein aktueller Entwurf · noch nicht veröffentlicht</p></div><div role="group" aria-label="Vorschaugröße"><button type="button" aria-pressed={!mobile} onClick={()=>setMobile(false)}>Breit</button><button type="button" aria-pressed={mobile} onClick={()=>setMobile(true)}>Mobil</button></div></div><div className={`preview-canvas ${mobile?"mobile":""}`}><article className={`preview-content preview-${r.kind}`}>
 {image&&<div className="preview-image"><Image src={image} alt={textValue(r,"name")} fill sizes="(max-width:760px) 100vw, 600px"/></div>}
 <div className="preview-body"><span className="cinema-label">{textValue(r,"category")||textValue(r,"tier")||"SmashTime"}</span><h2>{prefix?textValue(r,`${prefix}PageTitle`)||section:settings?textValue(r,"headline"):textValue(r,"name")||"Dein Titel"}{settings&&<><br/><em>{textValue(r,prefix?`${prefix}PageAccent`:"headline2")}</em></>}</h2>
 <p>{textValue(r,prefix?`${prefix}PageCopy`:settings?"intro":r.kind==="fighters"?"bio":"description")}</p>
 {r.kind==="fighters"&&<><p>{[r.data.weightClass,r.data.origin,r.data.gym].filter(Boolean).join(" · ")}</p>{r.data.recordVerified?<div className="preview-stats">{["wins","losses","draws"].map((key,i)=><div key={key}><strong>{textValue(r,key)||"0"}</strong><span>{["Siege","Niederlagen","Unentschieden"][i]}</span></div>)}</div>:<p>Kampfrekord noch nicht bestätigt.</p>}</>}
 {r.kind==="events"&&<><p>{displayDate(r.data.date)} · {textValue(r,"venue")}<br/>{textValue(r,"city")} · Beginn {textValue(r,"time")||"folgt"}</p><EventCountdown event={r}/><p>{textValue(r,"notes")}</p></>}
 {r.kind==="fightcards"&&<><p>{String(lookup(r.data.event))} · Position {textValue(r,"order")}</p><PublicFightcard fights={[r]} records={records}/></>}
 {r.kind==="articles"&&<><p>{displayDate(r.data.date)}</p><div className="article-text">{textValue(r,"body").split(/\n\s*\n/).map((p,i)=><p key={i}>{p}</p>)}</div></>}
 {settings&&<><hr/><h3>{textValue(r,"aboutTitle")||"Unsere DNA"}</h3><p>{textValue(r,"aboutBody")||textValue(r,"manifest")}</p><p>{textValue(r,"footerText")}</p></>}
 </div></article></div></section>;
}

