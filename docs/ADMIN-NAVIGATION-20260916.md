# Dashboard-Navigation und Auswahlpfeile · 16.09.2026

## Änderungen

- Mobile Navigation: aktuelle Rubrik im Kopf, größere Touchflächen (46 px), einspaltige Gruppen bis 480 px, zweispaltige Darstellung bis 900 px. Eigenständig scrollbar mit Platz für Kopf und Sitzungsleiste; der Menüknopf bleibt erreichbar. Link zur öffentlichen Website ist auch mobil verfügbar.
- Escape schließt das Menü und setzt den Fokus auf den Menüknopf. Seitenwechsel und Wechsel zwischen Mobil-/Desktopansicht schließen es; erneutes Öffnen beginnt oben.
- Auswahlfelder auf öffentlicher Website und im Backend: einheitlicher Pfeil mit 14 px Randabstand, 44 px reserviertem rechten Innenraum und mindestens 44 px Höhe. Native Auswahlbedienung bleibt erhalten. Im Kontrastmodus wird der native Pfeil verwendet.
- Dashboard-Filter bis 600 px untereinander, damit die Beschriftungen trotz größerem Pfeilabstand lesbar bleiben.

Produktdateien: `components/admin-sidebar.tsx`, `app/admin.css`, `app/spacing.css`.

## Prüfung

Produktionsbuild einschließlich TypeScript und ESLint erfolgreich. Die Navigation wurde in Chromium bei 18 Formaten von 320 bis 2560 px geprüft, darunter 667 × 375 und 844 × 390 im Querformat sowie die Grenze 900/901 px. Alle elf Dashboard-Ziele bei drei Breiten getestet (33 Routenprüfungen). Kein horizontaler Überlauf; alle Ziele und der Website-Link erreichbar; Escape, Fokus, erneutes Öffnen und Wechsel der Bildschirmbreite erfolgreich. Keine JavaScript-Laufzeitfehler in der Navigationsprüfung.

Nachweise und Screenshots: `artifacts/admin-nav-20260916/`.
Die Prüfung erfolgt mit Browser-Viewport-Emulation, nicht auf physischen Mobilgeräten.

## Veröffentlichung

Nur geänderte Dateien aus dem Produktionsexport werden übertragen. Bestehende Fassungen sind lokal gesichert. API, Medien, private Konfiguration und Serverregeln werden von diesem Upload ausgeschlossen. Die ausgelieferten Adminseiten und zugehörigen Styles/Skripte werden anschließend mit dem geprüften Export verglichen.

Zusätzliche Auswahlfeldprüfung: 105 Seiten-/Formularprüfungen bei 320, 412, 481, 768 und 1440 px bestanden, einschließlich öffentlicher Events/Athleten und sämtlicher allgemeiner Inhaltseditoren. Stichproben der Screenshots visuell geprüft. Ein reproduzierbares 3-px-Hoverflackern an Dashboard-Aktionsknöpfen wurde ebenfalls behoben; die Buttons lassen sich nun stabil bedienen.

Veröffentlichung abgeschlossen: 237 Produktionsdateien hochgeladen und anschließend über die öffentliche Website bytegenau mit dem geprüften Export verglichen. Öffentliche Event-Auswahlfelder zusätzlich live bei 412 und 1440 px im Browser geprüft. Der angemeldete Dashboard-Test erfolgte lokal gegen die isolierte Review-API; produktive Admin-Anmeldungen wurden nicht getestet.
