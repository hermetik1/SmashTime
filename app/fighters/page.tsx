import {PublicShell} from "@/components/public-shell";
import {PublicIntro,PublicListing} from "@/components/public-content";
export const metadata={title:"Athleten",description:"Die Menschen hinter dem Kampf: freigegebene SmashTime-Athletenprofile, Biografien und sportliche Daten."};
export default function Page(){return <PublicShell><PublicIntro label="02 / The athletes" title="BUILT FOR" accent="THE MOMENT." copy="Keine Abkürzungen. Keine Masken. Die Menschen hinter den Geschichten im Ring." image="/assets/pages/heroes/champions-hero-v1.webp"/><PublicListing kind="fighters"/></PublicShell>;}
