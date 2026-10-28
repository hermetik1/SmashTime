"use client";
import {useContent} from "./content-provider";
import {safeURL} from "@/lib/content";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {HeroOrbit} from "./hero-orbit";
import Image from "next/image";
import {HeaderAccount} from "./header-account";
import {useEffect,useRef} from "react";

const navigation=[["/events","Events"],["/fighters","Athleten"],["/media","Medien"],["/about","Über SmashTime"]] as const;
function MainLinks(){const path=usePathname();return navigation.map(([href,label])=><Link key={href} href={href} aria-current={path===href||path.startsWith(href+"/")?"page":undefined}>{label}</Link>);}

function MobileMenu(){
 const menu=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{
  const details=menu.current;if(!details)return;
  const close=()=>{details.open=false;document.documentElement.classList.remove("mobile-navigation-open");};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"&&details.open){event.preventDefault();close();details.querySelector("summary")?.focus();}};
  const outside=(event:PointerEvent)=>{if(details.open&&event.target instanceof Node&&!details.closest("header")?.contains(event.target))close();};
  const width=window.matchMedia("(min-width:761px)");const resize=()=>{if(width.matches)close();};
  document.addEventListener("keydown",escape);document.addEventListener("pointerdown",outside);width.addEventListener("change",resize);
  return()=>{close();document.removeEventListener("keydown",escape);document.removeEventListener("pointerdown",outside);width.removeEventListener("change",resize);};
 },[]);
 return <details ref={menu} className="cinema-mobile" onToggle={event=>document.documentElement.classList.toggle("mobile-navigation-open",event.currentTarget.open)}>
  <summary aria-controls="mobile-navigation"><span className="menu-closed-label">Menü</span><span className="menu-open-label">Schließen</span><span className="menu-symbol" aria-hidden="true"/></summary>
  <nav id="mobile-navigation" aria-label="Mobile Navigation" onClick={event=>{if((event.target as HTMLElement).closest("a")&&menu.current){menu.current.open=false;document.documentElement.classList.remove("mobile-navigation-open");}}}>
   <Link href="/">Startseite</Link><MainLinks/><Link href="/partners">Partner</Link><Link href="/contact">Kontakt</Link><div className="mobile-menu-account"><HeaderAccount/></div>
  </nav>
 </details>;
}
export function SiteHeader({dark=false}:{dark?:boolean}) {const home=usePathname()==="/";return <header className={`cinema-header ${dark?"overlay":""}`}><span className="site-brand-slot"><Link className="site-brand" href="/" aria-label="SmashTime Startseite">{home&&<span className="brand-orbit-shell" aria-hidden="true"><HeroOrbit/></span>}<Image src="/assets/brand/wordmark.webp" width={180} height={36} alt="SmashTime" priority/></Link></span><nav aria-label="Hauptnavigation"><MainLinks/></nav><div className="desktop-header-account"><HeaderAccount/></div><MobileMenu key={usePathname()}/></header>;}
export function Footer(){const {published}=useContent();const data=published.find(r=>r.kind==="settings")?.data??{};return <footer className="cinema-footer cinema-wrap"><div><Link href="/" aria-label="SmashTime Startseite"><Image src="/assets/brand/wordmark.webp" width={180} height={36} alt="SmashTime"/></Link><p>{String(data.footerText||"Kampfsport aus St. Pölten. Leistung. Respekt. Gemeinschaft.")}</p>{safeURL(data.instagram)&&<a href={safeURL(data.instagram)} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}</div><nav aria-label="Footernavigation"><MainLinks/><Link href="/partners">Partner</Link></nav><div className="cinema-footer-bottom"><span>© {new Date().getFullYear()} SmashTime / Austria</span><Link href="/contact">Kontakt</Link><Link href="/impressum/">Impressum</Link><Link href="/datenschutz/">Datenschutz</Link><Link href="/admin">Organisation ↗</Link></div></footer>;}


