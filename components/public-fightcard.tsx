import Image from "next/image";
import Link from "next/link";
import {assetURL, detailURL, textValue, type ContentRecord} from "@/lib/content";
import {FightVs} from "./fight-vs";
import styles from "./public-fightcard.module.css";
import {cornerIds,cornerName,fightRole,fightState,fightResult,isTeamFight} from "@/lib/fight";

function Fighter({fighter, side}:{fighter?:ContentRecord; side:"left"|"right"}) {
  const name=fighter?textValue(fighter,"name"):"Wird angekündigt";
  const image=fighter?assetURL(fighter.data.image):"";
  const initials=name.split(/\s+/).filter(Boolean).map(part=>part[0]).slice(0,2).join("");
  const content=<>
    <span className={styles.portrait} aria-hidden="true">
      {image?<Image src={image} alt="" fill sizes="(max-width: 600px) 38vw, 220px"/>:<span className={styles.placeholder}><span>{fighter?initials:"?"}</span><small>SMASHTIME</small></span>}
    </span>
    <span className={styles.identity}>
      <strong className={styles.name}>{name}</strong>
      {fighter?.data.origin&&<span className={styles.origin}>{textValue(fighter,"origin")}</span>}
      {fighter?.data.recordVerified&&<span className={styles.record} aria-label={`${textValue(fighter,"wins")||"0"} Siege, ${textValue(fighter,"losses")||"0"} Niederlagen, ${textValue(fighter,"draws")||"0"} Unentschieden`}>
        {textValue(fighter,"wins")||"0"} – {textValue(fighter,"losses")||"0"} – {textValue(fighter,"draws")||"0"}<small>Siege / Niederlagen / Remis</small>
      </span>}
      {fighter&&<span className={styles.profile}>Profil ansehen <span aria-hidden="true">↗</span></span>}
    </span>
  </>;
  const className=`${styles.fighter} ${side==="right"?styles.right:""}`;
  return fighter?<Link href={detailURL(fighter)} className={className}>{content}</Link>:<div className={className}>{content}</div>;
}

export function PublicFightcard({fights,records}:{fights:ContentRecord[];records:ContentRecord[]}) {
  return <div className={styles.list}>{fights.map(fight=>{
    const team=isTeamFight(fight),state=fightState(fight),result=fightResult(fight,records);
    const discipline=records.find(record=>record.id===fight.data.discipline);
    const label=fightRole(fight),featured=label==="Hauptkampf";
    const details=[team?"2 gegen 2":"",discipline?textValue(discipline,"name"):"Regelwerk folgt",textValue(fight,"weightClass"),fight.data.rounds&&fight.data.minutes?`${textValue(fight,"rounds")} × ${textValue(fight,"minutes")} Min.`:""].filter(Boolean);
    const corner=(side:"A"|"B")=>cornerIds(fight,side).map((id,i)=><Fighter key={`${side}-${i}`} fighter={records.find(r=>r.kind==="fighters"&&r.id===id)} side={side==="A"?"left":"right"}/>);
    return <article key={fight.id} className={`${styles.bout} ${featured?styles.featured:""} ${team?styles.team:""}`} aria-label={`${label}: ${cornerName(fight,"A",records)} gegen ${cornerName(fight,"B",records)}`}>
      <header className={styles.header}><span className={styles.label}>{label}</span>{fight.data.titleFight&&<span className={styles.title}>Titelkampf</span>}{state==="Abgesagt"&&<span className={styles.status}>Abgesagt</span>}<span className={styles.rules}>{details.join(" · ")}</span></header>
      <div className={styles.matchup}>{team?<div className={styles.teamCorner}><span className={styles.cornerLabel}>Rote Ecke</span>{corner("A")}</div>:corner("A")}<span className={styles.vs}><FightVs/></span>{team?<div className={styles.teamCorner}><span className={styles.cornerLabel}>Blaue Ecke</span>{corner("B")}</div>:corner("B")}</div>
      {result&&<div className={styles.result}><span>Ergebnis</span><strong>{result}</strong></div>}
    </article>;
  })}</div>;
}
