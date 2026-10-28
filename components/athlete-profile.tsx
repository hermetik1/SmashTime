"use client";

import Image from "next/image";
import Link from "next/link";
import {useSyncExternalStore} from "react";
import {assetURL, detailURL, displayDate, safeURL, textValue, type ContentRecord} from "@/lib/content";
import styles from "./athlete-profile.module.css";
import {cornerIds,fightState,fightResult,isTeamFight} from "@/lib/fight";

const subscribeDay=(notify:()=>void)=>{const timer=setInterval(notify,60000);return()=>clearInterval(timer);};
const currentDay=()=>new Date().toLocaleDateString("sv-SE",{timeZone:"Europe/Vienna"});

export function AthleteProfile({athlete,records,fights}:{athlete:ContentRecord;records:ContentRecord[];fights:ContentRecord[]}) {
  const today=useSyncExternalStore(subscribeDay,currentDay,()=>"");
  const name=textValue(athlete,"name");
  const image=assetURL(athlete.data.image);
  const discipline=records.find(record=>record.kind==="disciplines"&&record.id===athlete.data.discipline);
  const facts=[
    ["Disziplin",discipline?textValue(discipline,"name"):""],
    ["Gewichtsklasse",textValue(athlete,"weightClass")],
    ["Kampfgewicht",athlete.data.weight?`${textValue(athlete,"weight")} kg`:""],
    ["Herkunft",textValue(athlete,"origin")],
    ["Team / Gym",textValue(athlete,"gym")],
  ].filter(([,value])=>value);
  const bouts=fights.map(fight=>{const side=cornerIds(fight,"A").includes(athlete.id)?"A":"B";return {
    fight,
    event:records.find(record=>record.kind==="events"&&record.id===fight.data.event),
    opponents:cornerIds(fight,side==="A"?"B":"A").map(id=>records.find(record=>record.kind==="fighters"&&record.id===id)),
    teammates:cornerIds(fight,side).filter(id=>id!==athlete.id).map(id=>records.find(record=>record.kind==="fighters"&&record.id===id)),
    result:fightResult(fight,records),
    rules:records.find(record=>record.kind==="disciplines"&&record.id===fight.data.discipline),
  };});
  const upcoming=bouts.filter(b=>b.event&&!b.event.data.cancelled&&fightState(b.fight)==="Geplant"&&!b.result&&today&&textValue(b.event,"date")>=today).sort((a,b)=>String(a.event?.data.date??"").localeCompare(String(b.event?.data.date??""))||Number(a.fight.data.order)-Number(b.fight.data.order));
  const history=bouts.filter(b=>!b.event?.data.cancelled&&fightState(b.fight)!=="Abgesagt"&&(b.result||today&&b.event?.data.date&&textValue(b.event,"date")<today)).sort((a,b)=>String(b.event?.data.date??"").localeCompare(String(a.event?.data.date??"")));
  const other=bouts.filter(b=>!upcoming.includes(b)&&!history.includes(b));
  const roster=records.filter(record=>record.kind==="fighters").sort((a,b)=>textValue(a,"name").localeCompare(textValue(b,"name"),"de"));
  const index=roster.findIndex(record=>record.id===athlete.id);
  const previous=roster[index-1],next=roster[index+1];

  function boutList(items:typeof bouts,label:string) {
    if(!items.length)return null;
    return <section className={styles.boutGroup} aria-label={label}>
      <h3>{label}</h3>
      <div className={styles.bouts}>{items.map(({fight,event,opponents,teammates,result,rules})=>{
        const opponent=opponents[0];
        const photo=opponent?assetURL(opponent.data.image):"";
        const opponentName=opponent?textValue(opponent,"name"):"Wird angekündigt";
        return <article className={styles.bout} key={fight.id}>
          <div className={styles.boutPortrait} aria-hidden="true">{photo?<Image src={photo} alt="" fill sizes="80px"/>:<span>{opponentName.split(/\s+/).map(part=>part[0]).slice(0,2).join("")}</span>}</div>
          <div className={styles.boutIdentity}><span className={styles.caption}>{isTeamFight(fight)?"Teamkampf gegen":"Gegen"}</span>{opponents.map((person,i)=>person?<Link key={i} href={`${detailURL(person)}#athlete-overview`} className={styles.opponent}>{textValue(person,"name")} <span aria-hidden="true">↗</span></Link>:<strong key={i} className={styles.opponent}>Wird angekündigt</strong>)}{teammates.length>0&&<span className={styles.boutRules}>Im Team mit {teammates.map((person,i)=>person?<Link key={i} href={`${detailURL(person)}#athlete-overview`}>{textValue(person,"name")} ↗</Link>:<span key={i}>noch nicht angekündigtem Partner</span>)}</span>}<span className={styles.boutRules}>{[rules?textValue(rules,"name"):"",textValue(fight,"weightClass"),textValue(fight,"name")].filter(Boolean).join(" · ")}</span></div>
          <div className={styles.boutEvent}>{event?<><Link href={`${detailURL(event)}#fightcard`}>{textValue(event,"name")} ↗</Link><span>{displayDate(event.data.date)}</span>{event.data.cancelled&&<strong className={styles.cancelled}>Abgesagt</strong>}</>:<span>Event wird angekündigt</span>}</div>
          {fightState(fight)==="Abgesagt"&&<p className={styles.result}>Diese Paarung wurde abgesagt.</p>}
          {result&&<p className={styles.result}><span>Ergebnis</span>{result}</p>}
        </article>;
      })}</div>
    </section>;
  }

  return <div className={styles.profile}>
    <section className={`cinema-wrap ${styles.hero}`} id="athlete-overview" aria-labelledby="athlete-name">
      <Link className={styles.back} href="/fighters/">← Alle Athleten</Link>
      <div className={styles.heroGrid}>
        <div className={styles.portrait}>{image?<Image src={image} alt={name} fill sizes="(max-width: 600px) 48vw, (max-width: 900px) 40vw, 440px" priority/>:<div className={styles.placeholder} aria-hidden="true"><span>{name.split(/\s+/).map(part=>part[0]).slice(0,2).join("")}</span><small>SMASHTIME ATHLETE</small></div>}</div>
        <div className={styles.identity}><span className={styles.eyebrow}>SmashTime / Athlete</span>{athlete.data.nickname&&<p className={styles.nickname}>„{textValue(athlete,"nickname")}“</p>}<h1 className={styles.name} id="athlete-name">{name}</h1><div className={styles.tags}>{[discipline?textValue(discipline,"name"):"",textValue(athlete,"weightClass")].filter(Boolean).map(tag=><span key={tag}>{tag}</span>)}</div></div>
        <div className={styles.recordBlock}><span className={styles.caption}>Kampfrekord</span>{athlete.data.recordVerified?<dl className={styles.record}>{["wins","losses","draws",...(athlete.data.noContests!==undefined&&athlete.data.noContests!==""?["noContests"]:[])].map((key,i)=><div key={key}><dt>{["Siege","Niederlagen","Remis","No Contest"][i]}</dt><dd>{textValue(athlete,key)||"0"}</dd></div>)}</dl>:<p className={styles.pending}>Noch kein bestätigter Rekord veröffentlicht.</p>}{athlete.data.recordVerified&&athlete.data.recordDate&&<p className={styles.recordDate}>Stand: {displayDate(athlete.data.recordDate)}</p>}</div>
      </div>
      <nav className={styles.sectionNav} aria-label="Bereiche dieses Athletenprofils"><a href="#athlete-details">Profil</a>{bouts.length>0&&<a href="#fightcard">Kämpfe <span>{bouts.length}</span></a>}{safeURL(athlete.data.instagram)&&<a href={safeURL(athlete.data.instagram)} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}</nav>
    </section>
    <div className={`cinema-wrap ${styles.content}`}>
      <section id="athlete-details" className={styles.details} aria-labelledby="profile-heading"><h2 id="profile-heading" className={styles.heading}>Das Profil.</h2><div className={`${styles.detailsGrid} ${!facts.length?styles.noFacts:""}`}>
        {facts.length>0&&<dl className={styles.facts}>{facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
        <div className={styles.biography}>{athlete.data.bio?<><h3>Kurzprofil</h3><p>{textValue(athlete,"bio")}</p></>:<p>Weitere Angaben zu diesem Athleten werden ergänzt.</p>}{safeURL(athlete.data.source)&&<a className={styles.source} href={safeURL(athlete.data.source)} target="_blank" rel="noopener noreferrer">Quelle der Profilangaben ↗</a>}</div>
      </div></section>
      <section id="fightcard" className={styles.fights} aria-labelledby="fights-heading"><h2 id="fights-heading" className={styles.heading}>Bei SmashTime.</h2>{bouts.length?<>{boutList(upcoming,"Anstehende Kämpfe")}{boutList(history,"Bisherige Kämpfe")}{boutList(other,"Weitere Paarungen")}</>:<div className={styles.empty}><p>Aktuell ist keine SmashTime-Paarung für {name} veröffentlicht.</p><Link href="/events/">Events entdecken ↗</Link></div>}</section>
      <nav className={styles.rosterNav} aria-label="Weitere Athleten">{previous?<Link href={`${detailURL(previous)}#athlete-overview`}><span>← Vorheriger Athlet</span><strong>{textValue(previous,"name")}</strong></Link>:<Link href="/fighters/"><span>← Zur Übersicht</span><strong>Alle Athleten</strong></Link>}{next&&<Link href={`${detailURL(next)}#athlete-overview`}><span>Nächster Athlet →</span><strong>{textValue(next,"name")}</strong></Link>}</nav>
    </div>
  </div>;
}
