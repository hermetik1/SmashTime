import { z } from "zod";
import { fighters, events } from "./demo-data";
import {fightFormats,fightStates,fightRoles,fightOutcomes,fightMethods,participantIds,validateFight} from "./fight";

export const kinds = ["fighters", "events", "disciplines", "fightcards", "partners", "videos", "articles", "settings"] as const;
export type Kind = typeof kinds[number];
export type Field = { key: string; label: string; type?: string; options?: string[]; required?: boolean; step?: number };
export const fields: Record<Kind, Field[]> = {
  articles: [{key:"name",label:"Titel",required:true},{key:"category",label:"Rubrik",options:["Events","Fight Night","Werte","Athleten","SmashTime"]},{key:"date",label:"Veröffentlichungsdatum",type:"date",required:true},{key:"description",label:"Kurzbeschreibung",type:"textarea"},{key:"body",label:"Artikeltext (Absätze mit Leerzeile trennen)",type:"textarea",required:true},{key:"image",label:"Artikelbild",type:"image"},{key:"event",label:"Zugehöriges Event",type:"event"},{key:"source",label:"Quellen-URL",type:"url"}],
  fighters: [{key:"name",label:"Vollständiger Name",required:true},{key:"nickname",label:"Kampfname"},{key:"bio",label:"Biografie",type:"textarea"},{key:"origin",label:"Herkunft"},{key:"gym",label:"Gym / Team"},{key:"discipline",label:"Disziplin",type:"discipline"},{key:"weightClass",label:"Gewichtsklasse"},{key:"wins",label:"Siege",type:"number"},{key:"losses",label:"Niederlagen",type:"number"},{key:"draws",label:"Unentschieden",type:"number"},{key:"recordVerified",label:"Kampfrekord geprüft",type:"checkbox"},{key:"image",label:"Portrait",type:"image"},{key:"instagram",label:"Instagram URL",type:"url"}],
  events: [{key:"name",label:"Eventname",required:true},{key:"subtitle",label:"Untertitel"},{key:"description",label:"Beschreibung",type:"textarea"},{key:"date",label:"Datum",type:"date",required:true},{key:"time",label:"Beginn",type:"time"},{key:"doors",label:"Einlass",type:"time"},{key:"city",label:"Stadt"},{key:"venue",label:"Veranstaltungsort"},{key:"address",label:"Adresse"},{key:"ticket",label:"Externe Ticket-URL",type:"url"},{key:"image",label:"Eventmotiv",type:"image"},{key:"notes",label:"Besucherinformationen",type:"textarea"}],
  disciplines: [{key:"name",label:"Disziplin",required:true},{key:"description",label:"Beschreibung / Regelwerk",type:"textarea"},{key:"weights",label:"Gewichtsklassen (kommagetrennt)"},{key:"rounds",label:"Standardrunden",type:"number"},{key:"minutes",label:"Minuten je Runde",type:"number"}],
  fightcards: [{key:"name",label:"Bezeichnung",required:true},{key:"event",label:"Event",type:"event",required:true},{key:"fighterA",label:"Rote Ecke",type:"fighter",required:true},{key:"fighterB",label:"Blaue Ecke",type:"fighter",required:true},{key:"discipline",label:"Disziplin",type:"discipline",required:true},{key:"weightClass",label:"Gewichtsklasse"},{key:"order",label:"Position in Fightcard",type:"number",required:true},{key:"rounds",label:"Runden",type:"number"},{key:"minutes",label:"Minuten je Runde",type:"number"},{key:"titleFight",label:"Titelkampf",type:"checkbox"},{key:"result",label:"Bestätigtes Ergebnis"}],
  partners: [{key:"name",label:"Partnername",required:true},{key:"description",label:"Beschreibung",type:"textarea"},{key:"image",label:"Logo",type:"image"},{key:"url",label:"Website",type:"url"},{key:"tier",label:"Partnerschaft",options:["Hauptpartner","Eventpartner","Medienpartner"]}],
  videos: [{key:"name",label:"Videotitel",required:true},{key:"description",label:"Beschreibung",type:"textarea"},{key:"url",label:"Video-URL",type:"url",required:true},{key:"image",label:"Vorschaubild",type:"image"},{key:"event",label:"Zugehöriges Event",type:"event"}],
  settings: [{key:"name",label:"Interne Bezeichnung",required:true},{key:"headline",label:"Hero – erste Zeile",required:true},{key:"headline2",label:"Hero – zweite Zeile",required:true},{key:"intro",label:"Hero – Beschreibung",type:"textarea"},{key:"featuredEvent",label:"Hervorgehobenes Event",type:"event"},{key:"image",label:"Hero-Hintergrund",type:"image"},{key:"email",label:"Kontakt-E-Mail",type:"email"},{key:"seoTitle",label:"SEO-Titel"},{key:"seoDescription",label:"SEO-Beschreibung",type:"textarea"},{key:"manifest",label:"Unsere DNA",type:"textarea"}],
};
fields.fighters.push({key:"weight",label:"Kampfgewicht in kg",type:"number"},{key:"noContests",label:"No Contests",type:"number"},{key:"recordDate",label:"Datenstand des Rekords",type:"date"},{key:"source",label:"Quelle der sportlichen Angaben",type:"url"});
fields.events.push({key:"priceAdvance",label:"Vorverkauf in EUR",type:"number"},{key:"priceDoor",label:"Abendkasse in EUR",type:"number"},{key:"program",label:"Rahmenprogramm",type:"textarea"},{key:"cancelled",label:"Event abgesagt",type:"checkbox"},{key:"source",label:"Quellen-URL",type:"url"});
fields.settings.push({key:"instagram",label:"Offizieller Instagram-Account",type:"url"},{key:"aboutTitle",label:"Über uns – Überschrift"},{key:"aboutBody",label:"Über uns – Text",type:"textarea"},{key:"contactIntro",label:"Kontakt – Einleitung",type:"textarea"},{key:"footerText",label:"Footer – Beschreibung"},{key:"showCountdown",label:"Countdown auf der Startseite anzeigen",type:"checkbox"});
export const settingGroups=["Startseite","Events","Athleten","Stories","Partner","Über uns","Kontakt","SEO & Footer"];
export const sectionPrefixes:Record<string,string>={Events:"events",Athleten:"fighters",Stories:"media",Partner:"partners","Über uns":"about",Kontakt:"contact"};
for(const [name,prefix] of Object.entries(sectionPrefixes))fields.settings.push({key:`${prefix}PageTitle`,label:`${name} – Titelzeile`},{key:`${prefix}PageAccent`,label:`${name} – Akzentzeile`},{key:`${prefix}PageCopy`,label:`${name} – Einleitung`,type:"textarea"},{key:`${prefix}PageImage`,label:`${name} – Titelbild`,type:"image"});
export function fieldGroup(key:string){for(const [name,prefix] of Object.entries(sectionPrefixes))if(key.startsWith(prefix+"Page")||key.startsWith(prefix==="about"?"about":"~")||key==="contactIntro"&&name==="Kontakt")return name;return ["email","instagram","footerText","seoTitle","seoDescription"].includes(key)?"SEO & Footer":"Startseite";}
fields.partners.find(f=>f.key==="tier")!.options!.push("VIP-Catering");
fields.fightcards.splice(2,0,{key:"format",label:"Kampfformat",options:fightFormats},{key:"cardRole",label:"Platz im Programm",options:fightRoles},{key:"fightStatus",label:"Kampfstatus",options:fightStates});
fields.fightcards.splice(fields.fightcards.findIndex(f=>f.key==="fighterB")+1,0,{key:"fighterA2",label:"Rote Ecke – zweiter Athlet",type:"fighter"},{key:"fighterB2",label:"Blaue Ecke – zweiter Athlet",type:"fighter"});
fields.fightcards.find(f=>f.key==="result")!.label="Bisheriger Ergebnistext (optional)";
fields.fightcards.push({key:"resultOutcome",label:"Kampfausgang",options:fightOutcomes},{key:"resultMethod",label:"Entscheidung",options:fightMethods},{key:"resultRound",label:"Ergebnisrunde",type:"number"},{key:"resultTime",label:"Zeit in der Runde (z. B. 2:35)"},{key:"resultConfirmed",label:"Ergebnis geprüft und bestätigt",type:"checkbox"});
for(const kind of ["events","fighters"] as const)for(const field of fields[kind])if(["priceAdvance","priceDoor","weight"].includes(field.key))field.step=0.01;
export const labels: Record<Kind,string> = {fighters:"Athleten",events:"Events",disciplines:"Disziplinen",fightcards:"Fightcards",partners:"Partner",videos:"Videos",articles:"Stories & News",settings:"Website-Einstellungen"};
export const recordSchema = z.object({ id:z.string().min(1),kind:z.enum(kinds),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),status:z.enum(["draft","published","archived"]),data:z.record(z.string(),z.union([z.string(),z.number(),z.boolean()])),updated_at:z.string() });
export type ContentRecord = z.infer<typeof recordSchema>;
export const safeURL = (value: unknown) => typeof value === "string" && /^https?:\/\/[^\s]+$/i.test(value) ? value : "";
export const assetURL = (value: unknown) => typeof value === "string" && (/^\/assets\/[a-zA-Z0-9/_.-]+$/.test(value) || safeURL(value)) ? value : "";
export const textValue = (r:ContentRecord,key:string) => String(r.data[key] ?? "");
export const displayDate = (value:unknown) => typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)?new Date(`${value}T12:00:00Z`).toLocaleDateString("de-AT",{day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Vienna"}):"Termin folgt";
export const slugify = (value:string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export function validateRecord(record: ContentRecord, records:ContentRecord[], published:ContentRecord[]=records.filter(r=>r.status==="published")) {
  recordSchema.parse(record);
  if ([...records,...published].some(r=>r.id!==record.id && r.kind===record.kind && r.slug===record.slug)) throw new Error("Diese URL-Kennung ist bereits vergeben.");
  if(record.kind==="settings"&&records.some(r=>r.kind==="settings"&&r.id!==record.id))throw new Error("Die Website-Einstellungen existieren bereits. Bitte den vorhandenen Eintrag bearbeiten.");
  for (const field of fields[record.kind]) {
    const value=record.data[field.key];
    if(field.required && (value===undefined || String(value).trim()==="")) throw new Error(`${field.label} fehlt.`);
    if(field.type==="url" && value && !safeURL(value)) throw new Error(`${field.label}: Bitte eine vollständige https:// URL eingeben.`);
    if(field.type==="image" && value && !assetURL(value)) throw new Error("Bild: Bitte einen Asset-Pfad oder eine https:// URL verwenden.");
    if(field.type==="number" && value!==undefined && value!=="" && (field.step===0.01?!/^\d+(?:\.\d{1,2})?$/.test(String(value)):!/^\d+$/.test(String(value)))) throw new Error(`${field.label}: Bitte eine nichtnegative ${field.step===0.01?"Zahl mit höchstens zwei Nachkommastellen":"ganze Zahl"} eingeben.`);
    const kind=field.type==="event"?"events":field.type==="fighter"?"fighters":field.type==="discipline"?"disciplines":null;
    if(kind && value && !records.some(r=>r.kind===kind && r.id===value && r.status!=="archived")) throw new Error(`${field.label}: Auswahl ist nicht mehr verfügbar.`);
  }
  if(record.kind==="fightcards") {
    validateFight(record);
    if(Number(record.data.order)<1) throw new Error("Die Position beginnt bei 1.");
    if(record.status!=="archived"&&[...records,...published].some(r=>r.id!==record.id && r.kind==="fightcards" && r.status!=="archived" && r.data.event===record.data.event && Number(r.data.order)===Number(record.data.order))) throw new Error("Diese Fightcard-Position ist bereits in einem Entwurf oder der öffentlichen Fightcard belegt.");
    if(record.status==="published" && [record.data.event,...participantIds(record),record.data.discipline].some(id=>!published.some(r=>r.id===id))) throw new Error("Event, alle zugeordneten Athleten und Disziplin müssen zuerst veröffentlicht werden.");
  }
}
const stamp="2026-09-10T00:00:00.000Z";
// Existing event information is retained as editorial drafts, never as confirmed live announcements.
export const initialRecords: ContentRecord[] = [
  ...fighters.filter(f=>f.imageSrc).map(f=>({id:f.slug,kind:"fighters" as const,slug:f.slug,status:"published" as const,updated_at:stamp,data:{name:f.name,image:f.imageSrc!,bio:"",wins:0,losses:0,draws:0,recordVerified:false}})),
  ...events.map(e=>({id:e.slug,kind:"events" as const,slug:e.slug,status:"draft" as const,updated_at:stamp,data:{name:e.title,subtitle:e.eyebrow,description:e.description,date:e.date.split(".").reverse().join("-"),time:"19:00",city:e.location,venue:e.venue,image:"/assets/pages/heroes/events-hero-v1.webp"}})),
  ...["MMA","Kickboxen","Boxen","Muay Thai"].map(name=>({id:slugify(name),kind:"disciplines" as const,slug:slugify(name),status:"published" as const,updated_at:stamp,data:{name,rounds:3,minutes:3}})),
  {id:"website",kind:"settings",slug:"website",status:"published",updated_at:stamp,data:{name:"Startseite",headline:"THE NIGHT",headline2:"IS OURS.",intro:"Wenn das Licht ausgeht, beginnt die Geschichte. Kampfsport. Ungefiltert. Unvergesslich.",image:"/assets/pages/heroes/events-hero-v1.webp",email:"hello@smashtime.at",manifest:"Respekt entsteht im Training. Im Zweifel. Im Weitermachen. Wir geben den Menschen eine Bühne, die jeden Tag dafür arbeiten."}},
];
export function publicRecords(records:ContentRecord[]) { return records.filter(r=>r.status==="published"); }
export function detailURL(r:ContentRecord) { return `/${r.kind}/detail/?slug=${encodeURIComponent(r.slug)}`; }
