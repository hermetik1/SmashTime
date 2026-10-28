import Link from "next/link";
import Image from "next/image";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link aria-label="SmashTime Startseite" className={`brand-mark ${light ? "brand-mark-light" : ""}`} href="/">
      <Image alt="SmashTime" className="brand-mark-image" height={28} priority src="/assets/brand/wordmark.webp" width={140} />
    </Link>
  );
}

