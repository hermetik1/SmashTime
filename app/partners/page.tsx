import {PublicShell} from "@/components/public-shell";
import {PublicIntro,PublicListing} from "@/components/public-content";
import Link from "next/link";
export const metadata={title:"Partnerschaften"};
export default function Page(){return <PublicShell><PublicIntro label="04 / Together at ringside" title="STRONGER" accent="TOGETHER." copy="Für Marken mit Haltung. Für Partnerschaften, die zum Sport und zu den Menschen dahinter passen." image="/assets/pages/heroes/champions-hero-v1.webp"/><section className="cinema-wrap premium-section"><div className="premium-detail-grid"><h2>DEINE MARKE.<br/>UNSERE BÜHNE.</h2><div><p className="cinema-copy">Vom Eventauftritt bis zu gemeinsamen Geschichten: Lass uns besprechen, wie deine Marke Teil von SmashTime werden kann.</p><Link href="/contact" className="cinema-button">Partnerschaft anfragen ↗</Link></div></div></section><PublicListing kind="partners"/></PublicShell>;}
