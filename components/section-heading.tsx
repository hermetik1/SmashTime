import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export function SectionHeading({ eyebrow, title, copy, href, label = "Alle ansehen", light = false }: { eyebrow: string; title: string; copy?: string; href?: string; label?: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
      {href ? <Link className={`text-link ${light ? "text-link-light" : ""}`} href={href}>{label} <ArrowUpRight size={16} /></Link> : null}
    </div>
  );
}
