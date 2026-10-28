# SmashTime · IONOS Production

## Verbindlicher lokaler Projektstand
- Dieses Verzeichnis ist der einzige kanonische SmashTime-Projektstand: `C:\Users\PC\Documents\ST New`.
- Die öffentliche lokale Vorschau ist immer `http://localhost:3089/`.
- `npm run dev` startet Next.js auf Port 3089; `npm run build` erzeugt `out/`; `npm run preview` serviert genau diesen Produktionsstand ebenfalls auf Port 3089.
- Das separate Verzeichnis `C:\Users\PC\Documents\ChatGPT\ST New\smashtime` ist nur ein versehentlich angelegtes Next.js-Starterprojekt und darf nicht für SmashTime-Tests oder Deployments verwendet werden.

## Aktueller Prüfstand
- [Betriebsstart-Audit und konkreter Umsetzungsplan vom 20.10.2026](docs/BETRIEBSSTART-AUDIT-20261020.md).
- [Dokumentationsübersicht](docs/README.md); Prüfbelege liegen unter `artifacts/readiness-20261020/`.
- Die lokale Vorschau verwendet beim Review ein isoliertes PHP-Backend über SSH. Das bedeutet nicht, dass die Review-Datenbank lokal läuft.

## Architektur
- Next.js 16 / React 19 / TypeScript. Lokaler `npm run build` erzeugt den statischen Export `out/`.
- IONOS führt PHP 8.3 mit PDO MySQL, Sessions und GD aus. Keine Node-Runtime auf dem Webspace erforderlich.
- MariaDB speichert redaktionelle Entwürfe, getrennte Veröffentlichungen, Admin-Konten und ein Änderungsprotokoll.
- Die API liegt unter `/api/index.php`; die produktive Autorisierung erfolgt in PHP. Die alten Supabase-Dateien sind ungenutzte Vorarbeiten und dürfen nicht als MariaDB-Migration ausgeführt werden.

## Konfiguration
- `.env.local`: `NEXT_PUBLIC_CMS_API=ionos` aktiviert das echte Backend im Frontend.
- `/home/www/.smashtime.env`: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD. Privat außerhalb von `/home/www/public`, Dateimodus 600.
- `/home/www/smashtime-private/bootstrap.php`: private Datenbankverbindung.
- `backend/schema.sql`: idempotentes Ausgangsschema mit `st_`-Tabellen; keine bestehenden Tabellen werden gelöscht.
- `backend/setup.php`: ausschließlich CLI, initialisiert Tabellen und legt ein bisher nicht vorhandenes Admin-Konto mit `password_hash()` an. Bestehende Konten und Inhalte bleiben erhalten.
- Lokale Deployment-Verbindung in `ionos-deploy.local.json`. Private Schlüssel und `.env` sind ausgeschlossen.

## Abläufe
- Adminnavigation: Überblick, Events, Athleten, Medien, Partner, Einstellungen und Aktivitäten. Fightcard, Ergebnisse, Besuchsinformationen, Eventmedien und Vorschau liegen gemeinsam im Eventarbeitsbereich. Konto und Passwortänderung sind separat erreichbar.
- Entwurf speichern verändert die öffentliche Fassung nicht. Veröffentlichung übernimmt den geprüften Stand; Archivierung entfernt ihn aus der öffentlichen Ansicht, sofern er nicht mehr referenziert wird.
- Konflikte bei paralleler Bearbeitung werden durch Versionsvergleich zurückgewiesen.
- Neue Detailseiten funktionieren ohne erneuten Frontend-Build über `/fighters/detail/?slug=…` und `/events/detail/?slug=…`.
- Bild-Uploads: JPG, PNG, WebP, maximal 5 MB / 24 MP. PHP decodiert und re-encodiert zu WebP, entfernt Metadaten und begrenzt die Größe.
- Ein eventuelles Ticketing bleibt ein externer Link. Videos öffnen den externen Anbieter erst nach einem Klick.
- Die vier bereits verwendeten Athletenportraits sind öffentlich; sportliche Daten werden erst nach Erfassung und Prüfung angezeigt. Alte Beispielveranstaltungen sind Entwürfe.

## Prüfungen und Deployment
1. `npm run lint` und `npm run build`.
2. PHP-Syntaxprüfung auf IONOS. API- und Browsertests über einen nur lokal gebundenen PHP-Testserver und verschlüsselten SSH-Tunnel.
3. Nur `out/` hochladen. Private Backend-Dateien werden separat außerhalb des Webroots installiert. Uploads und andere fremde Serverdateien nicht entfernen.
4. HTTP-Routen, PHP-API, Sitemap, Metadata, Secret-Zugriff und Logs prüfen.

Vercel stellt den Branch `preview` als separate Vorschau bereit; `main` bleibt der Quellstand für IONOS. Die Vercel-Vorschau ist absichtlich nicht mit dem produktiven IONOS-CMS verbunden, damit Teständerungen keine Live-Inhalte verändern. Admin- und API-Abläufe benötigen ein separates Staging-Backend.

Die Admin-Sitzung verwendet HttpOnly-, Secure- und SameSite=Strict-Cookies. Schreibzugriffe benötigen ein CSRF-Token. Login-Versuche sind begrenzt; Passwörter werden nicht im Frontend gespeichert. Der öffentliche Organisationsbereich verlangt HTTPS. Solange das SSL-Zertifikat für die Domain nicht funktioniert, bleibt dort die Passworteingabe gesperrt.

Prüfskripte: `scripts/test-api.mjs`, `scripts/test-content-flow.mjs`. Sie verwenden eine ausdrücklich lokale, ignorierte Test-Anmeldedatei und eine SSH-Weiterleitung; niemals öffentlich bereitstellen.

