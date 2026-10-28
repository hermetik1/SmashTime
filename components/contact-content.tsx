"use client";
import Link from "next/link";
import {operator} from "@/lib/operator";
import {safeURL} from "@/lib/content";
import {useContent} from "./content-provider";
export function ContactContent(){const {published}=useContent();const config=published.find(r=>r.kind==="settings")?.data??{};const email=operator.email;return <section className="cinema-wrap premium-section"><div className="premium-detail-grid"><h2>LET’S MAKE<br/>SOME NOISE.</h2><div><p className="cinema-copy">{String(config.contactIntro||"Du möchtest über ein Event, eine Partnerschaft oder eine Geschichte sprechen? Schreib uns mit deinem Anliegen.")}</p><a className="cinema-text-link" href={`mailto:${email}`}>{email} ↗</a>{safeURL(config.instagram)&&<p><a className="cinema-text-link" href={safeURL(config.instagram)} target="_blank" rel="noopener noreferrer">SmashTime auf Instagram ↗</a></p>}<p className="cinema-small">Partnerschaften / Medien / Allgemeine Anfragen</p><address>{operator.name}<br/>{operator.street}<br/>{operator.city}, {operator.country}</address><p><Link href="/impressum/">Anbieterinformationen →</Link></p></div></div></section>;}
