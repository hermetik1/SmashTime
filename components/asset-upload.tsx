"use client";
import Image from "next/image";
import {useEffect,useId,useRef,useState} from "react";
import {api} from "@/lib/api";
import {assetURL} from "@/lib/content";
import {connected} from "./content-provider";

type Props={value:string;label:string;portrait?:boolean;onPick:(url:string)=>void;onBusyChange:(busy:boolean)=>void};
export function AssetUpload({value,label,portrait=false,onPick,onBusyChange}:Props){
 const id=useId(),input=useRef<HTMLInputElement>(null),request=useRef<AbortController|null>(null),mounted=useRef(true),objectURL=useRef("");
 const busyChanged=useRef(onBusyChange);
 useEffect(()=>{busyChanged.current=onBusyChange;},[onBusyChange]);
 const [message,setMessage]=useState(""),[busy,setBusy]=useState(false),[preview,setPreview]=useState(""),[failed,setFailed]=useState(false);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();if(objectURL.current)URL.revokeObjectURL(objectURL.current);busyChanged.current(false);};},[]);
 async function upload(file:File){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setMessage("Bitte ein JPG, PNG oder WebP auswählen.");return;}
  if(file.size>5000000){setMessage("Das Bild darf höchstens 5 MB groß sein.");return;}
  const controller=new AbortController();request.current=controller;
  objectURL.current=URL.createObjectURL(file);setPreview(objectURL.current);setFailed(false);setBusy(true);busyChanged.current(true);setMessage("");
  try{
   const content=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error("Das Bild konnte nicht gelesen werden."));reader.readAsDataURL(file);});
   if(controller.signal.aborted)return;
   const result=await api("upload",{content},controller.signal);
   if(!mounted.current)return;onPick(result.url);setMessage("Bild hochgeladen. Speichere den Entwurf, um die Auswahl zu übernehmen.");
  }catch(error){if(mounted.current&&!controller.signal.aborted)setMessage(error instanceof Error?error.message:"Das Bild konnte nicht hochgeladen werden.");}
  finally{if(objectURL.current)URL.revokeObjectURL(objectURL.current);objectURL.current="";if(mounted.current){setPreview("");setBusy(false);busyChanged.current(false);}if(input.current)input.current.value="";}
 }
 const source=preview||assetURL(value);
 return <div className={`control-image-field wide ${portrait?'is-portrait':''}`}><span id={`${id}-label`} className="control-field-label">{label}</span><div className={`control-image-picker ${source?'has-image':''}`} aria-busy={busy}>
  <div className="control-image-preview">{source&&!failed?<Image key={source} src={source} alt={`${label} – aktuelle Auswahl`} width={720} height={portrait?900:450} unoptimized onError={()=>setFailed(true)}/>:<div className="control-image-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4"/><circle cx="15.5" cy="8.5" r="1.5"/></svg><span>{failed?"Bildvorschau nicht verfügbar":"Noch kein Bild ausgewählt"}</span></div>}{busy&&<div className="control-image-progress" role="progressbar" aria-label="Bild wird hochgeladen"><span/>Wird hochgeladen …</div>}</div>
  <div className="control-image-actions"><div><strong>{source?"Deine Bildauswahl":"Ein Bild hinzufügen"}</strong><p>{portrait?"Wähle das Portrait des Athleten. Das vollständige Bild bleibt in der Vorschau sichtbar.":"Wähle das Bild für diesen Inhalt. Du kannst es vor dem Speichern prüfen."}</p></div><input ref={input} id={id} type="file" className="sr-only" tabIndex={-1} accept="image/jpeg,image/png,image/webp" aria-labelledby={`${id}-label`} disabled={!connected||busy} onChange={event=>{const file=event.target.files?.[0];if(file)void upload(file);}}/><div className="control-image-buttons"><button className="control-outline" type="button" disabled={!connected||busy} onClick={()=>input.current?.click()}>{source?"Bild ersetzen":"Bild auswählen"}</button>{value&&<button className="control-discard" type="button" disabled={busy} onClick={()=>{onPick("");setFailed(false);setMessage("Bild aus diesem Entwurf entfernt. Speichere, um die Änderung zu übernehmen.");}}>Bild entfernen</button>}</div><small>JPG, PNG oder WebP · maximal 5 MB</small><p className="control-image-status" role="status">{!connected?"Für den Upload muss das Test-Backend verbunden sein.":message}</p></div>
 </div></div>;
}
