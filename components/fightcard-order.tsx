"use client";
import {cornerName} from "@/lib/fight";
import {FightVs} from "./fight-vs";
import {useState} from "react";
import {api} from "@/lib/api";
import {textValue,type ContentRecord} from "@/lib/content";
import {useEditorGuard} from "./editor-guard";

export function FightcardOrder({records,all,event,onSaved,onClose}:{records:ContentRecord[];all:ContentRecord[];event:string;onSaved:()=>Promise<void>;onClose:()=>void}){
 const [ids,setIds]=useState(records.map(r=>r.id)),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const dirty=ids.some((id,i)=>id!==records[i]?.id);
 async function save(publish:boolean){setBusy(true);setMessage("");try{await api('reorder',{event,ids,publish,expected:Object.fromEntries(records.map(r=>[r.id,r.updated_at]))});await onSaved();onClose();return true;}catch(error){setMessage(error instanceof Error?error.message:"Reihenfolge konnte nicht gespeichert werden.");return false;}finally{setBusy(false);}}
 const guard=useEditorGuard(dirty,()=>save(false));
 function move(index:number,direction:number){setIds(current=>{const next=[...current];[next[index],next[index+direction]]=[next[index+direction],next[index]];return next;});}
 return <section className="control-order-panel"><header><div><span className="cinema-label">Fightcard-Reihenfolge</span><h2>Jeder Kampf an seinem Platz.</h2><p>Verschiebe die Kämpfe mit den Pfeilen. Öffentlich wird nur die Reihenfolge bereits veröffentlichter Kämpfe geändert.</p></div><button type="button" className="control-outline" disabled={busy} onClick={()=>guard.request(onClose)}>Schließen</button></header><ol>{ids.map((id,index)=>{const r=records.find(r=>r.id===id)!;const red=all.find(f=>f.id===r.data.fighterA),blue=all.find(f=>f.id===r.data.fighterB);return <li key={id}><span className="control-order-number">{index+1}</span><div><strong className="control-order-match">{red&&blue?<><span>{cornerName(r,"A",all)}</span><FightVs/><span>{cornerName(r,"B",all)}</span></>:textValue(r,"name")}</strong><small>{textValue(r,"name")}</small></div><button type="button" className="control-icon" disabled={busy||index===0} aria-label={`${textValue(r,"name")} nach oben`} onClick={()=>move(index,-1)}>↑</button><button type="button" className="control-icon" disabled={busy||index===ids.length-1} aria-label={`${textValue(r,"name")} nach unten`} onClick={()=>move(index,1)}>↓</button></li>;})}</ol><p role="status">{message}</p><footer><button className="control-outline" disabled={busy||!dirty} onClick={()=>void save(false)}>Als Entwurf speichern</button><button className="cinema-button" disabled={busy} onClick={()=>void save(true)}>{busy?"Speichert …":"Reihenfolge öffentlich übernehmen"}</button></footer>{guard.dialog}</section>;
}

