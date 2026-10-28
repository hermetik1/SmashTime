import type { ContentRecord } from "./content";

/** Interpret editorial wall-clock times in Vienna, independent of the visitor's timezone. */
export function eventTimestamp(date: unknown, time: unknown): number | null {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || typeof time !== "string" || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const wall = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(wall) || new Date(wall).toISOString().slice(0,10) !== date) return null;
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone:"Europe/Vienna", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", hourCycle:"h23" });
  let instant = wall;
  for (let i=0;i<3;i++) {
    const parts = Object.fromEntries(formatter.formatToParts(instant).map(p=>[p.type,p.value]));
    const represented = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
    const correction = wall-represented;
    if (!correction) return instant;
    instant += correction;
  }
  return null; // A non-existent local time at the spring DST transition.
}

export function nextEvent(records: ContentRecord[], now:number, featured?:unknown) {
  const upcoming = records.filter(r=>r.kind==="events" && !r.data.cancelled && (eventTimestamp(r.data.date,r.data.time) ?? -Infinity)>now)
    .sort((a,b)=>eventTimestamp(a.data.date,a.data.time)!-eventTimestamp(b.data.date,b.data.time)!);
  return upcoming.find(r=>r.id===featured)??upcoming[0];
}

export function eventCalendar(event:ContentRecord,now=Date.now()):string|null {
  const start=eventTimestamp(event.data.date,event.data.time);
  if(start===null||event.data.cancelled)return null;
  const stamp=(value:number)=>new Date(value).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
  const escape=(value:unknown)=>String(value??"").replace(/\\/g,"\\\\").replace(/\r\n|\r|\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SmashTime//Fight Night//DE","CALSCALE:GREGORIAN","BEGIN:VEVENT",`UID:${escape(event.id)}@smashtime`,`DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(start)}`,`SUMMARY:${escape(event.data.name)}`,`LOCATION:${escape([event.data.venue,event.data.address,event.data.city].filter(Boolean).join(", "))}`,`DESCRIPTION:${escape(event.data.description)}`,"END:VEVENT","END:VCALENDAR"];
  // Fold on UTF-8 octet boundaries without breaking multi-byte characters (RFC 5545).
  return lines.map(line=>{let result="",size=0;for(const char of line){const bytes=new TextEncoder().encode(char).length;if(size+bytes>73){result+="\r\n ";size=1;}result+=char;size+=bytes;}return result;}).join("\r\n")+"\r\n";
}
