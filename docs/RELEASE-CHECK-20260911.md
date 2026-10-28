# Release-Prüfung · 11.09.2026

- Production Build / TypeScript und ESLint erfolgreich. 46 Seiten exportiert.
- 289 Produktionsdateien geprüft: keine Zugangsdaten, .env, .git oder node_modules im Export.
- PHP 8.3 und MariaDB: Syntax, Schema, Verbindung und Admin-Konto geprüft.
- Browser: Anmeldung mit dem vorgesehenen Konto, Dashboard, Sitzung nach Neuladen, Entwurf anlegen, suchen und erneut öffnen erfolgreich.
- Header zeigt nach Anmeldung „Mein Konto“ mit Dashboard-Link und Kontomenü.
- Smartphone 390 × 844: öffentliche Seiten und sämtliche Dashboard-Bereiche ohne horizontalen Seitenüberlauf.
- Athletensuche und korrektes Profil erfolgreich. Temporäres Event mit eigener Fightcard im Browser geprüft.
- API: CSRF, anonymer Zugriff, Login/Logout, Speicherung, Veröffentlichung, Entwurfsisolation, veraltete Versionen, doppelte Slugs, Archivierung, Eventdatum, Selbstpaarung, doppelte Position, Bildprüfung, WebP-Upload und Audit erfolgreich.
- Identifizierte Testdaten und Testupload danach entfernt.
- Bisheriger Webroot vor Upload privat gesichert.

## Offen: öffentliches HTTPS

Der TLS-Verbindungsaufbau für `s1110988816.online.de` schlägt fehl. Der öffentliche Admin-Bereich erlaubt keine Passworteingabe über HTTP. Die erfolgreichen Login- und Funktionstests erfolgten über einen verschlüsselten SSH-Tunnel und eine lokale Browser-Vorschau. Nach SSL-Aktivierung muss der Login zusätzlich direkt auf der HTTPS-Domain geprüft werden.

## Redaktion

Die vier vorhandenen Athletenportraits bleiben öffentlich. Unverifizierte Rekorde erscheinen nicht als Null-Siege-Rekorde. Frühere Beispielveranstaltungen bleiben Entwürfe. Echte Biografien, Partner und Videos sind über das Dashboard ergänzbar.

## Live-Nachprüfung
Alle öffentlichen Routen, Athleten-Detailseite, Sitemap und Public-API antworten mit HTTP 200. Individueller Seitentitel und Canonical für Tanyo Tanev geprüft. Live-Startseite, Profil und Login-Link zusätzlich im integrierten Browser geprüft. HTTP-Session-Anfragen werden mit 426 abgewiesen; .env mit 403, private Backend-Pfade mit 404. Upload abgeschlossen: 289 Dateien. PHP-Syntax der produktiven Dateien erfolgreich.

