"use client";
import Link from "next/link";
export function AdminSectionNav({section,active}:{section:"media"|"settings";active:string}){
 const links=section==="media"?[["articles","Stories & News"],["videos","Videos"]]:[["settings","Website"],["disciplines","Disziplinen & Regelwerke"],["account","Konto & Sicherheit"]];
 return <nav className="event-workspace-tabs admin-section-tabs" aria-label={section==="media"?"Medienbereiche":"Einstellungsbereiche"}>{links.map(([key,label])=><Link key={key} href={`/admin/${key}/`} aria-current={active===key?"page":undefined}>{label}</Link>)}</nav>;
}
