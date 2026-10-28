"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { initialRecords, recordSchema, validateRecord, type ContentRecord } from "@/lib/content";
import { api } from "@/lib/api";

export const connected = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_CMS_API === "ionos" || process.env.NEXT_PUBLIC_CMS_API === "vercel";
const localKey="smashtime-control-v1";
type State={drafts:ContentRecord[];published:ContentRecord[]};
const initial:State={drafts:initialRecords,published:initialRecords.filter(r=>r.status==="published")};
type Context=State & {ready:boolean;error:string;save:(record:ContentRecord,publish:boolean)=>Promise<void>;remove:(record:ContentRecord)=>Promise<void>;reload:()=>Promise<void>};
const ContentContext=createContext<Context|null>(null);
export function ContentProvider({children,admin=false}:{children:ReactNode;admin?:boolean}) {
 const [state,setState]=useState<State>(connected?{drafts:[],published:[]}:initial);
 const [ready,setReady]=useState(false);const [error,setError]=useState("");
 async function reload(){
  await Promise.resolve();
  try{
   if(connected){const result=await api(admin?"records":"public");setState({published:recordSchema.array().parse(result.published),drafts:recordSchema.array().parse(result.drafts??[])});}
   else if(admin){const stored=localStorage.getItem(localKey);if(stored){const parsed=JSON.parse(stored);setState({drafts:recordSchema.array().parse(parsed.drafts),published:recordSchema.array().parse(parsed.published)});}}
   setError("");
  }catch(e){setError(e instanceof Error?e.message:"Laden fehlgeschlagen.");}finally{setReady(true);}
 }
 // Synchronize the external API / browser storage after hydration.
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{void reload();const refresh=()=>void reload();window.addEventListener("storage",refresh);return()=>window.removeEventListener("storage",refresh);},[admin]); // eslint-disable-line react-hooks/exhaustive-deps
 async function save(record:ContentRecord,publish:boolean){
  const r={...record,updated_at:new Date().toISOString(),status:publish?"published" as const:record.status};
  validateRecord(r,state.drafts,state.published);
  if(connected){await api("save",{record:r,publish,expected:state.drafts.some(x=>x.id===r.id)?record.updated_at:null});await reload();return;}
  const next={drafts:[...state.drafts.filter(x=>x.id!==r.id),r],published:r.status==="archived"?state.published.filter(x=>x.id!==r.id):publish?[...state.published.filter(x=>x.id!==r.id),r]:state.published};
  localStorage.setItem(localKey,JSON.stringify(next));setState(next);
 }
 async function remove(record:ContentRecord){
  if(record.status!=="archived")throw new Error("Bitte den Eintrag zuerst archivieren.");
  if(connected){await api("delete",{id:record.id,expected:record.updated_at});await reload();return;}
  if([...state.drafts,...state.published].some(r=>r.id!==record.id&&["event","featuredEvent","fighterA","fighterB","fighterA2","fighterB2","discipline"].some(k=>r.data[k]===record.id)))throw new Error("Dieser Eintrag wird noch verwendet.");
  const next={drafts:state.drafts.filter(r=>r.id!==record.id),published:state.published.filter(r=>r.id!==record.id)};localStorage.setItem(localKey,JSON.stringify(next));setState(next);
 }
 return <ContentContext.Provider value={{...state,ready,error,save,reload,remove}}>{children}</ContentContext.Provider>;
}
export function useContent(){const state=useContext(ContentContext);if(!state)throw new Error("ContentProvider fehlt");return state;}

