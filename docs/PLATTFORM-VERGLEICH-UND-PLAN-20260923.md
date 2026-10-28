# SmashTime: Plattformvergleich und Verbesserungsplan

Stand: 23. September 2026. Status: Planung, keine Produktänderung und kein Deployment in diesem Schritt.

Umsetzungsnachtrag: Die erste Etappe wurde anschließend umgesetzt, geprüft und veröffentlicht. Umfang und weiterhin offene Punkte: [Etappe 1 – Umsetzung und Prüfung](PLATTFORM-ETAPPE-1-20260923.md). Die nachfolgenden Bestandsbefunde beschreiben den Zustand vor dieser Umsetzung.

Fortsetzung am 24. September: Teamkämpfe, strukturierte Ergebnisse, Dezimalwerte und der ruhige Hero-Hintergrund sind umgesetzt und veröffentlicht. Details und Grenzen: [Etappe 2 – Umsetzung und Prüfung](PLATTFORM-ETAPPE-2-20260924.md).

## 1. Ergebnis

SmashTime hat bereits eine erkennbare Marke, eine gemeinsame Fightcard-Darstellung, überarbeitete Athletenprofile und ein funktionierendes redaktionelles Grundsystem. Der nächste Qualitätssprung entsteht durch eine klarere Informationshierarchie, verlässlich verknüpfte Daten und kürzere Arbeitswege. Zusätzliche Seiten allein würden die Plattform eher unübersichtlicher machen.

Die wichtigsten Lücken sind:

1. Eventinformationen stehen verteilt und teilweise doppelt auf der Website. Auf der mobilen Eventseite kommt die Fightcard erst nach einem langen Informationsblock.
2. Das angekündigte 2-gegen-2-Format lässt sich mit dem bestehenden Modell „ein Athlet pro Ecke“ nicht vollständig darstellen. Ergebnisse sind bisher Freitext.
3. Die Medienseite hat zwei Suchbereiche; der Videobereich zeigt aktuell einen großen Leerzustand. Die Artikelliste sortiert alphabetisch, die Startseite dagegen nach Datum.
4. Im Admin fehlen ein zusammenhängender Event-Arbeitsbereich und direkt ausführbare Qualitätsaufgaben. Die Vorschau bildet die öffentliche Gestaltung nicht vollständig ab.
5. Fehlende echte Inhalte fallen stärker auf als kleinere Designabweichungen: öffentlich sind derzeit neun Athleten vorhanden, davon fünf ohne Portrait und fünf ohne bestätigten Rekord; alle drei Partner ohne Logo. Es gibt drei Stories und noch keine veröffentlichten Videos.

**Leitregel:** Jede Information hat einen verantwortlichen Datensatz und einen vollständigen öffentlichen Hauptort. Andere Seiten zeigen kurze, automatisch abgeleitete Vorschauen mit einem Link dorthin. Ein Ticketbutton an sinnvollen Stellen ist keine schädliche Dopplung; dreimal separat gepflegte Ticketinformationen sind es.

## 2. Grundlage und Grenzen der Sichtung

- Aktuelle öffentliche Website: 20 URLs — sieben Übersichts-/Informationsseiten, ein Event, neun Athletenprofile, drei Artikel. Inhalte und Seitentitel erfasst; ausgewählte vollständige Seiten bei 390 und 1440 px visuell gesichtet.
- Admin: alle elf Bereiche im isolierten Review-Backend, sieben neue Inhaltsformulare, Website-Einstellungen sowie die besonderen Athletenrouten. Review-Daten enthalten Testeinträge und sind nicht mit den öffentlichen Bestandszahlen gleichzusetzen.
- Quellcodeprüfung: Navigation, Listen, Detailseiten, gemeinsame Fightcard, Formulare, Vorschau, Datenfelder, Validierung, Export, Aktivitäten und Konto. Keine schreibenden CMS-Aktionen ausgeführt.
- Vorhandene responsive Prüfung vom selben Tag: 280 öffentliche und 99 Admin-Seiten-/Größenkombinationen sowie Formular- und Navigationstests. Siehe [Prüfbericht Athletenprofile](ATHLETE-PROFILES-20260923.md). Das ist Chromium mit simulierten Größen, keine Prüfung aller physischen Geräte.
- Aktuelle offizielle Seiten von OKTAGON und ONE; für UFC zusätzlich die vorhandene visuelle Browser-Sichtung aus dem vorherigen Vergleich. Der erneute textbasierte UFC-Abruf lieferte 403. Keine Aussagen über interne Systeme dieser Organisationen: Die Admin-Empfehlungen sind aus unseren Arbeitsabläufen abgeleitet.
- Kein vollständiges Sicherheits-, Rechts- oder Lastgutachten. Nachfolgend ausdrücklich als Prüfaufgaben bezeichnete Punkte sind keine nachgewiesenen Produktionsfehler.

Die aktuelle Inventur und Screenshots liegen unter `artifacts/platform-plan-20260923/`. Vollseitenbilder können noch nicht geladene Bilder außerhalb des sichtbaren Bereichs enthalten; solche Stellen wurden nicht als defekte Assets gewertet.

## 3. Was wir von großen Organisationen übernehmen sollten

| Referenz | Beobachtetes Muster | Sinnvolle Übertragung auf SmashTime |
|---|---|---|
| [UFC-Athletenprofil](https://www.ufc.com/athlete/alexandre-pantoja) und [UFC-Event](https://www.ufc.com/event/cryptocom-ufc-331) | Identität und sportliche Kerndaten sind hervorgehoben; Kampfbezug, Historie und weitere Inhalte haben getrennte Bereiche. Die Fightcard ist nach Abschnitten gegliedert. | Unsere neue Profilstruktur behalten. Verifizierte Fakten klar priorisieren; kommende Paarungen und abgeschlossene Kämpfe unterscheiden. Bei größeren Cards echte Gruppen verwenden. |
| [OKTAGON-Events](https://oktagonmma.com/en/events/) | Eventkarten bündeln Termin, Ort und konkrete Aktionen wie Tickets, Fightcard und gegebenenfalls Übertragung. Kommende und vergangene Events sind getrennt. | Ein eindeutiger Einstieg pro Event; Ticketaktion passend zum tatsächlichen Verkaufsweg; vergangene Events führen zu Ergebnissen. |
| [OKTAGON-Athletenprofil](https://oktagonmma.com/en/fighters/551/) | Kompakter sportlicher Steckbrief, Rekord, Gym, Hintergrund und zugeordnete News. | Stammdaten plus kurze persönliche Biografie; Stories und Videos über eine Athletenzuordnung verknüpfen, statt Texte zu kopieren. |
| [ONE-Events](https://www.onefc.com/events/) | Das nächste Event und die Wege zu Tickets, Übertragung und vergangenen Veranstaltungen stehen im Zentrum. Kalender und Status unterstützen die Orientierung. | Ein Event verändert seine Darstellung über seinen Lebenszyklus. Vorher Tickets und Anreise, danach Ergebnisse und Rückblick. Übertragung nur anbieten, wenn es ein reales Angebot gibt. |

Nicht automatisch übernehmen: riesige Mega-Menüs, Bezahlstreaming, Shop, Fan-Konten, Rankings oder eine App. Diese Angebote benötigen verlässliche Daten, Betrieb und Betreuung. Für unsere aktuelle Größe wären viele davon zusätzliche leere Bereiche. Die rote SmashTime-Marke, das VS-Bild und die dunkle Kampfsportästhetik bleiben eigenständig.

## 4. Zielstruktur für Besucher

Hauptnavigation: **Events · Athleten · Medien · Über SmashTime**. Eine Ticketaktion erscheint, wenn ein passendes Event mit freigegebenem Verkaufsweg existiert. Partner, Kontakt und rechtliche Informationen bleiben klar im Footer und im mobilen Menü erreichbar. Den bisherigen Fan-untypischen prominenten „Login“ als Organisationszugang einordnen; angemeldete Redakteure behalten einen schnellen Dashboard-Zugang.

Desktop und Mobil verwenden dieselben Begriffe. „Medien“ umfasst Stories und Videos mit einer gemeinsamen Suche und Filterung. Keine zusätzliche öffentliche Fightcard-Seite: Die vollständige Card gehört zum Event. Kein separates Ergebnis-Duplikat: Abgeschlossene Events enthalten ihre Ergebnisse; eine spätere Ergebnisübersicht verweist darauf.

### Seitenplan — öffentliche Plattform

| Seite / Vorlage | Aktueller Befund | Geplante Verbesserung |
|---|---|---|
| Startseite `/` | Starke Inszenierung, mehrere große Stimmungsabschnitte, drei bereits vollständige Paarungen, Stories, Partner und erneute Eventwerbung. | Eventdatum, Ort und Hauptaktion früher zeigen. Höchstens ein kompakter Fightcard-Ausschnitt, danach „Gesamte Fightcard“. Stimmungsabschnitte redaktionell straffen; Einstieg → nächstes Event → ausgewählte Athleten/Stories → Partner. Kein vollständiger zweiter Eventauftritt. Das ausdrücklich gewünschte Intro bleibt zunächst bestehen. |
| Events `/events/` | Suche und Zeitraumfilter vorhanden; standardmäßig alle Events chronologisch aufsteigend. | Kommende Events zuerst, vergangene getrennt und neueste zuerst. Karten mit Datum, Ort, Status und passender Hauptaktion. Bei einem einzigen Event unnötige Filter reduzieren. |
| Eventdetail `/events/detail/?slug=…` | Ticketlink im Einstieg; danach Countdown, Fakten, Besucherhinweise, Ticketpreise, dieselben Hinweise erneut, Programm, zuletzt Fightcard. | Kompakter Eventkopf mit Datum/Ort/Status; direkte Abschnittslinks „Fightcard · Tickets & Besuch · Programm“. Fightcard deutlich früher. Preise, Reservierung und Hinweise in einem Besucherbereich zusammenführen. Kalender und Kartenlink sinnvoll ergänzen. |
| Fightcard innerhalb des Events | Gemeinsame Darstellung und VS-Asset vorhanden; Hauptkampf wird aus dem Namen erkannt; drei veröffentlichte Paarungen; viele fehlende Portraits. | Eigene Felder für Hauptkampf/Co-Main/weitere Abschnitte und Kampfstatus. Saubere Teamdarstellung für 2-vs-2. Ergebnisse strukturiert anzeigen. Keine leeren Prelim-Gruppen bei kleinen Cards. |
| Athleten `/fighters/` | Namenssuche und Disziplinfilter vorhanden; teils Platzhalter statt Portraits. | Einheitliche Bildausschnitte und klare Kartenhierarchie. Filter nur nach tatsächlich gepflegten Merkmalen; Anzahl und Rücksetzen verständlich. Keine erfundenen Werte oder Ranglisten. |
| Athletenprofil `/fighters/detail/?slug=…` | Neue Struktur mit Identität, Rekord, Steckbrief und Paarungen bereits umgesetzt. | Behalten und redaktionell vervollständigen. Gesamtkarriere-Rekord deutlich von den bei SmashTime dokumentierten Kämpfen unterscheiden. Zugeordnete Medien ergänzen, sobald vorhanden. Fehlende Abschnitte kurz behandeln statt lange Leerblöcke zu zeigen. |
| Alternative Event-/Athletenpfade `/{kind}/{slug}/` | Neben den Query-Detailrouten bestehen weitere Routenvorlagen. | Eine kanonische Adresse pro Inhalt festlegen; übrige Varianten kontrolliert weiterleiten oder kanonisch zuordnen. Bestehende Links erhalten. Umsetzung abhängig vom Export-/Hosting-Konzept. |
| Medien `/media/` | Zwei getrennte Suchleisten und Zähler. Aktuell großer leerer Videobereich. Artikel alphabetisch statt zeitlich sortiert. | Ein Einstieg, eine Suche, Filter „Alle / Stories / Videos“, neueste Inhalte zuerst. Leere Medienarten nicht als große Sektion bewerben. Event-/Athletenfilter erst bei ausreichendem Bestand. |
| Artikel `/articles/detail/?slug=…` | Rubrik, Datum, Bild, Text, Eventlink vorhanden. Alle drei Artikel haben den generischen Browsertitel „Stories“. Eventguide wiederholt manuell Datum, Uhrzeit und Preise. | Individueller Titel und Vorschautext. Eventfakten aus dem Event beziehen oder dorthin verlinken. Artikelwechsel innerhalb derselben Route gezielt nachtesten; im Code wird die Query noch anders behandelt als bei Athleten. Verwandte Inhalte klein halten. |
| Partner `/partners/` | Drei Partner ohne Logos; generischer Such-/Listenaufbau. Startseite zeigt Namen separat als Vorschau. | Nach Partnerschaftsstufe geordnete Logos mit optionaler Kurzbeschreibung; ein klarer Kontakt für Interessenten. Gemeinsame Partnerdaten für Startseite und Partnerseite. Suche bei drei Einträgen entbehrlich. |
| Über uns `/about/` | Große Bildsprache, Manifest und Werte; wenig konkrete Organisationsinformation. | Menschen, Veranstalter, Ort und sportliche Ausrichtung sichtbar machen. Werte einmal ausführlich hier; Startseite nur kurzer Auszug. Echte Bilder und freigegebene Angaben statt weiterer Werbeslogans. |
| Kontakt `/contact/` | E-Mail und Instagram vorhanden. | Klare Anliegen: Besucher/Tickets, Partnerschaften, Presse, sportliche Anfragen. Zunächst passende Kontaktwege; Formular nur mit geregelter Zuständigkeit und Rückmeldung. Ticketfragen zum jeweiligen Event führen. |
| Nicht gefunden / unveröffentlicht / Laden / Fehler | Verschiedene vorhandene Zustände; 404 verwendet noch eine andere, limefarbene Gestaltung. | Einheitliches Design, klarer Rückweg, gegebenenfalls erneutes Laden. Fehlende Detailinhalte dürfen nicht wie kaputte Profile wirken. Echte HTTP-404-Auslieferung auf dem Webspace gesondert prüfen. |
| Footer und Betreiberinformationen | Kein eigener Impressums-/Datenschutz-Routensatz im aktuellen Seiteninventar. | Verbindliche, freigegebene Betreiber- und Datenschutzinhalte mit erreichbaren Seiten einplanen. Zuständige Person liefert bzw. prüft die Texte; keine Platzhalter als fertige Freigabe behandeln. |

### Gestaltung auf Mobil und Desktop

- Mobil: kompaktere Unterseiten-Einstiege, direkt erreichbare Inhalte und ausreichend große Bedienelemente. Bei Bedarf eine einzelne Ticketleiste, die nur erscheint, wenn die normale Hauptaktion nicht sichtbar ist; sie darf Inhalt und Footer nicht verdecken.
- Desktop: Eventkopf in zwei übersichtlichen Spalten, danach klare Abschnittsbreiten. Lange Textblöcke nicht über die gesamte Bildschirmbreite ziehen. Listen und Karten an denselben Rastern ausrichten.
- Fightcards: beide Seiten gleichwertig, Namen vor dekorativen Details, VS als verbindendes Zeichen. Lange Namen und zwei Personen je Team ausdrücklich gestalten. Gewinnerkennzeichnung zusätzlich als Text, nicht nur durch Farbe.
- Einheitliche Abstände, Feldhöhen, Pfeilabstände, Kartenrahmen, Bildformate und Statusanzeigen. Die bereits korrigierten Select-Pfeile und mobilen Menüs bleiben Bestandteil der Regressionstests.
- Deutsch für funktionale Bedienung; englische Markenclaims gezielt einsetzen. Große Versalien für kurze Headlines, gut lesbare normale Schreibweise für Informationen.

## 5. Admin als zusammenhängender Arbeitsbereich

Die vorhandenen Entwürfe, Veröffentlichungssnapshots, Referenzprüfungen, Bild-Uploads und Fightcard-Reihenfolge bleiben die Grundlage. Wir ersetzen diese funktionierenden Teile nicht durch ein neues CMS.

| Bereich / Unterseite | Befund und Ziel |
|---|---|
| Dashboard `/admin/` | Schnellaktionen und Ablaufblock wiederholen dieselben Wege. Auf nächstes Event, offene Aufgaben, Entwürfe und letzte Änderungen konzentrieren. „Fotos fehlen“ öffnet eine gefilterte Athletenliste statt die allgemeine Übersicht. Zähler erklären, ob sie Entwürfe, öffentliche Fassungen oder alle Einträge zählen. |
| Events `/admin/events/` und Editor | Ein Event wird zum zentralen Arbeitsbereich: **Übersicht · Besucher & Tickets · Fightcard · Ergebnisse · Medien · Vorschau**. Das sind Ansichten derselben Daten, keine neuen Kopien. |
| Athleten `/admin/fighters/`, `/new/`, `/{slug}/edit/` | Stammdaten gruppieren: Identität, Sport, Rekord/Quelle, Foto, Biografie/Links. Fehlende Angaben filtern; Verwendung in Events anzeigen. Ein konsistenter Editor unabhängig vom Zugangsweg. |
| Fightcards `/admin/fightcards/` und Editor | Bestehenden Eventfilter und die Reihenfolge behalten. Standardmäßig im Eventkontext öffnen, Event vorauswählen. Sportliche Rollen, Teamformat, Absage/Ersatz und Ergebnis erfassen. Globale Übersicht bleibt für Arbeit über mehrere Events hinweg. |
| Disziplinen `/admin/disciplines/` | Regelwerk und Gewichtsklassen zentral pflegen. Derzeit ist eine kommagetrennte Gewichtsklassenangabe vorhanden, während Paarungen und Profile Freitext nutzen. Konsistente Auswahl schaffen; historische Kampfregeln nachträglich nicht unbemerkt verändern. |
| Stories `/admin/articles/` | Entwurf, Vorschau und Veröffentlichungsstatus klar zeigen. Event-/Athletenzuordnung statt Wiederholung von Stammdaten. Veröffentlichungsdatum bewusst behandeln; automatische Terminveröffentlichung erst mit zuverlässigem Hintergrundprozess anbieten. |
| Videos `/admin/videos/` | Eigenes Erfassungsformular behalten, im Navigationsbereich „Medien“ mit Stories bündeln. Vorschaubild, Datum, Quelle sowie Event/Athletenbezug ergänzen. Video bleibt zunächst extern verlinkt. |
| Partner `/admin/partners/` | Logo, Stufe, Reihenfolge und optional Eventzuordnung verwalten. Anzeige auf Startseite und Partnerseite aus derselben Quelle. |
| Website `/admin/settings/` | Einzelne Einstellungssammlung direkt öffnen. Suche, Sortierung, „Neu anlegen“ und Archivieren sind für einen einzelnen Konfigurationsdatensatz unnötig. Acht bestehende Bereichsgruppen als klare Navigation behalten. SEO-Felder mit tatsächlicher Ausgabe verbinden: aktuell sind Felder vorhanden, im geprüften Frontend aber keine Nutzung dieser Werte gefunden. |
| Konto `/admin/account/` | Passwortwechsel vorhanden. Sitzungsübersicht bzw. Abmelden anderer Sitzungen und verständliche Wiederanmeldung als eigene Betriebsaufgabe planen. Datenverlust bei abgelaufener Sitzung gezielt prüfen. |
| Aktivitäten `/admin/audit-log/` | Aktuell letzte 100 Aktionen mit Datensatzkennung und UTC-Zeit. Lesbaren Objektnamen, Akteur, lokale Zeit und richtige Aktionsbezeichnung ergänzen; Reihenfolgeänderungen nicht als gewöhnlichen Entwurf beschriften. Später Filter und Änderungsdetails. |
| Anmeldung / Abmeldung | Organisationszugang eindeutig benennen. HTTPS-Voraussetzung erhalten. Fehlermeldungen und Rückkehr zur begonnenen Arbeit prüfen. Fan-Konten nicht durch allgemeine Login-Werbung suggerieren. |
| Alle Listen und Editoren | Bearbeiten als eine erkennbare Aktion; Archivieren und Löschen nicht mit demselben ×-Symbol darstellen. Filterzustand bei Rückkehr bewahren. Tatsächliche öffentliche Komponenten für eine verlässliche Vorschau verwenden. |
| Export / Sicherung | Der Export in einer einzelnen Liste enthält derzeit alle Entwürfe und öffentlichen Datensätze. Als „Gesamten Inhaltsbestand exportieren“ benennen oder klar getrennte Bereichsexporte anbieten. JSON-Export ist keine vollständige Datenbank-/Medien-Sicherung; Wiederherstellung separat absichern. |

## 6. Datenlogik: einmal pflegen, überall richtig anzeigen

| Verantwortlicher Datensatz | Enthält | Daraus abgeleitete Anzeigen |
|---|---|---|
| Event | Termin und Zeitzone, Ort, Einlass, Verkauf/Reservierung, Preise, Besucherinfos, Eventstatus | Startseitenhinweis, Eventkarte, Detailseite, Kalender, verknüpfter Eventkasten in Stories |
| Athlet | Identität, Bild, sportliche Stammdaten, freigegebener Rekord mit Quelle und Stand | Profil, Suche, Fightcard, Spotlight |
| Kampf | Event, Format, Teilnehmer je Ecke, Disziplin, Gewichtsklasse, Regeln, Rolle, Reihenfolge, Kampfstatus, Ergebnis | Event-Fightcard, Ergebnisansicht, Kämpfe der beteiligten Athleten |
| Medium | Typ, Datum, Titel, Bild, Text/Link und Bezüge zu Events/Athleten | Medienübersicht, Startseitenvorschau, zugehöriges Event/Profil |
| Partner | Name, Logo, Link, Stufe, Reihenfolge und gegebenenfalls Eventbezug | Partnerübersicht, Startseite, Eventpartner |

**Erforderliche Modellergänzungen:**

- Veröffentlichung und sportlichen Zustand trennen: Ein veröffentlichtes Event kann angekündigt, beendet, verschoben oder abgesagt sein. Ein veröffentlichter Kampf kann geplant, abgesagt oder abgeschlossen sein.
- Ticketstatus und Verkaufsweg explizit: angekündigt, offen, ausverkauft, beendet; externer Shop oder Reservierung. Beim aktuellen Instagram-Weg muss die Aktion „Reservieren“ heißen, nicht einen Checkout versprechen.
- 1-vs-1 und 2-vs-2 ausdrücklich modellieren. Bestätigte Teammitglieder einzeln zuordnen; unbekannte Teilnehmer klar kennzeichnen. Ein Turnierbaum ist eine zusätzliche Ausbaustufe, nicht Voraussetzung für eine korrekte Team-Paarung.
- Ergebnis: Siegerseite oder Unentschieden/No Contest, Methode, Runde, Zeit und Bestätigungsstatus. Bestehenden Ergebnistext bei Migration bewahren; keine automatische Deutung unklarer Angaben.
- Gesamtkarriere-Rekorde nicht automatisch aus den wenigen SmashTime-Kämpfen berechnen. Andere Veranstalter sowie verschiedene Disziplinen können enthalten sein; das benötigt eine festgelegte Quellenregel.
- Preise und Kampfgewicht brauchen fachlich passende Dezimalwerte. Die aktuelle gemeinsame Zahlenprüfung erlaubt nur nichtnegative ganze Zahlen.
- Hauptkampf und Card-Gruppe als Felder statt Erkennung über den Titel „Main Event“.

Veröffentlichung bleibt kontrolliert: Entwurf → Prüfung auf fehlende Verknüpfungen und Pflichtangaben → Vorschau → Freigabe. Ein bestehender öffentlicher Stand bleibt sichtbar, bis die nächste Fassung veröffentlicht wird. Bei Absagen und Ersatzpaarungen Historie bewahren.

## 7. Empfohlene Umsetzung in fünf Etappen

Aufwand relativ: S = lokal begrenzte Änderung, M = mehrere Ansichten, L = Datenmodell und zusammenhängende Abläufe. Keine Termin- oder Budgetzusage.

| Reihenfolge | Paket | Umfang | Abnahme |
|---|---|---|---|
| **1 — Ordnung schaffen** | Einheitliche Navigation; Eventhinweise zusammenführen; Fightcard-Sprunglink; Medien mit einer Suche und Datumssortierung; leere Videosektion reduzieren; Dashboard-Doppelungen entfernen; Export eindeutig benennen. | M | Besucher finden Fightcard und Ticketweg ohne langes Suchen. Pro Medienübersicht eine Suche. Hinweise werden auf der Eventseite nur einmal ausführlich gezeigt. |
| **2 — Verlässliche Sport- und Eventdaten** | Format/Teams, Status, Kampfrolle, strukturierte Ergebnisse, Ticketweg, Dezimalwerte und Datenmigration mit Prüfregeln. | L | 1-vs-1 und 2-vs-2 funktionieren mit vollständigen und unvollständigen Teilnehmerdaten; Absage/Ergebnis ändern alle abgeleiteten Ansichten konsistent; bestehende Inhalte bleiben erhalten. |
| **3 — Öffentliche Seiten verfeinern** | Kompakter Eventaufbau und Startseite; Medienbezüge; Partnerlogos; Über-uns/Kontakt; einheitliche Fehlerzustände; Portraits und geprüfte Fakten vervollständigen. | M–L + Redaktion | Mobile/Desktop-Prototypen für Event und Startseite anhand echter Inhalte abgenommen; kein leerer dekorativer Pflichtblock; jede Information hat einen Hauptort. |
| **4 — Redaktion effizient machen** | Event-Arbeitsbereich, gefilterte Aufgaben, gruppierte Formulare, direkte Einstellungen, echte Vorschau, verständliche Aktivitäten und sichere Rückkehr zur Bearbeitung. | L | Ein Redakteur kann ein Event inklusive Card prüfen und veröffentlichen, ohne Daten doppelt einzutragen. Vorschau und Veröffentlichung verwenden dieselben Darstellungsregeln. |
| **5 — Betriebs- und Qualitätsabschluss** | Kanonische URLs, Metadaten/Teilen, Domain/HTTPS sobald festgelegt, Betreibertexte, Sicherung/Wiederherstellung, Browser-/Gerätetests, Barrierefreiheit und Ladeleistung. | M–L | Links und Vorschaukarten stimmen; Wiederherstellung getestet; Tastaturbedienung und definierte Browser-/Größenmatrix bestanden. |

Redaktionelle Ergänzungen können parallel zu den Paketen laufen. Betreibertexte, Sicherung und bereits bekannte Produktionsfehler werden nicht bis zur letzten Etappe aufgeschoben, wenn sie vorher relevant sind. Erste Designarbeit nach diesem Plan: Eventseite und Startseite je mobil und auf Desktop konkret ausarbeiten, auf Basis des Zielmodells.

## 8. Qualitätsmaßstab für jede Etappe

- Breiten: 320, 360, 390, 412, 600, 768, 900, 1024, 1280, 1440 und 1920 px; zusätzlich an tatsächlichen Umbruchgrenzen und in kurzem Querformat prüfen.
- Chromium, Firefox und Safari/WebKit; ergänzend reale iOS-/Android-Geräte, soweit verfügbar. Ergebnisse getrennt dokumentieren.
- Zustände: kein nächstes Event; lange Namen; fehlendes Portrait; unbestätigter Rekord; Teamkampf; volle und leere Card; abgesagtes/verschobenes/beendetes Event; ausverkauft; Ergebnis fehlt; erfolglose Suche; Ladefehler; unveröffentlichter Inhalt.
- Bedienung: Tastatur, sichtbarer Fokus, Menü schließen und Fokus zurückgeben, ausreichende Zielgrößen, 200-%-Zoom, Textvergrößerung, Kontrast, reduzierte Bewegung. Feste Aktionsleisten dürfen nichts überdecken.
- Logik: ein Eventwechsel aktualisiert Vorschauen und Links; Entwürfe erscheinen nicht öffentlich; Änderungen verknüpfter Daten erzeugen keine widersprüchlichen Angaben; Browser-Zurück und abgelaufene Sitzung verursachen keinen stillen Verlust.
- Leistung mit aktivem Erstbesuch-Intro getrennt vom Folgebesuch messen. Keine Aussage über reale Core Web Vitals allein aus einem lokalen Test ableiten.
- Je Paket Build und relevante Tests, dann kontrollierte Veröffentlichung und Live-Prüfung gemäß bestehender Freigabe. Der vorliegende Planungsschritt veröffentlicht nichts.

## 9. Bewusst später und offene Voraussetzungen

Weiterhin später: Registrierung, Bewerbungen, Rollenportal, eigene Zahlungen, QR-Einlass, Streamingplattform, Shop, App und Mehrsprachigkeit. Rankings/Champions nur mit tatsächlich definierten sportlichen Regeln und belastbaren Daten. Newsletter erst mit Verantwortlichkeit und regelmäßigem Inhalt.

Bestehende Entscheidungen bleiben wirksam: externes Ticketing bzw. der tatsächliche Reservierungsweg; Intro zunächst behalten; finale Domain und HTTPS-Konfiguration nach Domainentscheidung. Der sichere Organisationszugang bleibt Voraussetzung.

Benötigte Inhalte: fünf fehlende Portraits, drei Partnerlogos, geprüfte sportliche Angaben, konkrete Veranstalter-/Teamvorstellung sowie bestätigte Regeln und Teilnehmer des Teamformats. Beschaffung und Freigabe sind redaktionelle Aufgaben; Gestaltung kann diese Fakten nicht ersetzen.

Dokumentation bereinigen: `PRODUCT-DECISIONS.md` beschreibt teilweise noch eine andere technische Zielarchitektur und bereits vorhandene Rollen, während der aktuelle Stand PHP/MySQL mit Organisationskonten ist. Künftige Zielideen ausdrücklich von implementierten Funktionen trennen. Dieser Plan ergänzt den Auditplan vom 16. September; er erklärt ältere offene Prüfaufgaben nicht pauschal für erledigt.

## Etappe 3 – 24.09.2026
Kompakter Event-Arbeitsbereich mit sechs Tabs umgesetzt. Kontextbezogene Fightcard-, Ergebnis- und Medienbearbeitung nutzt bestehende Datensätze. Details und Prüfumfang: `PLATTFORM-ETAPPE-3-20260924.md`.

## Etappe 4 – 24.09.2026
Sidebar und Dashboard vereinheitlicht: sieben Hauptziele, Medien-/Einstellungstabs, Fightcards im Eventkontext, kompakte Startseite mit Arbeitslisten. Siehe `PLATTFORM-ETAPPE-4-20260924.md`.
