# Mobiler Logo-Übergang – 16. September 2026

## Ursache und Korrektur

Der mobile Sonderfall in `BrandHandoff` verwendete unabhängig vom Scrollfortschritt immer die aktuelle Hero-Position und Originalbreite. Dadurch wanderte das Logo bei 390 px Breite nach einer Bildschirmhöhe Scrollen auf y = −632 px, während sein Headerplatz bei y = 24 px lag.

Jetzt interpoliert dasselbe Logo auch mobil Position und Größe bis zum Headerplatz. Der Übergang endet, wenn der ursprüngliche Hero-Anker den Header erreicht. Bei reduzierter Bewegung erfolgt die Übergabe ohne Größenanimation. Die Menüregel platziert weiterhin dasselbe Element direkt im Header; das Hero-Ersatzbild bleibt verborgen. Auf Unterseiten wird das Logo nicht länger generell ausgeblendet.

Geänderte Produktdateien: `components/hero-orbit.tsx`, `app/film.css`.

## Prüfung

- Fehler vor der Änderung im Browser bei 390 × 844 px reproduziert.
- Headerposition bei 320, 390, 760, 761 und 1440 px geprüft: Logo und Zielplatz stimmen überein, Hero-Ersatzbild verborgen.
- Mobil: Zwischenstand bei 101 px Scrollen, vollständige Übergabe bei 354 px, tiefes Scrollen und Zurückscrollen geprüft.
- Menü über dem Hero und nach dem Scrollen geöffnet/geschlossen: genau ein Logo im oberen Bereich.
- Reduzierte Bewegung geprüft: Logo bei 253 px Scrollen korrekt im Header.
- Kontaktseite: Logo bei geschlossenem und geöffnetem Menü sichtbar; genau ein Header-Logobild.
- Lint und Produktionsbuild einschließlich TypeScript bestanden. Browserprüfungen auch gegen den fertigen Export durchgeführt.
- Nachweise: `artifacts/logo-mobile-20260916/checks.json`, `header.png`, `menu.png`.
- Produktionsupload erfolgreich (311 Exportdateien). Anschließend live bei 390 × 844 px geprüft: nach 844 px Scrollen Logo bei x = 20, y = 24, Breite = 135 px; im geöffneten Menü weiterhin genau ein sichtbares Headerlogo und verborgenes Hero-Ersatzbild. Screenshot: `artifacts/logo-mobile-20260916/live-menu.png`.

Die Prüfung verwendet Chromium-Viewport-Emulation; echte iOS-/Android-Geräte und Safari wurden für diese Änderung nicht geprüft. Die übrigen Befunde des umfassenden Audits bleiben bestehen.
