import type {ContentRecord} from "./content";
export function adminRecordURL(record:ContentRecord){
 const id=encodeURIComponent(record.id);
 if(record.kind==="fightcards"&&record.data.event)return `/admin/events/?edit=${encodeURIComponent(String(record.data.event))}&tab=fights&fight=${id}`;
 if(["articles","videos"].includes(record.kind)&&record.data.event)return `/admin/events/?edit=${encodeURIComponent(String(record.data.event))}&tab=media&media=${record.kind}&record=${id}`;
 return `/admin/${record.kind}/?edit=${id}`;
}
