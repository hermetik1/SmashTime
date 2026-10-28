# Etappe 3 – Kompakter Event-Arbeitsbereich (24.09.2026)

## Umsetzung
- Events öffnen einen gemeinsamen Arbeitsbereich mit Übersicht, Besucher & Tickets, Fightcard, Ergebnissen, Medien und Vorschau.
- Aktiver Bereich und Event stehen in der URL; direkte Links und Neuladen erhalten den Kontext.
- Bestehende Datensätze werden weiterverwendet. Fightcards und Medien werden nach Event gefiltert; neue Einträge erhalten die Eventzuordnung automatisch.
- Ergebnisse bearbeiten dieselben Kämpfe. Neuanlage und Duplizieren sind dort ausgeblendet. Änderungen am Ergebnis heben die Bestätigung weiterhin auf.
- Eventfelder sind nach Aufgabe verteilt. Listen verschwinden während der Bearbeitung; die Vorschau belegt einen eigenen Tab. Andere Inhaltseditoren erhalten eine einklappbare Vorschau.
- Dashboard-Verknüpfungen führen beim nächsten veröffentlichten Event direkt zur Verwaltung bzw. Fightcard.
- Mobile Tabs sind horizontal scrollbar, Bedienelemente bleiben mindestens 44 px hoch. Formularaktionen und Textfelder wurden kompakter gestaltet.

## Prüfung
- Produktionsbuild (48 Routen), TypeScript und gezieltes ESLint erfolgreich.
- 72 Layoutprüfungen: sechs Tabs auf zwölf Breiten von 320 bis 1920 px; kein horizontaler Seitenüberlauf. Screenshots mobil und Desktop visuell geprüft.
- Navigation mit ungespeicherten Änderungen: Weiterbearbeiten und Verwerfen geprüft.
- Eventzuordnung neuer Medien sowie Erhalt der Eingaben bei simuliertem Speicherfehler geprüft. Tests verändern keine Redaktionsdaten.
- Die Vorschau ist eine kompakte Inhaltsvorschau gespeicherter Entwürfe, keine vollständige öffentliche Seitenvorschau. Die öffentliche Version bleibt separat erreichbar.

## Verbleibende Arbeit im Gesamtplan
Weitere Aufgaben aus dem Plattformplan (unter anderem vollständige Rollen-/Berechtigungsprüfung, weitere redaktionelle Abläufe und öffentliche Seitendetails) sind nicht Bestandteil dieser Etappe. Der hier eingeführte Arbeitsbereich konzentriert sich auf Eventverwaltung.

## Veröffentlichung
241 geänderte Produktionsdateien per SFTP hochgeladen. Alle 241 Dateien anschließend über HTTP abgerufen und per SHA-256 mit dem geprüften Export abgeglichen. Bestehende Dateien vorher gesichert; API und Medien unverändert. Lokale Vorschau und isoliertes Test-Backend laufen weiter.
