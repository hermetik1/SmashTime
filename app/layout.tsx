import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./cinema.css";
import "./premium.css";
import "./expansion.css";
import "./film.css";
import "./ring-intro.css";
import "./admin.css";
import "./spacing.css";
import "./fight-vs.css";
import "./platform.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SmashTime — Kampfsport auf einer neuen Bühne",
    template: "%s · SmashTime",
  },
  description: "Events, Kämpfer und Fightcards der nächsten Generation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Synchronous parser script: the gate must exist before the first body paint. */}
        <script id="ring-intro-gate" dangerouslySetInnerHTML={{ __html: `(function(){if(/^\\/admin(?:\\/|$)/.test(location.pathname))return;var key='smashtime-ring-intro-v1',seen=false;try{seen=!!sessionStorage.getItem(key);sessionStorage.setItem(key,'seen')}catch(e){seen=performance.getEntriesByType('navigation')[0]?.type==='reload'}if(seen)return;document.documentElement.dataset.ringIntro='pending';setTimeout(function(){delete document.documentElement.dataset.ringIntro;var content=document.querySelector('.cinema.premium');if(content)content.inert=false},12000)})();` }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

