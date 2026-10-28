import Image from "next/image";

/** Shared matchup mark; intrinsic dimensions reserve its transparent 4:3 canvas. */
export function FightVs() {
  return <span className="fight-vs"><Image src="/assets/brand/fight-vs.webp" alt="gegen" width={200} height={150}/></span>;
}
