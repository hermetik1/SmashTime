"use client";
import {useEffect,useState,useSyncExternalStore} from "react";
const chapters=[["intro","Auftakt"],["night","Fight Night"],["athletes","Athleten"],["manifest","Haltung"],["stories","Stories"]];
const media=()=>window.matchMedia("(prefers-reduced-motion: reduce)");
function subscribe(notify:()=>void){const preference=media();preference.addEventListener("change",notify);return()=>preference.removeEventListener("change",notify);}
function pausedSnapshot(){return media().matches;}
export function useFilmPaused(){return useSyncExternalStore(subscribe,pausedSnapshot,()=>true);}
export function FilmMotion(){
 const paused=useSyncExternalStore(subscribe,pausedSnapshot,()=>true);const [chapter,setChapter]=useState("intro");
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>(".cinematic-home");if(!root)return;root.classList.toggle("motion-paused",paused);
  let frame=0;let current="intro";let sections:HTMLElement[]=[];let scenes:HTMLElement[]=[];
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-revealed");reveal.unobserve(entry.target);}}),{threshold:0.06});const observed=new WeakSet<Element>();
  const discover=()=>{sections=chapters.map(([id])=>document.getElementById(id)).filter((el):el is HTMLElement=>Boolean(el));scenes=Array.from(root.querySelectorAll<HTMLElement>("[data-camera]"));root.querySelectorAll<HTMLElement>("[data-film-reveal]").forEach(el=>{if(observed.has(el))return;observed.add(el);if(paused||el.getBoundingClientRect().top<innerHeight*.95)el.classList.add("is-revealed");else{el.classList.add("reveal-ready");reveal.observe(el);}});};
  const draw=()=>{frame=0;if(document.hidden)return;const height=innerHeight;let next="intro";for(const section of sections)if(section.getBoundingClientRect().top<=height*.45)next=section.id;if(current!==next){current=next;setChapter(next);}const rect=root.getBoundingClientRect();root.style.setProperty("--reading-progress",String(Math.min(1,Math.max(0,-rect.top/Math.max(1,root.offsetHeight-height)))));if(paused)return;for(const scene of scenes){const box=scene.getBoundingClientRect();if(box.bottom<0||box.top>height)continue;const phase=Math.max(-1,Math.min(1,(height*.5-box.top-box.height*.5)/height));scene.style.setProperty("--camera-y",`${(phase*(innerWidth<760?20:55)).toFixed(2)}px`);}};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};discover();schedule();const mutations=new MutationObserver(()=>{discover();schedule();});mutations.observe(root,{childList:true,subtree:true});const resize=new ResizeObserver(schedule);resize.observe(root);window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);document.addEventListener("visibilitychange",schedule);
  return()=>{cancelAnimationFrame(frame);reveal.disconnect();mutations.disconnect();resize.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);document.removeEventListener("visibilitychange",schedule);};
 },[paused]);
 return <><div className="film-reading-progress" aria-hidden="true"/><nav className="film-chapters" aria-label="Kapitel der Startseite">{chapters.map(([id,label],i)=><a key={id} href={`#${id}`} aria-current={chapter===id?"location":undefined}><span>{String(i+1).padStart(2,"0")}</span><span>{label}</span></a>)}</nav></>;
}
