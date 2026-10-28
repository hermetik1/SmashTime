# Social-Media-Quellenarchiv

Der Ordner enthält den öffentlichen Instagram-Snapshot vom **16.09.2026** für:

- [@smash_time_international](https://www.instagram.com/smash_time_international/)
- [@smash_time_borderland](https://www.instagram.com/smash_time_borderland/)

Die strukturierte Datei [instagram-source-20260916.json](./instagram-source-20260916.json) verbindet beobachtete Profilinformationen, Beitrags-URLs, lokale Vorschaubilder und redaktionelle Prüfstatus. Die zugehörigen Rasterbilder liegen unter `public/assets/social/instagram/` und sind damit im Projekt versioniert und später für CMS, Website-Module oder Kampagnen wiederverwendbar.

Der Bestand ist ein nachvollziehbarer Quellenstand, kein vollständiger Instagram-Export. Er enthält die beim Abruf öffentlich sichtbaren Profilelemente und Beiträge. Reels sind als sichtbare Vorschaubilder archiviert; Videodateien und nicht sichtbare ältere Beiträge wurden nicht automatisch übernommen.

## Redaktionsregeln

- `source_only`: direkt beobachtete Quelle, noch nicht als veröffentlichter Website-Text freigegeben.
- `needs_editorial_review`: Veranstaltungs- oder Regelangabe, die vor Veröffentlichung bestätigt werden muss.
- `mappingConfidence: observed_order`: Zuordnung von lokalem Vorschaubild und Beitrag anhand der beim Abruf beobachteten Reihenfolge.

Vor einer öffentlichen Verwendung müssen Termin, Veranstaltungsort, Ticketpreis, Einlass-/Startzeit, Regeln und Schreibweise geprüft werden. Für Personen- und Veranstaltungsbilder ist zusätzlich die konkrete Nutzungsberechtigung für Website, Werbung und Druck zu klären. Die Daten wurden deshalb bewusst nicht automatisch in bestehende CMS-Einträge oder öffentliche Seiten geschrieben.
