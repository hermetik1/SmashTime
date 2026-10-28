"use client";
import { useEffect } from "react";
export function CinemaMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".cinema");
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const sync = () => {
      observer?.disconnect();
      root.classList.toggle("cinema-motion-off", preference.matches);
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el => el.classList.remove("cinema-await"));
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove("cinema-await"); observer?.unobserve(entry.target); }
      }), { threshold: 0.08 });
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el => {
        if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("cinema-await");
        observer?.observe(el);
      });
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { observer?.disconnect(); preference.removeEventListener("change", sync); };
  }, []);
  return null;
}
