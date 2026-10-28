import {PublicShell} from "@/components/public-shell";
import {PublicIntro} from "@/components/public-content";
import {MediaListing} from "@/components/media-listing";
export const metadata={title:"Medien",description:"Stories, Videos und Hintergründe aus der SmashTime-Arena."};
export default function Page(){return <PublicShell><PublicIntro label="Medien / Stories & Videos" title="EVERY NIGHT." accent="A STORY." copy="Perspektiven aus der Arena. Stimmen hinter dem Kampf. Momente, die bleiben." image="/assets/pages/heroes/news-hero-v1.webp"/><MediaListing/></PublicShell>;}
