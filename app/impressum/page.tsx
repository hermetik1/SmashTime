import Link from "next/link";
import {PublicShell} from "@/components/public-shell";
import {operator} from "@/lib/operator";

export const metadata={title:"Impressum",robots:{index:false,follow:true}};
export default function Page(){
 return <PublicShell><article className="cinema-wrap premium-section legal-page">
  <span className="cinema-label">SmashTime / Anbieterinformationen</span><h1>Impressum</h1>
  <p className="legal-review">Entwurf zur Prüfung: Firmenbuchnummer, Firmenbuchgericht und zuständige Gewerbebehörde müssen vor dem Betriebsstart ergänzt bzw. bestätigt werden.</p>
  <section><h2>Diensteanbieter & Medieninhaber</h2><address>{operator.name}<br/>{operator.street}<br/>{operator.city}<br/>{operator.country}<br/><a href={`mailto:${operator.email}`}>{operator.email}</a></address></section>
  <section><h2>Unternehmensangaben</h2><dl className="premium-facts"><div><dt>Firmensitz</dt><dd>{operator.city}</dd></div><div><dt>Tätigkeit / Beruf</dt><dd>{operator.business}</dd></div><div><dt>Verleihungsstaat</dt><dd>{operator.country}</dd></div><div><dt>GISA-Zahl</dt><dd>{operator.gisa}</dd></div></dl></section>
  <section><h2>Inhaltliche Ausrichtung</h2><p>Informationen über SmashTime, Kampfsportveranstaltungen, teilnehmende Athleten, Paarungen, Ergebnisse und Medienberichte.</p></section>
  <section><h2>Datenschutzkontakt</h2><p>{operator.privacyContact}<br/><a href={`mailto:${operator.email}`}>{operator.email}</a></p><Link href="/datenschutz/">Datenschutzhinweise lesen →</Link></section>
 </article></PublicShell>;
}
