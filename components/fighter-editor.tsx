"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, ChevronRight } from "@/components/icons";
import type { Fighter } from "@/lib/demo-data";

const imageOptions = [
  { name: "Mike Capellan Rodriguez", src: "/assets/fighters/mike-capellan-rodriguez.webp" },
  { name: "Tanyo Tanev", src: "/assets/fighters/tanyo-tanev.webp" },
  { name: "Denis Berisha", src: "/assets/fighters/denis-berisha.webp" },
  { name: "Liam Stancel", src: "/assets/fighters/liam-stancel.webp" },
];

type FormState = {
  firstName: string;
  lastName: string;
  nickname: string;
  origin: string;
  gym: string;
  discipline: string;
  weightClass: string;
  wins: string;
  losses: string;
  draws: string;
  status: Fighter["status"];
  imageSrc: string;
  publicVisible: boolean;
};

function initialState(fighter?: Fighter): FormState {
  const nameParts = fighter?.name.split(" ") ?? [];
  return {
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
    nickname: fighter?.nickname === "Noch einzutragen" ? "" : fighter?.nickname ?? "",
    origin: fighter?.origin === "—" ? "" : fighter?.origin ?? "",
    gym: fighter?.gym === "Noch einzutragen" ? "" : fighter?.gym ?? "",
    discipline: fighter?.discipline === "Noch einzutragen" ? "" : fighter?.discipline ?? "",
    weightClass: fighter?.weightClass === "Noch einzutragen" ? "" : fighter?.weightClass ?? "",
    wins: fighter?.wins ? String(fighter.wins) : "0",
    losses: fighter?.losses ? String(fighter.losses) : "0",
    draws: fighter?.draws ? String(fighter.draws) : "0",
    status: fighter?.status ?? "In Prüfung",
    imageSrc: fighter?.imageSrc ?? "",
    publicVisible: fighter?.status === "Aktiv" || fighter?.status === "Champion",
  };
}

export function FighterEditor({ initialFighter }: { initialFighter?: Fighter }) {
  const [form, setForm] = useState(() => initialState(initialFighter));
  const [saved, setSaved] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = `${form.firstName}-${form.lastName}`.toLowerCase().trim().replace(/\s+/g, "-");
    window.localStorage.setItem("smashtime-fighter-draft", JSON.stringify({ ...form, slug }));
    setSaved(true);
  }

  return (
    <form className="fighter-editor" onSubmit={save}>
      <div className="fighter-editor-head">
        <div>
          <span className="eyebrow">{initialFighter ? "Profil bearbeiten" : "Neues Profil"}</span>
          <h2>{initialFighter ? initialFighter.name : "Kämpfer:in anlegen"}</h2>
          <p>Öffentliche Angaben können später separat freigegeben werden.</p>
        </div>
        <div className="builder-actions">
          <span className="save-state">{saved ? <><Check size={15} /> Vorschlag gespeichert</> : "Preview-Modus"}</span>
          <button className="button button-dark button-compact" type="submit">Profil speichern <ArrowUpRight size={15} /></button>
        </div>
      </div>

      <div className="fighter-editor-grid">
        <div className="editor-main">
          <section className="editor-section">
            <div className="editor-section-heading"><span>01</span><div><h3>Persönliche Daten</h3><p>Name und öffentlicher Auftritt.</p></div></div>
            <div className="form-grid">
              <label className="form-field" htmlFor="fighter-first-name"><span>Vorname *</span><input id="fighter-first-name" name="firstName" required onChange={(event) => update("firstName", event.target.value)} value={form.firstName} /></label>
              <label className="form-field" htmlFor="fighter-last-name"><span>Nachname *</span><input id="fighter-last-name" name="lastName" required onChange={(event) => update("lastName", event.target.value)} value={form.lastName} /></label>
              <label className="form-field form-field-wide" htmlFor="fighter-nickname"><span>Künstlername / Nickname</span><input id="fighter-nickname" name="nickname" onChange={(event) => update("nickname", event.target.value)} placeholder="z. B. The Falcon" value={form.nickname} /></label>
              <label className="form-field" htmlFor="fighter-origin"><span>Herkunft / Land</span><input id="fighter-origin" maxLength={2} name="origin" onChange={(event) => update("origin", event.target.value.toUpperCase())} placeholder="AT" value={form.origin} /></label>
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading"><span>02</span><div><h3>Sportliche Daten</h3><p>Disziplinen werden frei im System angelegt.</p></div></div>
            <div className="form-grid">
              <label className="form-field" htmlFor="fighter-discipline"><span>Disziplin</span><input id="fighter-discipline" name="discipline" onChange={(event) => update("discipline", event.target.value)} placeholder="z. B. MMA" value={form.discipline} /></label>
              <label className="form-field" htmlFor="fighter-weight"><span>Gewichtsklasse</span><input id="fighter-weight" name="weightClass" onChange={(event) => update("weightClass", event.target.value)} placeholder="z. B. -77 kg" value={form.weightClass} /></label>
              <label className="form-field form-field-wide" htmlFor="fighter-gym"><span>Gym / Team</span><input id="fighter-gym" name="gym" onChange={(event) => update("gym", event.target.value)} placeholder="Teamname" value={form.gym} /></label>
              <label className="form-field" htmlFor="fighter-status"><span>Status</span><select id="fighter-status" name="status" onChange={(event) => update("status", event.target.value as Fighter["status"])} value={form.status}><option>In Prüfung</option><option>Aktiv</option><option>Champion</option></select></label>
            </div>
            <div className="record-fields"><span className="form-label">Kampfrekord</span><div className="record-grid">
              <label className="form-field" htmlFor="fighter-wins"><span>Siege</span><input id="fighter-wins" min="0" name="wins" onChange={(event) => update("wins", event.target.value)} type="number" value={form.wins} /></label>
              <label className="form-field" htmlFor="fighter-losses"><span>Niederlagen</span><input id="fighter-losses" min="0" name="losses" onChange={(event) => update("losses", event.target.value)} type="number" value={form.losses} /></label>
              <label className="form-field" htmlFor="fighter-draws"><span>Unentschieden</span><input id="fighter-draws" min="0" name="draws" onChange={(event) => update("draws", event.target.value)} type="number" value={form.draws} /></label>
            </div></div>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading"><span>03</span><div><h3>Veröffentlichung</h3><p>Kontrolliere, was öffentlich sichtbar wird.</p></div></div>
            <label className="toggle-field" htmlFor="fighter-public"><input checked={form.publicVisible} id="fighter-public" onChange={(event) => update("publicVisible", event.target.checked)} type="checkbox" /><span className="toggle-ui" /><span><strong>Profil öffentlich anzeigen</strong><small>Nur freigegebene und geprüfte Profile sollten aktiviert werden.</small></span></label>
          </section>
        </div>

        <aside className="editor-aside">
          <div className="image-picker">
            <div className="image-picker-head"><div><span className="eyebrow">Profilbild</span><h3>Asset auswählen</h3></div><span className="image-picker-count">{imageOptions.length} Assets</span></div>
            <div className="image-options">
              {imageOptions.map((image) => <button className={`image-option ${form.imageSrc === image.src ? "selected" : ""}`} key={image.src} onClick={() => update("imageSrc", image.src)} type="button"><Image alt={image.name} fill sizes="120px" src={image.src} /><span>{image.name}</span>{form.imageSrc === image.src ? <Check size={15} /> : null}</button>)}
            </div>
            <button className="image-clear" onClick={() => update("imageSrc", "")} type="button">Ohne Bild starten</button>
          </div>
          <div className="editor-help"><span className="eyebrow">Hinweis</span><p>Die vier bereitgestellten Fighter-Assets sind bereits auswählbar. In der produktiven Version werden neue Uploads über Supabase Storage geprüft.</p><Link href="/admin/fighters">Zur Kämpferliste <ChevronRight size={15} /></Link></div>
        </aside>
      </div>
    </form>
  );
}
