# Öffentliche Seiten und Redaktion · 11. September 2026

## Projekt

Weiterentwicklung des vom Nutzer bestätigten IONOS-Projekts `C:\Users\PC\Documents\ST New`. Der Task-Ordner `Documents\ChatGPT\ST New` enthält lediglich ein separates Grundgerüst und wurde nicht verändert. Vorhandene, nicht eingecheckte Arbeiten bleiben erhalten.

## Inhalte und Gestaltung

- Referenz: https://smashtime-neu.vercel.app/ und die dortigen Event-/Fighterseiten, abgerufen am 11.09.2026.
- Smash Time 3 am 17.10.2026: Jahnturnhalle, St. Pölten, Einlass 17:00, Beginn 18:00, Vorverkauf 40 EUR, Abendkasse 45 EUR, Reservierungslink zum offiziellen Instagram-Account.
- Drei angekündigte Paarungen; für Issy vs Mad Dog bleibt das Regelwerk ausdrücklich offen. Rundenzahlen und genaue Reihenfolge werden nicht erfunden.
- Vier bestätigte Champion-Bilanzen, jeweils mit Quellenlink und Datenstand 30.06.2026. Fünf weitere angekündigte Athleten ohne erfundene Rekorde oder Portraits.
- Drei Partner und drei redaktionelle Stories, mit bestehenden Event- und Storybildern aus dem lokalen Referenzprojekt.
- Countdown mit Europe/Vienna-Zeitzone, Sommer-/Winterzeit, abgelaufenen und abgesagten Veranstaltungen.
- Ticketinformationen, Rahmenprogramm, Fighter-Bilanzen auf Karten und Profilen, Partnerleiste und Stories auf der Startseite.
- Größere lesbare Beschriftungen, konsistente dunkle Oberflächen, Gold- und Rotakzente, responsive Raster.

## Dashboard

- Schnellzugriffe, nächste Veranstaltung mit Countdown, Hinweise auf fehlende Portraits und ungeprüfte Rekorde.
- Stories anlegen, bearbeiten, als Entwurf speichern und veröffentlichen.
- Inhaltsvorschau mit breiter und schmaler Darstellung direkt im Editor. Sie zeigt den aktuellen Formularstand, keine separate Veröffentlichung.
- Website-Einstellungen nach Bereichen: Startseite, Events, Athleten, Stories, Partner, Über uns, Kontakt, SEO & Footer. Titelzeilen, Einleitungen und Titelbilder der sechs öffentlichen Bereiche sind editierbar.
- Weitere Event-, Fighter-, Kontakt- und Social-Felder; Such-, Status- und Sortierfunktionen; Duplizieren und JSON-Export.
- Endgültiges Löschen nach Archivierung, mit Versionskontrolle und Schutz vor verbleibenden Verknüpfungen; Audit-Eintrag für jede Löschung.
- Referenzimport bewahrt fremde, noch unveröffentlichte Änderungen. Privater Daten-Snapshot vor Import und Webroot-Backup vor Upload.

## Verifikation

- ESLint und Produktionsbuild erfolgreich, 48 exportierte Routen.
- 305 Produktionsdateien auf private Dateinamen und Verzeichnisse geprüft.
- Referenzbilder vollständig lokal vorhanden.
- PHP-Syntax von API, Metadaten-Ausgabe und Import erfolgreich.
- Separate `st_review_`-Tabellen auf IONOS, eigener temporärer Testaccount und nur über SSH erreichbare Test-API. Keine Testveröffentlichung in den Produktionstabellen.
- Testfälle: Sommer-/Winterzeit, Zeitumstellungslücke, ungültiges Datum, vergangene/abgesagte Events, Login/Logout, CSRF, Story-CRUD, Entwurfsisolation, Versionskonflikte, Archivierungs-/Löschschutz, Website-Felder, ungültige URLs, echte WebP-Verarbeitung und Audit.
- Zusätzlicher Importtest: eine nicht veröffentlichte Seitentiteländerung bleibt im Entwurf und wird nicht versehentlich publiziert.
- Keine neue interaktive Browserprüfung durchgeführt; visuelle Darstellung wurde in diesem Durchlauf nicht per Screenshot abgenommen. Die Vorschau wurde nach erfolgreichem HTTP-Aufruf geöffnet.
- Veröffentlichung abgeschlossen: 305 Dateien auf IONOS, anschließend 21 Referenzdatensätze/Settings übernommen. Die öffentliche API liefert 25 veröffentlichte Datensätze. 14 Live-Routen, alle referenzierten Bilder, individuelle Event-/Storytitel, Sitemap, HTTPS-Login-Sperre, Schutz privater Dateien und 404 für fehlende Stories erfolgreich nachgeprüft.

## Verbleibende Einschränkungen

- Der HTTPS-Endpunkt `s1110988816.online.de` bricht weiterhin den TLS-Handshake mit einem internen TLS-Fehler ab. Sicherer öffentlicher Admin-Login benötigt die Reparatur/Aktivierung des IONOS-Zertifikats. Kein Datenbank- oder SSH-Zugang fehlt.
- Für die fünf neu ergänzten Fighter liegen in der Referenz keine verwendbaren Portraits vor. Die Website zeigt dafür einen neutralen Platzhalter; echte Bilder können hochgeladen werden.
- Die neuen CMS-Funktionen erweitern die bestehende Organisationsverwaltung. Eigene Zahlungsabwicklung, Teilnehmerkonten, Ticket-Check-in, Rollenverwaltung und Livestream-Infrastruktur sind damit nicht implementiert.
- Der Quellenimport ist ein bewusst ausführbarer CLI-Schritt, keine regelmäßige Synchronisierung mit Vercel.

## Reproduzierbare Prüfungen

`npm run lint`, `npm run build`, `node scripts/stage-review.mjs`, privater Testserver/Tunnel, anschließend `node scripts/test-expansion.mjs`. Die lokalen Test-Anmeldedaten gehören ausschließlich nach `backend/review.local.json` und sind ignoriert. Staging-Tabellen und Testaccount werden nach Abschluss bereinigt.
