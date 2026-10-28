# Athletenprofile und responsive Prüfung – 23. September 2026

Die Athletenprofile bündeln Foto, Namen und bestätigte Bilanz im Einstieg. Steckbrief und Biografie folgen getrennt; Paarungen zeigen Gegner, Event, Datum und gegebenenfalls Ergebnisse. Zukünftige und vergangene Paarungen sind getrennt. Fehlende Daten werden nicht erfunden. Navigation zwischen Profilen aktualisiert Inhalt und Sprungposition korrekt, inklusive Browser-Zurück.

Beim visuellen Nachtest wurde ein Ziffernumbruch bei zweistelligen Rekorden auf 320 px entdeckt und durch nicht umbrechende Zahlen korrigiert.

## Prüfung des Produktionsexports

- Build inklusive TypeScript und gezieltes ESLint erfolgreich.
- 280 öffentliche Seiten-/Größenkombinationen: 20 Seiten mit allen neun veröffentlichten Athletenprofilen bei 320, 360, 375, 390, 412, 480, 600, 768, 800, 900, 1024, 1280, 1440 und 1920 px. 600 px zusätzlich mit geringer Querformat-Höhe. Keine horizontalen Überläufe, abgeschnittenen geprüften Texte, defekten geladenen Bilder oder JavaScript-Seitenfehler.
- 99 Dashboard-Kombinationen: elf Bereiche bei neun Größen von 320 bis 1920 px, im isolierten Review-Backend.
- 28 Formular-/Größenkombinationen, fünf tatsächlich geöffnete mobile Navigationsgrößen mit Escape-Schließen.
- Zweistellige Rekorde auf zehn Größen geprüft; Tastaturnavigation, Profilwechsel mit Sprungposition, Browser-Zurück und Event-Fightcard-Anker erfolgreich.
- Zusätzliche Testdaten ausschließlich im Browser: No Contest, langer Teamname, vergangene und künftige Kämpfe, abgesagtes Event.
- Screenshots unter `artifacts/profile-redesign-20260917/`, visuelle Kontrolle insbesondere bei 320, 390, 768 und 1440 px. Chromium mit simulierten Viewports; keine physischen Geräte oder andere Browser behauptet.

## Veröffentlichung

Nur geänderte Dateien des Produktionsexports werden hochgeladen. Bestehende Versionen werden vorher gesichert. CMS-Daten, Uploads, API und private Konfiguration werden nicht ersetzt. Manifest und anschließender Hash-Abgleich liegen im Artefaktordner. Live-Prüfung der Profile und Navigation bei fünf Breiten.

Offen bleiben redaktionelle Ergänzungen wie Fotos, Disziplin, Team, persönliche Biografien und bestätigte Kampfdaten.
