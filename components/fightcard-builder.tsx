"use client";
import {FightVs} from "./fight-vs";

import { useState } from "react";
import { Check, MoveDown, MoveUp, Plus, Trophy } from "@/components/icons";
import type { Fight } from "@/lib/demo-data";

export function FightcardBuilder({ initialFights }: { initialFights: Fight[] }) {
  const [items, setItems] = useState(initialFights);
  const [saved, setSaved] = useState(false);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })));
    setSaved(false);
  }

  return (
    <div className="builder-shell">
      <div className="builder-toolbar"><div><span className="eyebrow">Fightcard Editor</span><h2>SmashTime Night 01</h2></div><div className="builder-actions"><span className="save-state">{saved ? <><Check size={15} /> Gespeichert</> : "Änderungen nicht gespeichert"}</span><button className="button button-dark button-compact" onClick={() => setSaved(true)} type="button">Entwurf speichern</button><button className="button button-lime button-compact" type="button">Veröffentlichen</button></div></div>
      <div className="builder-summary"><span><strong>{items.length}</strong> Kämpfe</span><span><strong>{items.filter((fight) => fight.status === "Bestätigt").length}</strong> bestätigt</span><span><strong>28.06.2026</strong> Eventdatum</span><span><strong>Veröffentlicht</strong> Status</span></div>
      <div className="builder-list">
        {items.map((fight, index) => <div className="builder-row" key={fight.id}><div className="builder-order"><span>0{index + 1}</span><div><button aria-label="Nach oben verschieben" disabled={index === 0} onClick={() => move(index, -1)} type="button"><MoveUp size={15} /></button><button aria-label="Nach unten verschieben" disabled={index === items.length - 1} onClick={() => move(index, 1)} type="button"><MoveDown size={15} /></button></div></div><div className="builder-fight"><div className="builder-fight-head"><span className="builder-fight-label">{fight.titleFight ? <Trophy size={14} /> : null}{fight.label}</span><span className={`status-chip ${fight.status === "Bestätigt" ? "status-chip-green" : "status-chip-neutral"}`}>{fight.status}</span></div><div className="builder-fight-match"><strong>{fight.fighterA}</strong><FightVs/><strong>{fight.fighterB}</strong></div><div className="builder-fight-meta"><span>{fight.discipline}</span><span>{fight.weightClass}</span><span>{fight.rounds}</span></div></div><button aria-label={`${fight.label} bearbeiten`} className="builder-edit" type="button">Bearbeiten</button></div>)}
        <button className="builder-add" type="button"><Plus size={17} /> Kampf hinzufügen</button>
      </div>
    </div>
  );
}

