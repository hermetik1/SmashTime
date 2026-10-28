"use client";
import { useSyncExternalStore } from "react";
import { eventTimestamp } from "@/lib/event-time";
import type { ContentRecord } from "@/lib/content";
const subscribe=(notify:()=>void)=>{const id=setInterval(notify,1000);return()=>clearInterval(id);};
export const useClock=()=>useSyncExternalStore(subscribe,()=>Math.floor(Date.now()/1000)*1000,()=>0);
export function EventCountdown({event}:{event:ContentRecord}) {
  const now=useClock();const target=eventTimestamp(event.data.date,event.data.time);
  if(event.data.cancelled)return <p className="countdown-note">Dieses Event wurde abgesagt.</p>;
  if(target===null)return <p className="countdown-note">Der genaue Veranstaltungsbeginn wird noch bekanntgegeben.</p>;
  if(now&&target<=now)return <p className="countdown-note">Der angekündigte Beginn liegt in der Vergangenheit. Ergebnisse findest du in der Fightcard.</p>;
  const seconds=Math.max(0,Math.floor((target-now)/1000));
  return <div className="event-countdown"><p className="cinema-label">Bis zum ersten Gong · Wiener Ortszeit</p><div className="countdown-digits" aria-label="Countdown bis zum Veranstaltungsbeginn">{[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].map((value,i)=><div key={i}><strong suppressHydrationWarning>{now?String(value).padStart(2,"0"):"—"}</strong><span>{["Tage","Stunden","Minuten","Sekunden"][i]}</span></div>)}</div></div>;
}
