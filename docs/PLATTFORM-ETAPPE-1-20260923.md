# Plattformverbesserung – Etappe 1

Stand: 23. September 2026. Bezug: [Gesamtplan](PLATTFORM-VERGLEICH-UND-PLAN-20260923.md).

## Umgesetzt

- Gemeinsame Begriffe und Reihenfolge in Desktop-, Mobil- und Footernavigation: Events, Athleten, Medien, Über SmashTime. Aktiver Bereich gekennzeichnet. Organisationszugang eindeutig benannt.
- Eventdetail als eigenständige Komponente: kompakter Einstieg, direkte Abschnittslinks, Fightcard vor Besucherinformationen, ein gemeinsamer Bereich für Preise und Hinweise, danach Programm.
- Instagram-Buchungswege als Reservierung beschriftet. Keine Buchungsaufforderung bei Absage oder nach dem angekündigten Beginn. Preise einheitlich als EUR formatiert.
- Medienübersicht mit einer Suche, gemeinsamem Datumssortieren und Typfilter. Keine separate leere Videosektion. Such-/Filterkombinationen können zurückgesetzt werden.
- Doppelten Ablaufblock aus dem Dashboard entfernt. Hinweise auf fehlende Portraits und ungeprüfte Rekorde führen zu funktionierenden, über die Adresse steuerbaren Filtern.
- Listenexport als Gesamtexport bezeichnet. Datenumfang unverändert.

## Prüfung

- Produktionsbuild einschließlich TypeScript erfolgreich, gezieltes ESLint ohne Fehler oder Warnungen.
- 209 Seiten-/Größenkombinationen: acht öffentliche Seiten sowie alle elf Adminbereiche, jeweils elf Breiten von 320 bis 1920 px; 600 px mit kurzer Querformat-Höhe. Keine horizontalen Überläufe oder abgeschnittenen geprüften Texte, keine JavaScript-Seitenfehler.
- 28 Formular-/Größenkombinationen für sieben Inhaltstypen; fünf zusätzliche Tablet-Kopfzeilenbreiten ohne Überlappung.
- Tatsächliche Klickstrecken: Mediensuche und Rücksetzen, Fightcard-Sprunglink, mobiles Menü, Dashboard-Verknüpfung und Wechsel der Qualitätsfilter.
- Acht zusätzliche Szenarien mit ausschließlich im Browser simulierten Daten: gemischte Medien nach Datum, kombinierte Suche/Typfilter, Rücksetzen, abgesagtes Event, vergangener Beginn, fehlender Ticketlink, leere Fightcard, leere Medienübersicht.
- Während der Prüfung entdeckten Übergabefehler beim Dashboard-Filter behoben und erneut geprüft. Keine CMS-Testdaten veröffentlicht.
- Browser: Chromium mit simulierten Viewports. Firefox, Safari und physische Geräte sind damit nicht abgedeckt.
- Nach dem Upload weitere 88 öffentliche Seiten-/Größenkombinationen und die Besucher-Klickstrecken direkt auf der Live-Website erfolgreich geprüft.

## Veröffentlichung

247 geänderte Produktionsdateien hochgeladen; alle 247 anschließend per Hash-Abgleich gegen den geprüften Export bestätigt. Vorhandene Versionen wurden vorher gesichert. API, CMS-Daten, Uploads, private Konfiguration und fremde Serverdateien wurden nicht ersetzt. Live-Klickprüfung separat im Artefaktordner dokumentiert.

Nachweise: `artifacts/platform-implementation-20260923/` mit `checks.json`, `states.json`, Screenshots, Veröffentlichungsmanifest und Live-Prüfergebnissen.

## Weiter offen

Die übrigen Etappen des Gesamtplans bleiben offen: Teamkämpfe und strukturierte Ergebnisse, Event-/Ticketstatus, Dezimalvalidierung im Backend, weitere Startseitenstraffung, Event-Arbeitsbereich, echte öffentliche Vorschau, Medienbezüge, Metadaten/kanonische URLs sowie Betriebs- und Browserprüfungen. Fehlende Portraits, Logos und bestätigte Angaben benötigen weiterhin redaktionelle Ergänzung.
