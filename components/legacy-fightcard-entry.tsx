"use client";
import {Suspense,useEffect} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import {useContent} from "./content-provider";
import {adminRecordURL} from "@/lib/admin-links";
import Link from "next/link";
export function LegacyFightcardEntry(){return <Suspense><Entry/></Suspense>;}
function Entry(){const router=useRouter(),search=useSearchParams();const {drafts,ready,error}=useContent();const target=search.get("edit");const record=drafts.find(r=>r.kind==="fightcards"&&(r.id===target||r.slug===target));
 useEffect(()=>{if(ready&&!error)router.replace(record?adminRecordURL(record):"/admin/events/");},[ready,error,record,router]);
 return <main className="control-main"><h1>Fightcard im Event verwalten</h1><p>{error||"Der passende Event-Arbeitsbereich wird geöffnet."}</p><Link href="/admin/events/">Zur Eventübersicht →</Link></main>;
}
