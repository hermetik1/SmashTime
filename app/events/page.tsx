import {PublicShell} from "@/components/public-shell";
import {PublicIntro,PublicListing} from "@/components/public-content";
export const metadata={title:"Events",description:"Die kommenden SmashTime Fight Nights: Veranstaltungen, bestätigte Fightcards und Ticketinformationen."};
export default function Page(){return <PublicShell><PublicIntro label="01 / Fight nights" title="THIS IS" accent="FIGHT NIGHT." copy="Die Energie der Arena. Die Stille vor dem Gong. Finde die Nacht, die dir in Erinnerung bleibt." image="/assets/pages/heroes/events-hero-v1.webp"/><PublicListing kind="events"/></PublicShell>;}
