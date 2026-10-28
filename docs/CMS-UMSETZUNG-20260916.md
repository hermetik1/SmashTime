# SmashTime – CMS-Schritt 1

Stand: 16. September 2026. Bestehendes CMS zuerst. Intro unverändert, Domain/HTTPS zurückgestellt.

## Umgesetzt

- Einheitliche Admin-Gestaltung: Sidebar mit Bereichen, Dashboard mit echten Redaktionsaufgaben, konsistente Formulare, Status und Dialoge.
- Mobil: einklappbare Navigation, kompakte Filter, maximal sechs Listeneinträge pro Seite, Suche und Statusfilter. Beim Bearbeiten wird die Hintergrundliste ausgeblendet; „Zur Liste“ führt zurück. Das gilt auch für Events, sodass die Seitenlänge nicht mit jedem neuen Event wächst.
- Bilder: Datei auswählen/ersetzen, echte Vorschau, Uploadstatus, Entfernen aus dem Entwurf. Keine Bildpfad-Eingabefelder. JPG/PNG/WebP bis 5 MB. Speichern während eines laufenden Uploads gesperrt. Review-Uploads werden auch unter localhost ausgeliefert.
- A02/A03: URL-Kennungen und Kampfpositionen gegen Entwürfe und veröffentlichte Fassungen prüfen; konkurrierende Schreibvorgänge serialisieren.
- A04: Ein neuer Athletenentwurf verhindert nicht mehr die Verwendung der bereits veröffentlichten Fassung in einer Fightcard.
- A07/A12: Website-Einstellungen als Einzelobjekt absichern; ungültiges JSON kontrolliert mit HTTP 400 beantworten.
- A05 teilweise: Speichern/Verwerfen/Weiterbearbeiten bei Editorwechsel, internen Links und Abmelden. Native Warnung beim Neuladen/Schließen. Browser-Zurück innerhalb der Anwendung bleibt separat zu lösen.
- A10: Neu- und Bearbeiten-Links öffnen den vorgesehenen Editor.
- Fightcards nach Event filtern und gemeinsam umordnen. Entwurfsreihenfolge verändert die öffentliche Fassung nicht. Öffentliches Übernehmen ändert nur die Reihenfolge bereits veröffentlichter Kämpfe. Andere Entwurfsfelder werden dabei nicht veröffentlicht. Veraltete Versionen und unvollständige/doppelte Kampf-Listen werden abgewiesen.
- A11/A14: Titelkampf, Disziplin und vorhandene Rundendaten öffentlich anzeigen; Videos korrekt beschriften. Fehlende Bilder erzeugen keine erfundenen Portraits oder Monogramme.

## Prüfnachweise

- Produktionsbuild einschließlich TypeScript erfolgreich: 48 statisch erzeugte Seiten. PHP ist weiterhin das separate Backend; Next-API-Routen werden nicht vorausgesetzt.
- ESLint erfolgreich, PHP-Syntaxprüfung der isolierten Review-API erfolgreich.
- `scripts/test-publication.mjs`: ungültiges JSON, Slug-Kollision trotz umbenanntem Entwurf, doppelte Einstellungen, publizierter Athlet mit neuerem Entwurf, Positionskonflikt, gemeinsames Umordnen, Versionskonflikt, doppelte IDs und konkurrierende Schreibvorgänge bestanden. Eigene Testdatensätze anschließend entfernt.
- Browser: echter Portrait-Upload, geladene Vorschau, Entwurf speichern/erneut öffnen, Entfernen/Verwerfen geprüft. Ursprüngliche Denis-Fassung nach dem Test wiederhergestellt.
- Browser: 10 Athleten auf zwei Seiten (6/4), Navigation öffnen/schließen, direkte Denis-Bearbeitung, mobile Ausblendung der Liste, Fightcard-Filter und Umordnen/Verwerfen geprüft.
- Elf Admin-Bereiche bei 320, 768 und 1440 px: 33 Messungen ohne horizontalen Dokumentüberlauf. Portrait-Editor zusätzlich bei 320, 390, 768, 1024 und 1440 px ohne Überlauf.
- Öffentliche Review-Eventseite zeigt Titelkampf und „MMA · Weltergewicht · 3 × 5 Min.“ korrekt.
- Nachweise: `artifacts/cms-step1-20260916/responsive-final.json`, `mobile-events.png`, `portrait-full.png`. Bildschirmgrößen wurden im Chromium-basierten In-App-Browser emuliert; dies ersetzt keinen Test auf echten Geräten oder in anderen Browser-Engines.

## Nächste Schritte / keine vollständige Releasefreigabe

1. A06: Andere Sitzungen nach Passwortwechsel widerrufen; Sitzungsablauf ohne Eingabeverlust.
2. Browser-Zurück und sämtliche Navigations-Sonderfälle absichern.
3. Einstellungen und öffentliche Vorschau Feld für Feld abnehmen; Medienverwaltung, Aktivitäten und Sicherung/Wiederherstellung fertigstellen.
4. Redaktionell fehlende echte Inhalte ergänzen. Bestehende Inhaltsdaten wurden nicht pauschal überschrieben.
5. Safari/Firefox, echte Mobilgeräte, Tastatur/Zugänglichkeit sowie Performance und Sicherheits-Restprüfung. Keine Zusage „100 Prozent fehlerfrei“ aus den bisherigen Tests.

Domain/HTTPS-Aktivierung bleibt bis zur Domainwahl ausgesetzt. Der bestehende Schutz gegen eine unverschlüsselte produktive Admin-Anmeldung bleibt aktiv.
