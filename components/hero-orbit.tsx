"use client";
import {useEffect,useLayoutEffect,useRef} from "react";
import {useFilmPaused} from "./film-motion";

/** Atomically replace the server-rendered hero mark with its scroll-linked counterpart. */
export function BrandHandoff(){
 const paused=useFilmPaused();
 useLayoutEffect(()=>{
  const home=document.querySelector<HTMLElement>(".cinematic-home");const shell=home?.closest<HTMLElement>(".cinema");const slot=shell?.querySelector<HTMLElement>(".site-brand-slot");const brand=slot?.querySelector<HTMLElement>(".site-brand");const anchor=home?.querySelector<HTMLElement>(".hero-logo-anchor");const hero=home?.querySelector<HTMLElement>(".film-hero");
  if(!home||!shell||!slot||!brand||!anchor||!hero)return;
  let frame=0;
  const draw=()=>{frame=0;const destination=slot.getBoundingClientRect();const source=anchor.getBoundingClientRect();const heroBox=hero.getBoundingClientRect();const scroll=Math.max(0,-heroBox.top);
   const mobile=window.matchMedia("(max-width: 760px)").matches;
   // Finish the mobile handoff when the original hero mark reaches the header.
   const distance=mobile||paused?Math.max(1,source.top+scroll-destination.top):hero.offsetHeight*.64;
   let p=Math.max(0,Math.min(1,scroll/distance));p=paused?(scroll>=distance?1:0):p*p*(3-2*p);
   const startY=paused?source.top:source.top+scroll;const x=source.left+(destination.left-source.left)*p;const y=startY+(destination.top-startY)*p;const width=source.width+(destination.width-source.width)*p;
   brand.style.width=`${source.width}px`;brand.style.transform=`translate3d(${x}px,${y}px,0) scale(${width/source.width})`;brand.style.setProperty("--orbit-opacity",String(Math.max(0,1-p*1.65)));shell.style.setProperty("--header-opacity",String(Math.min(1,p*1.6)));hero.style.setProperty("--brand-progress",String(p));shell.classList.add("hero-brand-linked");
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};draw();const resize=new ResizeObserver(schedule);resize.observe(hero);resize.observe(slot);window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);shell.classList.remove("hero-brand-linked");shell.style.removeProperty("--header-opacity");brand.style.removeProperty("width");brand.style.removeProperty("transform");brand.style.removeProperty("--orbit-opacity");};
 },[paused]);return null;
}

export function HeroOrbit(){
 const ref=useRef<HTMLCanvasElement>(null);const paused=useFilmPaused();
 useEffect(()=>{
  const canvas=ref.current;const context=canvas?.getContext("2d");const stage=canvas?.parentElement;const hero=document.querySelector<HTMLElement>(".film-hero");if(!canvas||!context||!stage||!hero)return;
  let width=0,height=0,frame=0,last=0,time=0,visible=true;let pointerX=0,pointerY=0,aimX=0,aimY=0;
  const resize=()=>{width=stage.clientWidth;height=stage.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);if(paused)paint(0);};
  function paint(clock:number){
   if(!context)return;context.clearRect(0,0,width,height);const cx=width*.5,cy=height*.5;const radius=Math.min(width*.40,height*.75);
   const halo=context.createRadialGradient(cx,cy,0,cx,cy,radius);halo.addColorStop(0,"rgba(127,10,30,.14)");halo.addColorStop(.45,"rgba(160,25,40,.06)");halo.addColorStop(1,"rgba(110,20,20,0)");context.fillStyle=halo;context.fillRect(0,0,width,height);
   // Eight straight cage edges, with light travelling along the perimeter.
   function point(position:number,layer:number){
    const step=((position%8)+8)%8,index=Math.floor(step),mix=step-index;
    // Keep the top and bottom cage edges mathematically horizontal. The
    // travelling highlights provide the motion; the cage itself must not tilt.
    const rotation=Math.PI/8;
    const scale=1-layer*.105;const rx=radius*scale,ry=Math.min(height*.43,radius*.66)*scale;
    const vertex=(i:number)=>{const a=i*Math.PI/4+rotation;return [cx+Math.cos(a)*rx+pointerX*5,cy+Math.sin(a)*ry+pointerY*4] as const;};
    const a=vertex(index),b=vertex(index+1);return [a[0]+(b[0]-a[0])*mix,a[1]+(b[1]-a[1])*mix] as const;
   }
   for(let layer=0;layer<3;layer++){
    context.beginPath();for(let i=0;i<=8;i++){const [x,y]=point(i,layer);if(i===0)context.moveTo(x,y);else context.lineTo(x,y);}context.closePath();
    context.strokeStyle=layer===1?'rgba(213,32,53,.45)':'rgba(181,159,127,.28)';context.lineWidth=layer===1?1.25:.75;context.stroke();
    for(let j=0;j<2;j++){
     const head=clock*(layer%2?-.32:.27)+j*4+layer*.85;
     for(let segment=0;segment<20;segment++){
      const tail=head-segment*.035;const a=point(tail,layer),b=point(tail-.036,layer);
      context.beginPath();context.moveTo(a[0],a[1]);context.lineTo(b[0],b[1]);context.strokeStyle=layer===1?`rgba(245,49,66,${(1-segment/20)*.8})`:`rgba(222,190,140,${(1-segment/20)*.6})`;context.lineWidth=1.8;context.stroke();
     }
     const [x,y]=point(head,layer);const glow=context.createRadialGradient(x,y,0,x,y,5);glow.addColorStop(0,'rgba(255,160,116,.8)');glow.addColorStop(1,'rgba(217,40,50,0)');context.fillStyle=glow;context.fillRect(x-5,y-5,10,10);
    }
   }
   // Corner braces suggest cage construction without crossing the wordmark.
   for(let i=0;i<8;i++){const a=point(i,0),b=point(i,2);context.beginPath();context.moveTo(a[0],a[1]);context.lineTo(b[0],b[1]);context.strokeStyle='rgba(196,153,107,.24)';context.lineWidth=.8;context.stroke();}

  }
  const draw=(now:number)=>{frame=0;if(!visible||document.hidden||paused)return;if(now-last>=32){time+=last?Math.min(now-last,65)/1000:0;last=now;pointerX+=(aimX-pointerX)*.045;pointerY+=(aimY-pointerY)*.045;paint(time);}frame=requestAnimationFrame(draw);};
  const restart=()=>{cancelAnimationFrame(frame);last=0;if(paused){paint(0);return;}if(visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const pointer=(event:PointerEvent)=>{if(event.pointerType!=="mouse")return;const rect=stage.getBoundingClientRect();aimX=Math.max(-.5,Math.min(.5,(event.clientX-rect.left)/rect.width-.5));aimY=Math.max(-.5,Math.min(.5,(event.clientY-rect.top)/rect.height-.5));};const leave=()=>{aimX=0;aimY=0;};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;restart();});observer.observe(hero);const size=new ResizeObserver(resize);size.observe(stage);resize();restart();hero.addEventListener("pointermove",pointer);hero.addEventListener("pointerleave",leave);document.addEventListener("visibilitychange",restart);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();size.disconnect();hero.removeEventListener("pointermove",pointer);hero.removeEventListener("pointerleave",leave);document.removeEventListener("visibilitychange",restart);};
 },[paused]);return <canvas ref={ref} className="hero-orbit" aria-hidden="true"/>;
}
