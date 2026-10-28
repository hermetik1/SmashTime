"use client";

import { useEffect, useRef } from "react";

const ropePaths = [
  "M196 110H746 M196 136H736 M196 158H726",
  "M855 210V709 M833 220V709 M808 234V690",
  "M748 814H190 M737 789H190 M727 765H214",
  "M87 710V208 M111 702V225 M136 688V239",
];
const chargePaths = [
  "M87 110H855V814H87Z",
  "M111 136H833V789H111Z",
  "M136 158H808V765H136Z",
];

export function RingIntro() {
  const intro = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const element = intro.current;
    if (!element || root.dataset.ringIntro !== "pending") return;
    const content = element.nextElementSibling as HTMLElement | null;
    if (content) content.inert = true;
    let cancelled = false;
    let opening = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const finish = () => {
      delete root.dataset.ringIntro;
      if (content) content.inert = false;
    };
    const open = () => {
      if (cancelled || opening) return;
      opening = true;
      root.dataset.ringIntro = "opening";
      timers.push(setTimeout(finish, 900));
    };
    const image = new window.Image();
    image.src = "/assets/brand/ring-intro.png";
    // Hold for four seconds after the image is decoded, not during its download.
    image.decode().catch(() => undefined).then(() => {
      if (cancelled || root.dataset.ringIntro !== "pending") return;
      element.dataset.ready = "true";
      timers.push(setTimeout(open, 4000));
    });
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") open(); };
    window.addEventListener("keydown", escape);
    timers.push(setTimeout(open, 10000));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", escape);
      if (content) content.inert = false;
      // Preserve the pre-paint gate through Strict Mode's setup/cleanup cycle.
    };
  }, []);

  return (
    <div ref={intro} className="ring-intro" role="status" aria-label="Smash Time wird geladen. Betritt den Ring.">
      <div className="ring-intro-portal" />
      <div className="ring-intro-scene" aria-hidden="true">
        <svg className="ring-intro-ring" viewBox="0 0 936 936" fill="none">
          <defs>
            <mask id="ring-rope-charge" maskUnits="userSpaceOnUse" x="0" y="0" width="936" height="936">
              {chargePaths.map(d => <path key={d} d={d} className="ring-intro-charge" pathLength="1" stroke="white" strokeWidth="19"/>)}
            </mask>
          </defs>
          <image href="/assets/brand/ring-intro.png" x="-364" y="0" width="1664" height="936" />
          {ropePaths.map(d => <path key={d} d={d} stroke="#090909" strokeWidth="19" strokeOpacity=".95"/>)}
          <image href="/assets/brand/ring-intro.png" x="-364" y="0" width="1664" height="936" mask="url(#ring-rope-charge)" />
        </svg>
        <p className="ring-intro-title">Betritt den Ring.</p>
        <span className="ring-intro-caption">Dein Moment beginnt</span>
      </div>
    </div>
  );
}
