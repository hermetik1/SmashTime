import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "@/components/icons";
import type { Fighter } from "@/lib/demo-data";

export function FighterCard({ fighter, compact = false }: { fighter: Fighter; compact?: boolean }) {
  return (
    <Link className={`fighter-card ${compact ? "fighter-card-compact" : ""}`} href={`/fighters/${fighter.slug}`}>
      <div className={`fighter-portrait portrait-${fighter.accent}`}>
        {fighter.imageSrc ? <Image alt={fighter.name} className="fighter-photo" fill sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 33vw" src={fighter.imageSrc} /> : <span>{fighter.initials}</span>}
        <small>{fighter.origin}</small>
      </div>
      <div className="fighter-card-body">
        <div className="fighter-card-title"><div><span className="fighter-nickname">{fighter.nickname}</span><h3>{fighter.name}</h3></div><ArrowUpRight size={18} /></div>
        <div className="fighter-card-details"><span>{fighter.discipline}</span><span>{fighter.weightClass}</span><span>{fighter.record}</span></div>
        {!compact ? <div className="fighter-card-gym"><MapPin size={14} /> {fighter.gym}</div> : null}
      </div>
    </Link>
  );
}
