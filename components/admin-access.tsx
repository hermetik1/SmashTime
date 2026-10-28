"use client";
import {useEffect,useState,useSyncExternalStore,type ReactNode,type FormEvent} from "react";
import Link from "next/link";
import {connected} from "./content-provider";
import {api} from "@/lib/api";
export function AdminAccess({children}:{children:ReactNode}){
 const secure=useSyncExternalStore(()=>()=>{},()=>location.protocol==="https:"||location.hostname==="localhost",()=>true);
 const localMode=!connected;
 const localEmail=process.env.NEXT_PUBLIC_LOCAL_ADMIN_EMAIL||"";
 const localPassword=process.env.NEXT_PUBLIC_LOCAL_ADMIN_PASSWORD||"";
 const [allowed,setAllowed]=useState(false);const [loading,setLoading]=useState(connected);const [message,setMessage]=useState("");
 useEffect(()=>{if(connected)api("session").then(r=>setAllowed(r.authenticated)).catch(e=>setMessage(e.message)).finally(()=>setLoading(false));},[]);
 // eslint-disable-next-line react-hooks/set-state-in-effect
 useEffect(()=>{if(localMode)setAllowed(sessionStorage.getItem("smashtime-local-admin") === "authenticated");},[localMode]);
 if(connected&&!secure)return <main className="control-login"><Link href="/">← Zur Website</Link><span className="cinema-label">SmashTime / Organisation</span><h1>SICHERER<br/><em>ZUGANG.</em></h1><p>Die Anmeldung ist ausschließlich über eine verschlüsselte Verbindung verfügbar. Bitte die HTTPS-Adresse der Website aufrufen.</p><a className="cinema-button" href={`https://${location.host}/admin/`}>HTTPS öffnen ↗</a></main>;
 async function login(event:FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage("");const data=new FormData(event.currentTarget);const email=String(data.get("email")||"").trim().toLowerCase();const password=String(data.get("password")||"");try{if(localMode){if(email!==localEmail.toLowerCase()||password!==localPassword)throw new Error("E-Mail oder Passwort ist nicht korrekt.");sessionStorage.setItem("smashtime-local-admin","authenticated");setAllowed(true);}else{await api("login",{email,password});setAllowed(true);}}catch(e){setMessage(e instanceof Error?e.message:"Anmeldung fehlgeschlagen.");}finally{setLoading(false);}}
 if(allowed)return <><div className="control-session"><span>{connected?"Geschützter Organisationsbereich":"Lokaler Testzugang"}</span><button data-admin-logout onClick={async()=>{if(connected)await api("logout",{});else sessionStorage.removeItem("smashtime-local-admin");setAllowed(false);window.dispatchEvent(new Event("smashtime-session"));}}>Abmelden</button></div>{children}</>;
 if(loading)return <main className="control-login"><span className="cinema-label">SmashTime / Organisation</span><p role="status">Sicherer Zugang wird geprüft …</p></main>;
 return <main className="control-login"><Link href="/">← Zur Website</Link><span className="cinema-label">SmashTime / Organisation</span><h1>WELCOME<br/><em>BACK.</em></h1><p>Dein Zugang hinter die Kulissen.</p><form onSubmit={login}><label>E-Mail<input name="email" type="email" autoComplete="username" required/></label><label>Passwort<input name="password" type="password" autoComplete="current-password" required minLength={6}/></label><p role="status">{message}</p><button className="cinema-button" disabled={loading}>{loading?"Wird geprüft …":"Anmelden →"}</button></form></main>;
}
