export type EventStatus = "Entwurf" | "Angekündigt" | "Veröffentlicht" | "Abgeschlossen";

export type Fight = {
  id: string;
  order: number;
  label: string;
  fighterA: string;
  fighterB: string;
  fighterARecord: string;
  fighterBRecord: string;
  weightClass: string;
  discipline: string;
  type: string;
  rounds: string;
  titleFight?: boolean;
  status: "Geplant" | "Bestätigt" | "Ergebnis veröffentlicht";
  result?: string;
};

export type Fighter = {
  slug: string;
  name: string;
  nickname: string;
  initials: string;
  origin: string;
  gym: string;
  discipline: string;
  weightClass: string;
  record: string;
  wins: number;
  losses: number;
  draws: number;
  accent: string;
  status: "Aktiv" | "Champion" | "In Prüfung";
  imageSrc?: string;
};

export type SmashEvent = {
  slug: string;
  title: string;
  eyebrow: string;
  dateLabel: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  status: EventStatus;
  description: string;
  fightCount: number;
  accent: string;
};

export const upcomingEvent: SmashEvent = {
  slug: "smashtime-night-01",
  title: "SmashTime Night 01",
  eyebrow: "Die Premiere",
  dateLabel: "28. JUNI 2026",
  date: "28.06.2026",
  time: "19:00 Uhr",
  location: "Wien",
  venue: "Wiener Stadthalle · Halle D",
  status: "Veröffentlicht",
  description:
    "Ein Abend, acht Kämpfe, eine neue Bühne für Kampfsport in Österreich.",
  fightCount: 8,
  accent: "lime",
};

export const events: SmashEvent[] = [
  upcomingEvent,
  {
    slug: "smashtime-night-02",
    title: "SmashTime Night 02",
    eyebrow: "Season two",
    dateLabel: "12. SEPTEMBER 2026",
    date: "12.09.2026",
    time: "19:00 Uhr",
    location: "Graz",
    venue: "Helmut-List-Halle",
    status: "Angekündigt",
    description: "Neue Paarungen, neue Geschichten und noch mehr Energie.",
    fightCount: 10,
    accent: "peach",
  },
  {
    slug: "smashtime-fightcamp",
    title: "FightCamp 2026",
    eyebrow: "Development series",
    dateLabel: "08. NOVEMBER 2026",
    date: "08.11.2026",
    time: "16:00 Uhr",
    location: "Linz",
    venue: "TipsArena",
    status: "Entwurf",
    description: "Das offizielle Nachwuchsformat für die nächste Generation.",
    fightCount: 6,
    accent: "blue",
  },
];

export const fighters: Fighter[] = [
  {
    slug: "mike-capellan-rodriguez",
    name: "Mike Capellan Rodriguez",
    nickname: "Noch einzutragen",
    initials: "MC",
    origin: "—",
    gym: "Noch einzutragen",
    discipline: "Noch einzutragen",
    weightClass: "Noch einzutragen",
    record: "Noch nicht erfasst",
    wins: 0,
    losses: 0,
    draws: 0,
    accent: "rose",
    status: "In Prüfung",
    imageSrc: "/assets/fighters/mike-capellan-rodriguez.webp",
  },
  {
    slug: "tanyo-tanev",
    name: "Tanyo Tanev",
    nickname: "Noch einzutragen",
    initials: "TT",
    origin: "—",
    gym: "Noch einzutragen",
    discipline: "Noch einzutragen",
    weightClass: "Noch einzutragen",
    record: "Noch nicht erfasst",
    wins: 0,
    losses: 0,
    draws: 0,
    accent: "blue",
    status: "In Prüfung",
    imageSrc: "/assets/fighters/tanyo-tanev.webp",
  },
  {
    slug: "denis-berisha",
    name: "Denis Berisha",
    nickname: "Noch einzutragen",
    initials: "DB",
    origin: "—",
    gym: "Noch einzutragen",
    discipline: "Noch einzutragen",
    weightClass: "Noch einzutragen",
    record: "Noch nicht erfasst",
    wins: 0,
    losses: 0,
    draws: 0,
    accent: "peach",
    status: "In Prüfung",
    imageSrc: "/assets/fighters/denis-berisha.webp",
  },
  {
    slug: "liam-stancel",
    name: "Liam Stancel",
    nickname: "Noch einzutragen",
    initials: "LS",
    origin: "—",
    gym: "Noch einzutragen",
    discipline: "Noch einzutragen",
    weightClass: "Noch einzutragen",
    record: "Noch nicht erfasst",
    wins: 0,
    losses: 0,
    draws: 0,
    accent: "violet",
    status: "In Prüfung",
    imageSrc: "/assets/fighters/liam-stancel.webp",
  },
  {
    slug: "lukas-steiner",
    name: "Lukas Steiner",
    nickname: "The Oak",
    initials: "LS",
    origin: "AT",
    gym: "Iron District Wien",
    discipline: "Kickboxen",
    weightClass: "-84 kg",
    record: "12–2–0",
    wins: 12,
    losses: 2,
    draws: 0,
    accent: "lime",
    status: "Champion",
  },
  {
    slug: "amir-haddad",
    name: "Amir Haddad",
    nickname: "The Falcon",
    initials: "AH",
    origin: "DE",
    gym: "Westside Combat",
    discipline: "MMA",
    weightClass: "-77 kg",
    record: "9–1–0",
    wins: 9,
    losses: 1,
    draws: 0,
    accent: "blue",
    status: "Aktiv",
  },
  {
    slug: "sarah-novak",
    name: "Sarah Novak",
    nickname: "Switch",
    initials: "SN",
    origin: "AT",
    gym: "Nova Fight Club",
    discipline: "Muay Thai",
    weightClass: "-60 kg",
    record: "8–1–1",
    wins: 8,
    losses: 1,
    draws: 1,
    accent: "peach",
    status: "Aktiv",
  },
  {
    slug: "matteo-rossi",
    name: "Matteo Rossi",
    nickname: "Mako",
    initials: "MR",
    origin: "IT",
    gym: "Rossi Fight Lab",
    discipline: "Kickboxen",
    weightClass: "-70 kg",
    record: "11–3–0",
    wins: 11,
    losses: 3,
    draws: 0,
    accent: "rose",
    status: "Aktiv",
  },
  {
    slug: "elias-wagner",
    name: "Elias Wagner",
    nickname: "North",
    initials: "EW",
    origin: "AT",
    gym: "Northern Wolves",
    discipline: "Boxen",
    weightClass: "-91 kg",
    record: "7–2–0",
    wins: 7,
    losses: 2,
    draws: 0,
    accent: "violet",
    status: "Aktiv",
  },
  {
    slug: "maya-ortner",
    name: "Maya Ortner",
    nickname: "Voltage",
    initials: "MO",
    origin: "AT",
    gym: "Core Combat Graz",
    discipline: "MMA",
    weightClass: "-57 kg",
    record: "6–0–0",
    wins: 6,
    losses: 0,
    draws: 0,
    accent: "yellow",
    status: "In Prüfung",
  },
];

export const fights: Fight[] = [
  {
    id: "fight-01",
    order: 1,
    label: "Main Event",
    fighterA: "Lukas Steiner",
    fighterB: "Amir Haddad",
    fighterARecord: "12–2–0",
    fighterBRecord: "9–1–0",
    weightClass: "-84 kg",
    discipline: "Kickboxen",
    type: "Titelkampf",
    rounds: "5 × 3 Min.",
    titleFight: true,
    status: "Bestätigt",
  },
  {
    id: "fight-02",
    order: 2,
    label: "Co-Main Event",
    fighterA: "Sarah Novak",
    fighterB: "Matteo Rossi",
    fighterARecord: "8–1–1",
    fighterBRecord: "11–3–0",
    weightClass: "-70 kg",
    discipline: "Muay Thai",
    type: "Superfight",
    rounds: "3 × 3 Min.",
    status: "Bestätigt",
  },
  {
    id: "fight-03",
    order: 3,
    label: "Fight 03",
    fighterA: "Elias Wagner",
    fighterB: "Jonas Kral",
    fighterARecord: "7–2–0",
    fighterBRecord: "5–2–1",
    weightClass: "-91 kg",
    discipline: "Boxen",
    type: "Main Card",
    rounds: "4 × 3 Min.",
    status: "Bestätigt",
  },
  {
    id: "fight-04",
    order: 4,
    label: "Fight 04",
    fighterA: "Maya Ortner",
    fighterB: "Nora Bayram",
    fighterARecord: "6–0–0",
    fighterBRecord: "4–1–0",
    weightClass: "-57 kg",
    discipline: "MMA",
    type: "Main Card",
    rounds: "3 × 5 Min.",
    status: "Geplant",
  },
];

export const applicationQueue = [
  { name: "Maya Ortner", discipline: "MMA", weight: "-57 kg", age: "vor 2 h", status: "Neu" },
  { name: "Jonas Kral", discipline: "Boxen", weight: "-91 kg", age: "vor 5 h", status: "In Prüfung" },
  { name: "Nora Bayram", discipline: "MMA", weight: "-57 kg", age: "gestern", status: "Rückfrage" },
];

export const activities = [
  { title: "Fightcard veröffentlicht", detail: "SmashTime Night 01", time: "vor 18 Min.", tone: "lime" },
  { title: "Neue Bewerbung eingegangen", detail: "Maya Ortner · MMA", time: "vor 2 Std.", tone: "blue" },
  { title: "Kämpferprofil freigegeben", detail: "Sarah Novak", time: "gestern", tone: "peach" },
];
