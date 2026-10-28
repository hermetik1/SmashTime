import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return <Icon {...props}><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></Icon>;
}

export function ArrowRight(props: IconProps) {
  return <Icon {...props}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></Icon>;
}

export function ChevronDown(props: IconProps) {
  return <Icon {...props}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></Icon>;
}

export function ChevronRight(props: IconProps) {
  return <Icon {...props}><path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></Icon>;
}

export function CalendarDays(props: IconProps) {
  return <Icon {...props}><rect height="15" rx="2" stroke="currentColor" strokeWidth="1.7" width="17" x="3.5" y="5.5" /><path d="M8 3.5v4M16 3.5v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></Icon>;
}

export function MapPin(props: IconProps) {
  return <Icon {...props}><path d="M20 10.2c0 5.4-8 10.3-8 10.3s-8-4.9-8-10.3a8 8 0 1 1 16 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" /></Icon>;
}

export function Clock(props: IconProps) {
  return <Icon {...props}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3.5 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}

export function Users(props: IconProps) {
  return <Icon {...props}><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 3.8a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-3-3.87" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}

export function Trophy(props: IconProps) {
  return <Icon {...props}><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM12 13v4M8 20h8M9 17h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /><path d="M8 6H5a3 3 0 0 0 3 5M16 6h3a3 3 0 0 1-3 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}

export function Menu(props: IconProps) {
  return <Icon {...props}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></Icon>;
}

export function Search(props: IconProps) {
  return <Icon {...props}><circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></Icon>;
}

export function Bell(props: IconProps) {
  return <Icon {...props}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}

export function Plus(props: IconProps) {
  return <Icon {...props}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></Icon>;
}

export function MoreHorizontal(props: IconProps) {
  return <Icon {...props}><circle cx="5" cy="12" fill="currentColor" r="1.4" /><circle cx="12" cy="12" fill="currentColor" r="1.4" /><circle cx="19" cy="12" fill="currentColor" r="1.4" /></Icon>;
}

export function SlidersHorizontal(props: IconProps) {
  return <Icon {...props}><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /><circle cx="9" cy="6" fill="var(--icon-bg, currentColor)" r="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="15" cy="12" fill="var(--icon-bg, currentColor)" r="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="8" cy="18" fill="var(--icon-bg, currentColor)" r="2" stroke="currentColor" strokeWidth="1.7" /></Icon>;
}

export function MoveUp(props: IconProps) {
  return <Icon {...props}><path d="M12 19V5m-5 5 5-5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}

export function MoveDown(props: IconProps) {
  return <Icon {...props}><path d="M12 5v14m5-5-5 5-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}

export function Check(props: IconProps) {
  return <Icon {...props}><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></Icon>;
}

export function X(props: IconProps) {
  return <Icon {...props}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></Icon>;
}

export function ShieldCheck(props: IconProps) {
  return <Icon {...props}><path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="m8.5 12 2.2 2.2 4.8-4.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></Icon>;
}
