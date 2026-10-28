import {Control} from "@/components/control";
import {fighters} from "@/lib/demo-data";
export function generateStaticParams(){return fighters.map(f=>({slug:f.slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <Control kind="fighters" initialEditor={slug}/>;}
