# SmashTime – Umsetzungsplan nach Audit

Stand: 16. September 2026. Grundlage: [Auditbericht](AUDIT-20260916.md).

## Verbindliche Leitlinien und Fortschritt

- **Intro unverändert:** A13 ist bewusst akzeptiert; keine Änderung von Ablauf, Wartezeit, Animation oder Intro-Bild.
- **Domain/HTTPS später:** A01 ist bis zur Domainwahl zurückgestellt. Die Konfiguration wird vorbereitet, bestehende Sicherheitsprüfungen werden nicht abgeschaltet.
- **Keine Platzhalter:** Echte Inhalte und Bilder verwenden. Fehlende Inhalte redaktionell erkennbar machen; öffentlich eine bewusst gestaltete Darstellung ohne erfundene Daten oder Ersatzporträts wählen. Unfertige Funktionen nicht als aktive Bedienelemente ausliefern.
- **Einheitliche Bedienung:** Event planen → Athleten/Disziplinen zuordnen → Fightcard organisieren → prüfen → veröffentlichen. Entwurf, öffentlich und archiviert müssen überall dasselbe bedeuten.
- **Admin-Gestaltung:** Dashboard, Sidebar, Listen, Editor, Vorschau, Status, Dialoge und mobile Navigation erhalten gemeinsame Abstände, Typografie, Farben und Interaktionsregeln. Jede Anzeige muss eine konkrete redaktionelle Aufgabe unterstützen.
- **Schrittweise Abnahme:** Jeder Umsetzungsschritt wird mit tatsächlichen Fehlerfällen und im Browser geprüft. Offene Punkte werden nicht als erledigt markiert.

| Arbeitspaket | Status |
|---|---|
| A08: Mobiles Logo und Menü | Erledigt und live geprüft |
| Lokaler Testzugang | Gestartet und Anmeldung geprüft |
| A02/A03/A04/A07/A12: Publikationsregeln und Eingabefehler | Umgesetzt; isolierte Integrationstests bestanden |
| A05/A10: Schutz ungespeicherter Änderungen und direkte Editorlinks | Editorlinks und Schutz bei Links/Schließen/Abmelden umgesetzt; Browser-Zurück bleibt offen |
| Gemeinsames Umordnen einer Fightcard | Umgesetzt; Transaktion, Versionskonflikte, Entwurf und öffentliche Reihenfolge geprüft |
| A06 und weitere Konto-/Betriebssicherheit | Offen |
| Admin-Dashboard, Sidebar und durchgängige visuelle Überarbeitung | Erste gemeinsame Gestaltung umgesetzt; mobile Navigation, kurze Listen und Editor geprüft |
| Bild-Upload mit Vorschau | Umgesetzt; echter Upload, erneutes Öffnen und Entfernen aus Entwurf geprüft |
| Öffentliche Inhaltsqualität, Einstellungen, Medien und Metadaten | A11/A14 korrigiert, erfundene Ersatzbilder entfernt; weitere Inhalte/Einstellungen offen |
| Abschließende Browser-/Geräte-/Performanceprüfung | Offen |
| Registrierung, Bewerbungen, Rollen | Nutzerentscheidung: spätere Ausbaustufe; zuerst bestehendes CMS fertigstellen |

Die folgenden Phasen gelten mit diesen Vorrangregeln.

## 1. Freigabeumfang und stabile Testumgebung

1. Festhalten, ob Version 1 das bestehende CMS oder zusätzlich Fighter-Registrierung, Bewerbungen und differenzierte Rollen umfasst. Produktdokumentation an die tatsächliche Architektur anpassen.
2. Austauschbare Ziel-Domain-Konfiguration vorbereiten. Aktivierung von HTTPS und endgültigen Canonicals/Sitemap erst nach Domainwahl.
3. Dauerhaft erreichbare, geschützte Review-Umgebung mit separater Datenbank und korrekt ausgelieferten Uploads bereitstellen. Verbliebene Audit-Testdaten dort bereinigen; Produktionsdaten bleiben unberührt.

**Abnahme jetzt:** Lokale Testanmeldung funktioniert; Review und Produktion nachweislich getrennt; Ziel-Domain zentral konfigurierbar. **Vor späterem öffentlichen Betrieb:** Sichere Anmeldung über die endgültige HTTPS-Domain und keine gemischten HTTP-Inhalte.

## 2. Veröffentlichung und Bearbeitung absichern

1. A02/A03: Eindeutigkeit öffentlicher Slugs und Kampfpositionen gegen die tatsächlich veröffentlichten Fassungen prüfen. Konkurrierende Schreibvorgänge durch geeignete Transaktionen/Constraints absichern. Umordnen mehrerer Kämpfe als gemeinsamen Vorgang behandeln.
2. A04: Referenzprüfung im Editor und Backend vereinheitlichen. Ein neuer Entwurf darf die vorhandene veröffentlichte Athleten-/Eventfassung nicht unsichtbar machen.
3. A05: Ungespeicherte Änderungen bei interner Navigation und Tab-/Fensterschließen schützen; verständliche Auswahl Speichern, Verwerfen, Weiterbearbeiten.
4. A07/A12: Website-Einstellungen serverseitig als Einzelobjekt absichern und fehlerhafte Eingaben kontrolliert beantworten.
5. A10: Direkte Neu-/Bearbeiten-Links mit dem richtigen Editor verbinden.

**Abnahme:** Alle Audit-Reproduktionen schlagen nach der Korrektur kontrolliert fehl bzw. funktionieren wie vorgesehen. Zwei Redakteure können keine widersprüchliche öffentliche Fightcard erzeugen. Bestehende Entwürfe und veröffentlichte Inhalte bleiben erhalten.

## 3. Konto- und Betriebs­sicherheit

1. A06: Beim Passwortwechsel andere Sitzungen widerrufen; Verhalten der aktuellen Sitzung ausdrücklich definieren und testen.
2. Verständliche Behandlung abgelaufener Sitzungen und fehlgeschlagener Speicherungen mit Erhalt der Eingaben.
3. Änderungsprotokoll um Akteur, verständlichen Objektnamen, Aktion und relevante Änderungen erweitern; sicherheitsrelevante Ereignisse aufnehmen, keine Geheimnisse protokollieren.
4. Skript-CSP und Uploadgrenzen kontrolliert härten. Rollenmatrix umsetzen, falls sie zum bestätigten Releaseumfang gehört.
5. Datenbank und Medien sichern; Wiederherstellung in einer leeren Review-Umgebung praktisch durchführen. JSON-Export eindeutig als Inhaltsexport kennzeichnen.

**Abnahme:** Zweite Sitzung nach Passwortwechsel abgewiesen; keine verlorenen Eingaben bei Sitzungsablauf; nachvollziehbare Änderungen; dokumentierter erfolgreicher Restore; Berechtigungsmatrix vollständig getestet.

## 4. Admin-Alltag und öffentliche Darstellung

1. A08/A09: Mobiles Logo und Dashboard-Umschaltgrenze korrigieren.
2. A11/A14: Titelkampf, Disziplin und Videobeschriftungen korrekt darstellen.
3. Fightcard nach Event übersichtlich bearbeiten, umordnen und in der tatsächlichen öffentlichen Darstellung prüfen.
4. Pro Einstellungsfeld dokumentieren: Zweck, Zielseite, Validierung, Vorschau und Veröffentlichungsverhalten. Fehlende gewünschte Einstellungen ergänzen; mehrdeutige Labels klären.
5. Vorschau an die tatsächlichen Seiten angleichen. Medienübersicht und sichere Bereinigung nicht mehr verwendeter Uploads ergänzen.
6. Produktregeln für Dezimalpreise/-gewichte, Bilanzverifikation und Disziplinvorgaben festlegen und durchgängig umsetzen.
7. Fehlende Porträts, Logos und freigegebene Betreiber-/Rechtstexte ergänzen.

**Abnahme:** Jeder vereinbarte Einstellungswert lässt sich speichern, erneut öffnen, veröffentlichen und öffentlich überprüfen. Testevent mit mehreren Kämpfen sieht auf allen vereinbarten Geräten korrekt aus. Keine verlorenen Eingaben oder unverständlichen Platzhalter.

## 5. Performance, Zugänglichkeit und Metadaten

1. Intro unverändert lassen. Dessen bewusst gewählte Wartezeit bei Performance-Auswertungen gesondert ausweisen.
2. Reproduzierbare Messungen auf gedrosseltem Mobilprofil und normalen Desktopverbindungen durchführen; Startseite, Eventdetail und Admin-Editor einschließen.
3. Cache-Regeln anhand Assetversionierung und Aktualisierungsbedarf festlegen; ungenutzte Exportassets reduzieren.
4. Canonical-/Open-Graph-Daten für alle öffentlichen Seiten ergänzen und wichtige Inhalte möglichst bereits in der HTML-Antwort bereitstellen.
5. Tastaturfokus, Formlabels, Kontrast, Fehlermeldungen, Zoom und Screenreaderabläufe vollständig prüfen.

**Abnahme:** LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 als Zielwerte; Labormessungen und später echte Nutzungsdaten getrennt ausweisen. Auswirkungen des unveränderten Intros transparent dokumentieren. Vollständige Metadaten und nachvollziehbare Zugänglichkeitsprüfung.

## 6. Abschließende Freigaberunde

Verbindliche Browsermatrix: aktuelles Chrome/Edge, Firefox sowie Safari auf macOS und iOS; zusätzlich ein echtes Android-Gerät. Versionen und Geräte im Abschlussbericht festhalten. Breiten mindestens 320, 390, 768, 1024, 1440 und 1920 px sowie unmittelbar vor/nach den Layout-Umschaltpunkten.

Für jeden Browser die Kernkette prüfen: anmelden → Athlet anlegen → Event anlegen → mehrere Kämpfe zuweisen → Entwurf/Vorschau → veröffentlichen → öffentliche Fightcard → bearbeiten → archivieren/wiederherstellen → abmelden. Zusätzlich alle vereinbarten Einstellungen, Uploads, Fehlerfälle und parallelen Zugriffe testen.

**Freigaberegel:** Keine offenen P1-Befunde; P2 vollständig behoben oder bewusst mit Verantwortlichem und Termin akzeptiert; keine ungetesteten Pflichtfunktionen. Build, Regressionstests, Backup und Restore bestanden. Erst anschließend Produktionsupload und erneute Live-Prüfung.

## Empfohlene Reihenfolge

Zuerst Phase 1–3, danach Phase 4–5, abschließend Phase 6. Falls Registrierung, Bewerbungen und Rollen bereits in Version 1 gehören, erhalten sie vor Phase 6 einen eigenen Entwicklungs- und Testblock. Ein belastbarer Aufwand lässt sich erst nach dieser Umfangsentscheidung und der technischen Ausarbeitung der Publikationsregeln festlegen.

Dieser Plan wird während der Umsetzung fortgeschrieben. Nur ausdrücklich als erledigt markierte Punkte gelten als abgeschlossen.
