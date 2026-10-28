"use client";

import { useEffect, useRef } from "react";

/** A small, reusable cloud texture is painted once; only its position changes per frame. */
export function ArenaAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const cloud = document.createElement("canvas");
    cloud.width = 256; cloud.height = 128;
    const brush = cloud.getContext("2d");
    if (!brush) return;
    // Deterministic clusters make irregular wisps rather than a uniform white overlay.
    for (let i = 0; i < 36; i++) {
      const x = 25 + ((i * 67) % 205);
      const y = 35 + Math.sin(i * 2.3) * 22;
      const radius = 18 + ((i * 13) % 30);
      const gradient = brush.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(192,190,182,0.09)");
      gradient.addColorStop(.45, "rgba(155,157,156,0.055)");
      gradient.addColorStop(1, "rgba(120,130,130,0)");
      brush.fillStyle = gradient; brush.fillRect(0, 0, 256, 128);
    }
    let width = 0, height = 0, frame = 0;
    let visible = true;
    let previous = 0;
    let elapsed = 0;
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const delta = previous ? Math.min(now - previous, 60) : 0;
      previous = now; elapsed += delta;
      const t = elapsed / 1000;
      context.clearRect(0, 0, width, height);
      const hero = document.querySelector<HTMLElement>(".cinema-hero");
      const heroHeight = hero?.offsetHeight || height;
      const heroStrength = Math.max(0, 1 - window.scrollY / heroHeight);
      // Fog remains strongest below the headline, with sparse ambient dust down-page.
      const count = width < 760 ? 7 : 11;
      context.globalCompositeOperation = "screen";
      for (let i = 0; i < count; i++) {
        const size = width * (.65 + (i % 3) * .16);
        const speed = i % 2 ? 19 : -14;
        const cycle = width + size;
        const x = (((i * 317 + t * speed) % cycle) + cycle) % cycle - size;
        const y = height * (.57 + (i % 4) * .095) + Math.sin(t * .23 + i) * 40;
        context.globalAlpha = (.20 + (i % 3) * .06) * heroStrength;
        context.drawImage(cloud, x, y, size, size * .4);
      }
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      for (let i = 0; i < (width < 760 ? 17 : 36); i++) {
        const x = ((i * 173.21 + Math.sin(t * .16 + i) * 34) % width + width) % width;
        const y = ((height - (i * 79 + t * (7 + i % 7))) % height + height) % height;
        const alpha = .12 + (Math.sin(t * .7 + i) + 1) * .16;
        context.fillStyle = i % 4 ? `rgba(197,161,99,${alpha})` : `rgba(174,27,42,${alpha})`;
        context.beginPath(); context.arc(x,y,i % 5 === 0 ? 1.5 : .7,0,Math.PI*2); context.fill();
      }
      context.globalAlpha = 1;
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame); previous = 0;
      context.clearRect(0,0,width,height);
      if (!reduced.matches && !document.hidden && visible) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restart(); });
    observer.observe(canvas);
    resize(); restart();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", restart);
    reduced.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", restart);
      reduced.removeEventListener("change", restart);
    };
  }, []);
  return <canvas ref={canvasRef} className="arena-atmosphere" aria-hidden="true"/>;
}
