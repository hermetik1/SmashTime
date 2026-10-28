import {PublicShell} from "@/components/public-shell"; import {PublicDetail} from "@/components/public-content"; import {events} from "@/lib/demo-data";
export function generateStaticParams(){return events.map(r=>({slug:r.slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <PublicShell><PublicDetail kind="events" slug={slug}/></PublicShell>;}
