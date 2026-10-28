"use client";

import Link from "next/link";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import {BrandMark} from "./brand-mark";
import {Menu, X} from "./icons";

const groups = [
  {label: "Arbeitsbereich", links: [["", "Übersicht"], ["events", "Events"], ["fighters", "Athleten"]]},
  {label: "Inhalte", links: [["articles", "Medien"], ["partners", "Partner"]]},
  {label: "Verwaltung", links: [["settings", "Einstellungen"], ["audit-log", "Aktivitäten"]]},
];

export function AdminSidebar() {
  const path = usePathname().replace(/\/$/, "");
  const [openedPath, setOpenedPath] = useState<string | null>(null);
  const menuOpen = openedPath === path;
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const isActive = (slug: string) => {
    if(slug==="events"&&path==="/admin/fightcards")return true;
    if(slug==="articles"&&path==="/admin/videos")return true;
    if(slug==="settings"&&["/admin/disciplines","/admin/account"].includes(path))return true;
    const href = `/admin${slug ? `/${slug}` : ""}`;
    return path === href || Boolean(slug && path.startsWith(href + "/"));
  };
  const currentLabel = groups.flatMap(group => group.links).find(([slug]) => isActive(slug))?.[1] ?? "Organisation";

  useLayoutEffect(() => {
    if (menuOpen && panel.current) panel.current.scrollTop = 0;
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const reset = () => setOpenedPath(null);
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);

  function closeMenu() {
    setOpenedPath(null);
    if (menuOpen) toggle.current?.focus({preventScroll: true});
  }

  return (
    <aside className={`control-sidebar ${menuOpen ? "navigation-open" : ""}`} onKeyDown={event => {
      if (event.key === "Escape" && menuOpen) {
        event.preventDefault();
        closeMenu();
      }
    }}>
      <div className="control-brand">
        <BrandMark light/>
        <span className="cinema-label control-brand-caption">Organisation</span>
        <span className="control-current-section">{currentLabel}</span>
      </div>
      <button ref={toggle} type="button" className="control-nav-toggle" aria-label={menuOpen ? "Navigation schließen" : "Navigation öffnen"} aria-expanded={menuOpen} aria-controls="admin-navigation-panel" onClick={() => setOpenedPath(menuOpen ? null : path)}>
        <span>{menuOpen ? "Schließen" : "Menü"}</span>
        {menuOpen ? <X size={20}/> : <Menu size={20}/>}
      </button>
      <div ref={panel} id="admin-navigation-panel" className="control-navigation">
        <nav id="admin-navigation" aria-label="Admin Navigation">
          {groups.map(group => (
            <div className="control-nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.links.map(([slug, label]) => (
                <Link key={slug} href={`/admin${slug ? `/${slug}` : ""}`} aria-current={isActive(slug) ? "page" : undefined} onNavigate={closeMenu}>
                  <span className="control-nav-dot" aria-hidden="true"/>{label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <Link className="control-back" href="/" onNavigate={closeMenu}>Öffentliche Website <span aria-hidden="true">↗</span></Link>
      </div>
    </aside>
  );
}
