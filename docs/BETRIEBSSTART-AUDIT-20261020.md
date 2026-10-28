# Betriebsstart: Browseraudit und Umsetzungsplan

Stand: 20. Oktober 2026. Ergebnis: noch nicht für den Betriebsstart freigeben.

## Umgebung und Umfang

Geprüft wurde die lokale Produktionsvorschau auf `http://localhost:3089/`, einschließlich Adminbereich. Die Vorschau nutzt das isolierte PHP-Review-Backend über einen SSH-Tunnel; die Datenbank läuft dabei nicht auf dem lokalen Rechner. Die Produktionsdaten wurden bei den Schreibtests nicht verändert. Kein Deployment in diesem Audit.

Gespeicherte Nachweise: `artifacts/readiness-20261020/`. Die JSON-Dateien enthalten Seitenzustände und Messungen; PNG-Dateien dokumentieren ausgewählte Ansichten.

155 responsive Messungen ohne festgestellten horizontalen Dokumentüberlauf:

| Bereich | Abdeckung |
|---|---|
| 17 Hauptseiten und 16 verlinkte Detailseiten | 320 px |
| 7 öffentliche Hauptseiten | 360, 390, 768, 1024, 1440, 1920 px |
| 10 Adminseiten | 390, 768, 1024, 1440, 1920 px |
| 6 Eventtabs | 320, 390, 768, 1024, 1440 px |

Das sind Layoutmessungen mit ergänzenden visuellen Kontrollen, keine 155 vollständigen manuellen Funktionsabnahmen. Die Detailseiten wurden nicht einzeln bei jeder Breite getestet.

## Bestätigte Befunde und Reihenfolge

| Priorität | Befund | Konkrete Umsetzung | Abnahme |
|---|---|---|---|
| P0 | HTTPS auf `s1110988816.online.de` scheitert im Browser mit `ERR_SSL_PROTOCOL_ERROR`; HTTP-Admin sperrt korrekt die Anmeldung. | Finale Domain und TLS bei IONOS einrichten bzw. reparieren; anschließend Weiterleitung und sichere Sitzung prüfen. | Öffentliche Seite und Admin ohne Browserwarnung per HTTPS; HTTP leitet korrekt weiter; Login und Logout funktionieren. |
| P1 | Browser-Zurück zwischen Eventtabs verliert ungespeicherte Änderungen. Der normale Tabwechsel zeigt dagegen eine Warnung. | Schutz für History-Navigation ergänzen oder Änderungen zuverlässig wiederherstellen. | Änderung → Zurück/Vorwärts/Tabwechsel/Neuladen: kein stiller Verlust; Abbrechen erhält Eingaben, bestätigtes Verwerfen funktioniert. |
| P1 | Ergebniseditor zeigt „Main Event“ und „Rote/Blaue Ecke“, aber keine eindeutigen Athletennamen am Ergebnis. | Beide Seiten mit Namen, bei Teams allen Teilnehmern, anzeigen; Ergebnisbestätigung auf dieselbe Paarung beziehen. | Jede Auswahl ist ohne Wechsel zum Fightcardtab eindeutig; bestehender Bestätigungsreset bleibt erhalten. |
| P1 | Keine sichtbaren Impressum-/Datenschutzlinks im geprüften Footer und Kontaktbereich. | Betreiberangaben und abgestimmte Datenschutztexte bereitstellen; eigene Seiten und dauerhafte Footerlinks ergänzen. | Seiten erreichbar, vollständig vom Betreiber geprüft, auch mobil lesbar. Keine erfundenen Betreiberangaben. |
| P1 | Smash Time 3 liegt am Prüftag in der Vergangenheit; Beschreibung bleibt in Zukunftsform, drei Kämpfe haben keine Ergebnisse. | Eventstatus und Texte redaktionell aktualisieren; bestätigte Ergebnisse erfassen oder den ausstehenden Status ausdrücklich zeigen. | Vergangenes Event enthält keine irreführende Ankündigung; Ergebnisse stimmen mit geprüften Veranstaltungsdaten überein. |
| P2 | Zwei Hinweise auf das abgelaufene Event im Ticketbereich. | Countdown und Ticketbereich auf eine gemeinsame Statusdarstellung abstimmen. | Genau ein klarer Hinweis; kein abgelaufener Kaufaufruf. |
| P2 | „1 Athleten“ und „1 Events“ bei einem Treffer. | Singular/Plural zentral korrekt ausgeben. | 0, 1 und mehrere Treffer sprachlich korrekt. |
| P2 | „Regelwerk folgt“ erscheint als Filteroption und auf der Fightcard. | Unvollständige Disziplinzuordnung redaktionell klären; Platzhalter nicht als reguläre Filterkategorie anbieten. | Filter enthalten sinnvolle Disziplinen; ungeklärte Daten werden transparent dargestellt. |
| P2 | Fünf der neun live sichtbaren Athleten haben kein Portrait bzw. ungeprüfte sportliche Daten. | Portraits und bestätigte Profildaten vervollständigen; einheitlichen Ersatz für fehlende Bilder beibehalten. | Keine erfundenen Rekorde; Profile haben eine konsistente Informationshierarchie. |
| P2 | Neues Event ist ein langes Formular; gespeicherte Events haben kompakte Tabs. | Erst Name/Datum anlegen, danach denselben Eventarbeitsbereich verwenden. | Neuerstellen und Bearbeiten folgen derselben kompakten Logik, auch bei 320 px. |
| P2 | Event mit Name und Datum lässt sich ohne Uhrzeit, Ort oder Bild veröffentlichen. | Vor Veröffentlichung eine verständliche Vollständigkeitsprüfung einführen; Pflichtangaben bewusst festlegen. | Fehlende Angaben werden benannt; bewusst reduzierte Ankündigungen bleiben nach festgelegter Regel möglich. |
| P3 | Leere Suchergebnisse führen hauptsächlich zur Startseite. | Aktion „Filter zurücksetzen“ direkt anbieten. | Suchzustand wird mit einer Aktion zurückgesetzt. |
| P3 | Über-uns-/Kontaktinformationen bleiben allgemein. | Verantwortliche Organisation, Ansprechmöglichkeiten und freigegebene Teamdaten ergänzen. | Besucher verstehen Veranstalter und Kontaktweg ohne Suche über mehrere Seiten. |

P0/P1 zuerst, danach P2 als zusammenhängende lokale Korrekturrunde. P3 ist abschließende redaktionelle Verbesserung.

## Funktionsprüfung

- Lokaler Login und geschützte Adminbereiche erreichbar.
- Mobile Adminnavigation öffnet und schließt; Escape schließt sie.
- Eventarbeitsbereich mit Übersicht, Besuch, Fightcard, Ergebnissen, Medien und Vorschau erreichbar.
- Normale Tabnavigation schützt ungespeicherte Änderungen; History-Navigation hat den oben dokumentierten Fehler.
- Änderung des Ergebnisses setzt die Ergebnisbestätigung zurück.
- Testevent `QA Betriebsstart 20261020` angelegt, gespeichert und veröffentlicht; öffentliche Detailseite geöffnet.
- Anschließend einen Entwurf gespeichert. Der verwendete Untertitel ist öffentlich nicht dargestellt; dieser Schritt beweist deshalb noch nicht abschließend die Trennung zwischen Entwurf und Veröffentlichung.
- Testevent archiviert. Öffentliche Detailseite zeigt danach „Noch nicht veröffentlicht“ und „Dieser Inhalt ist derzeit nicht öffentlich verfügbar“.
- Testevent bleibt wiederherstellbar im isolierten Reviewbestand. Bestehende Auditdatensätze sind keine Aussage über Produktionsdaten.

## Noch erforderliche Freigabeprüfungen

1. Nach Korrektur: Browser-Zurück, Vorwärts, Neuladen und Schließen mit ungespeicherten Eingaben prüfen.
2. Entwurf/Veröffentlichung anhand eines tatsächlich öffentlich sichtbaren Feldes vergleichen; danach Rücknahme und Archivierung erneut prüfen.
3. CRUD für Athleten, Medien und Partner, Bild-Upload einschließlich ungültiger Datei, Pflichtfelder, Duplikate und referenzierte Datensätze prüfen.
4. Zwei parallele Redakteurssitzungen, abgelaufene Sitzung, Fehlerantworten und langsame Verbindung prüfen.
5. Tastaturbedienung, Fokusreihenfolge, Dialogfokus, 200 % Zoom und relevante Kontraste gezielt abnehmen.
6. Safari/iOS und Android auf realen Geräten sowie Firefox prüfen; die bisherige Chromium-Vorschau ersetzt das nicht.
7. Externe Ticketziele, Videos und Kontaktwege kontrollieren; keine Käufe oder E-Mail-Zustellung wurden durchgeführt.
8. Produktionsbuild und vorhandene Qualitätsprüfungen nach Anwendungskorrekturen ausführen.
9. Nach freigegebenem Deployment: HTTPS, PHP-Routing, Metadaten, Sitemap, API, Uploads und Anmeldung live prüfen. Die statische lokale Vorschau bildet nicht alle Webserverregeln ab.

## Projektbereinigung

Alte `artifacts/cinema-export-*`-Exportkopien werden in einem ZIP mit SHA-256-Manifest gesammelt und erst nach Inhaltsprüfung aus den Einzelordnern entfernt. Die veraltete Wurzel-Dateiliste wird ins Archiv verschoben; der leere Ordner `smashtime` entfernt.

Bestehende Release-Sicherungen, Prüfberichte, aktuelle Exporte, Abhängigkeiten und private Konfigurationsdateien bleiben erhalten. Unversionierte Dateien gelten nicht automatisch als entbehrlich. Die ungenutzten Supabase-Vorarbeiten bleiben bis zu einer gesonderten Abhängigkeitsbereinigung bestehen.

## Nächster Umsetzungsschritt

Zunächst den Schutz ungespeicherter Eventänderungen und die eindeutige Ergebniszuordnung lokal beheben. Danach Eventstatus, doppelte Hinweise und Suchtexte korrigieren. Parallel müssen finale Domain/TLS sowie freigegebene Betreiber- und Inhaltsdaten geklärt werden. Erst nach der obigen Abnahme erfolgt die Veröffentlichung.
