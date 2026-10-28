"use client";
import {useEffect,useRef,useState} from "react";

type HistoryNavigationEvent=Event&{navigationType:string;destination:{key:string;sameDocument:boolean}};
type HistoryNavigation=EventTarget&{traverseTo:(key:string)=>{finished:Promise<unknown>}};
export function useEditorGuard(dirty:boolean,saveDraft:()=>Promise<boolean>,onDiscard?:()=>void){
 const [open,setOpen]=useState(false),[saving,setSaving]=useState(false);
 const pending=useRef<null|(()=>void)>(null),dialog=useRef<HTMLDialogElement>(null),leaving=useRef(false);
 function request(action:()=>void){if(!dirty){action();return;}pending.current=action;setOpen(true);}
 function cancel(){pending.current=null;setOpen(false);}
 function proceed(){const action=pending.current;pending.current=null;setOpen(false);action?.();}
 useEffect(()=>{leaving.current=false;},[dirty]);
 useEffect(()=>{
  if(open)dialog.current?.showModal();else dialog.current?.close();
 },[open]);
 useEffect(()=>{
  if(!dirty)return;
  const unload=(event:BeforeUnloadEvent)=>{if(!leaving.current){event.preventDefault();event.returnValue="";}};
  const click=(event:MouseEvent)=>{
   if(leaving.current||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!(event.target instanceof Element))return;
   const target=event.target.closest<HTMLElement>('a[href],button[data-admin-logout]');if(!target)return;
   if(target instanceof HTMLAnchorElement){if(target.download||target.target&&target.target!=="_self")return;const destination=new URL(target.href);if(destination.href===location.href||destination.pathname===location.pathname&&destination.search===location.search)return;}
   event.preventDefault();event.stopImmediatePropagation();
   pending.current=()=>{leaving.current=true;target.click();};setOpen(true);
  };
  const navigation=(window as Window&{navigation?:HistoryNavigation}).navigation;
  const navigate=(raw:Event)=>{
   const event=raw as HistoryNavigationEvent;
   if(leaving.current||event.navigationType!=="traverse"||!event.cancelable||!event.destination.sameDocument)return;
   event.preventDefault();
   const key=event.destination.key;
   pending.current=()=>{leaving.current=true;void navigation?.traverseTo(key).finished.catch(()=>{leaving.current=false;});};
   setOpen(true);
  };
  window.addEventListener("beforeunload",unload);document.addEventListener("click",click,true);navigation?.addEventListener("navigate",navigate);
  return()=>{window.removeEventListener("beforeunload",unload);document.removeEventListener("click",click,true);navigation?.removeEventListener("navigate",navigate);};
 },[dirty]);
 return {request,dialog:<dialog ref={dialog} className="control-leave-dialog" aria-labelledby="leave-title" onCancel={event=>{event.preventDefault();if(!saving)cancel();}}>
  <span className="cinema-label">Änderungen sichern</span><h2 id="leave-title">Deine Bearbeitung ist noch offen.</h2><p>Speichere deine Änderungen als Entwurf, bevor du weitergehst. Die öffentliche Fassung bleibt dabei unverändert.</p>
  <div><button type="button" className="cinema-button" disabled={saving} onClick={async()=>{setSaving(true);try{if(await saveDraft())proceed();else cancel();}finally{setSaving(false);}}}>{saving?"Speichert …":"Entwurf speichern & weiter"}</button><button type="button" className="control-outline" disabled={saving} onClick={cancel}>Weiterbearbeiten</button><button type="button" className="control-discard" disabled={saving} onClick={()=>{onDiscard?.();proceed();}}>Änderungen verwerfen</button></div>
 </dialog>};
}
