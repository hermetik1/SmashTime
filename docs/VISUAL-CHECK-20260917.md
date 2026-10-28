# Visuelle Plattformprüfung und VS-Grafik · 17.09.2026

## Umfang

Öffentliche Startseite, Events, Athleten, Medien, Partner, Über uns und Kontakt; Event-, Athleten- und Storydetail; alle elf Dashboardbereiche sowie sieben Inhaltstypen im Editor. Baseline: 28 Ansichten bei 320, 412, 768, 1024 und 1440 px (140 Prüfungen). Zusätzlich öffentliche Kontomenüs auf Smartphone, Tablet und im Querformat geprüft. Die bestehende Introgestaltung wurde nicht geändert.

## Bestätigte Korrekturen

- Der Text „Zur Liste“ ragte in allen Inhaltseditoren aus einem 44 px breiten Knopf heraus (59 px Inhalt bei 42 px Innenbreite). Der Knopf hat nun passende Breite und Innenabstand bei mindestens 44 px Höhe.
- Die drei Kampfstatistiken auf schmalen Athletenprofilen brachen ungleichmäßig um. Sie stehen nun in drei gleichmäßigen Spalten; vier Statistiken erhalten auf kleinen Displays ein Zweispaltenraster.
- Die vom Nutzer gelieferte transparente Grafik `public/assets/brand/fight-vs.webp` ersetzt die fest eingebauten VS-/vs.-Texte in Paarungsanzeigen: Startseiten-Fightcard, öffentliche Event-/Athleten-Fightcards, Editorvorschau, Fightcard-Sortierung sowie vorhandene kompakte und ältere Fightcard-Komponenten. Fließtexte und gespeicherte Inhalte wurden nicht verändert.

Die Grafik wird über `components/fight-vs.tsx` gemeinsam gerendert, mit dem Originalseitenverhältnis 4:3, passender kontextabhängiger Größe und Alternativtext „gegen“. Die responsive Gestaltung liegt in `app/fight-vs.css`.

## Verifikation

- Produktionsbuild mit TypeScript und ESLint bestanden.
- 44 gezielte Prüfungen bei acht Formaten von 320 bis 1920 px, darunter 667 × 375 px: alle verwendeten Grafikdateien geladen, Seitenverhältnis unverändert, kein Clipping oder Dokumentüberlauf; Editor-Knopf und Kampfstatistik korrigiert.
- 33 zusätzliche Zustandsprüfungen: acht Einstellungsreiter, leere Event-/Athletensuche und Dialog für ungespeicherte Änderungen bei Handy-, Querformat- und Desktopgrößen.
- Screenshots öffentlicher Seiten, Formulare, Menüs, Fightcards und der neuen Grafik visuell kontrolliert. Datums- und Zeitfelder hatten bereits passende dunkle native Bedienelemente. Keine weiteren bestätigten Darstellungsfehler im geprüften Umfang.
- Automatische Meldungen über wenige Pixel Schriftüberstand bei großen Display-Schriften sind sichtbare Glyphen außerhalb der engen Zeilenbox, kein abgeschnittener Inhalt. Der Überstand des animierten Glanzeffekts eines Hero-Buttons ist ebenfalls kein Textüberlauf.
- Prüfungen in Chromium mit Viewport-Emulation, nicht auf physischen Mobilgeräten. Angemeldete Dashboardprüfungen liefen gegen die isolierte Review-API. Keine Inhalte gespeichert oder veröffentlicht, keine Passwörter verändert.

Nachweise: `artifacts/visual-20260917/baseline.json`, `verified.json`, `states.json` und Screenshots im selben Ordner.

## Veröffentlichung

Geänderte Produktionsdateien und ausschließlich die neue VS-Grafik werden übertragen. Bestehende Fassungen wurden lokal gesichert. Andere Medien, API, private Konfiguration und Serverregeln bleiben erhalten. Anschließend Dateiabgleich und öffentlicher Browsercheck.

Veröffentlicht: 239 Produktionsdateien einschließlich der neuen VS-Grafik hochgeladen. Alle 239 anschließend bytegenau über HTTP mit dem geprüften Export verglichen. Öffentliche Fightcard zusätzlich live bei 412 und 1440 px kontrolliert; Grafik geladen, transparenter Hintergrund, keine Verzerrung und kein horizontaler Überlauf. Nachweise: `live-verified.json`, `live-vs-412.png`, `live-vs-1440.png`.
