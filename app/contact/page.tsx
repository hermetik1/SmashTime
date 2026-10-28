import {PublicShell} from "@/components/public-shell";
import {PublicIntro} from "@/components/public-content";
import {ContactContent} from "@/components/contact-content";
export const metadata={title:"Kontakt"};
export default function Page(){return <PublicShell><PublicIntro label="06 / Get in touch" title="YOUR MOVE." accent="LET’S TALK." copy="Für gute Gespräche braucht es keinen Gong." image="/assets/pages/heroes/news-hero-v1.webp"/><ContactContent/></PublicShell>;}
