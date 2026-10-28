import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return <main style={{ alignItems: "center", background: "var(--dark)", color: "#fff", display: "flex", flex: 1, justifyContent: "center", minHeight: "100vh", padding: 30, textAlign: "center" }}><div><BrandMark light /><span className="eyebrow" style={{ color: "var(--lime)", display: "block", marginTop: 80 }}>404 · Nicht gefunden</span><h1 style={{ fontSize: "clamp(60px, 11vw, 150px)", fontWeight: 500, letterSpacing: "-.1em", lineHeight: .8, margin: "25px 0 35px" }}>Falsche<br /><em style={{ color: "var(--lime)", fontStyle: "normal" }}>Ecke.</em></h1><Link className="button button-lime" href="/">Zur Startseite <ArrowUpRight size={16} /></Link></div></main>;
}
