import {FightVs} from "./fight-vs";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Trophy } from "@/components/icons";
import type { Fight } from "@/lib/demo-data";

export function FightCard({ fight, featured = false }: { fight: Fight; featured?: boolean }) {
  return (
    <article className={`fight-card ${featured ? "fight-card-featured" : ""}`}>
      <div className="fight-card-topline">
        <span className="fight-number">0{fight.order}</span>
        <span className="fight-label">{fight.titleFight ? <Trophy size={14} /> : null}{fight.label}</span>
        <span className={`status-dot status-${fight.status === "Bestätigt" ? "confirmed" : "planned"}`}>{fight.status}</span>
      </div>
      <div className="fight-matchup">
        <div className="fighter-side fighter-side-a">
          <span className="fighter-avatar avatar-lime">{fight.fighterA.split(" ").map((part) => part[0]).join("")}</span>
          <div><strong>{fight.fighterA}</strong><span>{fight.fighterARecord}</span></div>
        </div>
        <FightVs/>
        <div className="fighter-side fighter-side-b">
          <div><strong>{fight.fighterB}</strong><span>{fight.fighterBRecord}</span></div>
          <span className="fighter-avatar avatar-rose">{fight.fighterB.split(" ").map((part) => part[0]).join("")}</span>
        </div>
      </div>
      <div className="fight-meta"><span>{fight.discipline}</span><span>{fight.weightClass}</span><span>{fight.rounds}</span><span>{fight.type}</span></div>
      {featured ? <Link className="fight-card-link" href="/events/smashtime-night-01">Kampfdetails <ArrowUpRight size={15} /></Link> : null}
    </article>
  );
}

export function CompactFightRow({ fight }: { fight: Fight }) {
  return (
    <Link className="compact-fight-row" href="/events/smashtime-night-01">
      <span className="compact-fight-order">0{fight.order}</span>
      <span className="compact-fight-names"><strong>{fight.fighterA}</strong><FightVs/><strong>{fight.fighterB}</strong></span>
      <span className="compact-fight-meta">{fight.weightClass} · {fight.discipline}</span>
      <ChevronRight size={17} />
    </Link>
  );
}

