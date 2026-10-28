# Plattform – Teamkämpfe, Ergebnisse und Hero

Stand: 24. September 2026. Fortsetzung des [Gesamtplans](PLATTFORM-VERGLEICH-UND-PLAN-20260923.md).

## Lokaler Betrieb

- Website: http://localhost:3089/
- Dashboard: http://localhost:3089/admin/
- Der Produktionsexport wird lokal angezeigt; die API ist über einen SSH-Tunnel an die bestehende, getrennte Review-Umgebung angeschlossen. Die Datenbank läuft dabei nicht auf diesem PC. Änderungen im lokalen Dashboard betreffen die Testdaten.
- Die gestarteten Dienste bleiben für die weitere Arbeit verfügbar. Neue Quellcodeänderungen werden nach einem erneuten Build im lokalen Export sichtbar.

## Umgesetzt

### Hero

Der Hintergrund des Startseiten-Heros hat keine vom Scrollen abhängige Verschiebung oder Skalierung mehr. Der Hero ist aus der Kamera-Bewegung entfernt; die Arena bleibt innerhalb ihrer Sektion unverändert. Die eigenständige Wortmarke bewegt sich weiterhin in ihren Platz im Header. Andere Seitenabschnitte behalten ihr bisheriges Verhalten.

### Sportmodell und Redaktion

- Kampfformat: 1 gegen 1 oder 2 gegen 2. Für Teams gibt es einen zweiten Athleten je Ecke. Noch unbekannte zweite Teilnehmer werden als angekündigt ausstehend dargestellt; bestätigte Teamergebnisse benötigen alle vier Personen.
- Programmrolle: Hauptkampf, Co-Hauptkampf, Hauptprogramm oder Vorkämpfe. Bestehende Hauptkämpfe behalten ihre Hervorhebung über den bisherigen Namen, solange keine Rolle gewählt ist.
- Kampfstatus: geplant, abgeschlossen oder abgesagt. Dieser Status ist unabhängig vom redaktionellen Entwurf/Veröffentlichungsstatus.
- Strukturierte Ergebnisse: Siegerseite, Unentschieden oder No Contest; Entscheidung, Runde, Zeit und ausdrückliche Bestätigung.
- Änderungen an Teilnehmern, Regeln, Status oder Ergebnisangaben nehmen die Ergebnisbestätigung im Editor zurück. Unbestätigte Ergebnisse können als Entwurf gespeichert werden; ihre Veröffentlichung wird auch im Backend abgewiesen.
- Bestehende Ergebnistexte bleiben erhalten. Ohne neue strukturierte Angaben werden sie weiter angezeigt. Es werden keine bisherigen Ergebnisse automatisch interpretiert oder Karriere-Rekorde daraus berechnet.
- Preise und Kampfgewicht erlauben nun bis zu zwei Nachkommastellen, in Formular und Backend. Siege, Runden und Positionen bleiben ganze Zahlen.

### Öffentliche Darstellung

- Gemeinsame Fightcard zeigt alle vier Teammitglieder mit eigenen Profilverweisen und einheitlichem Ergebnistext.
- Teamkämpfe sind in den Profilen aller zugeordneten Athleten sichtbar. Gegner und Teamkollege sind verlinkt; abgesagte Paarungen stehen getrennt von anstehenden Kämpfen.
- Die Fightcard-Vorschau im Editor verwendet dieselbe Komponente wie die Website und berücksichtigt die verfügbare Breite.
- Die Reihenfolgeansicht nennt beide Teammitglieder je Ecke.

### Datenintegrität

- Jeder Athlet darf innerhalb einer Paarung nur einmal vorkommen, auch über beide Ecken hinweg.
- Alle zugeordneten Teilnehmer müssen vor einer Kampfveröffentlichung selbst veröffentlicht sein. Referenzen auf zweite Teammitglieder werden bei Archivieren und Löschen ebenfalls geprüft.
- Ergebnisrunde und -zeit werden gegen die angesetzten Runden und Minuten geprüft. Abgesagte Kämpfe dürfen kein Ergebnis erhalten.
- Keine Änderung des Datenbankschemas notwendig: zusätzliche Felder werden in den bestehenden versionierten Inhaltsdatensätzen gespeichert. Vorhandene Datensätze müssen nicht umgeschrieben werden.

## Prüfung

- Produktionsbuild einschließlich TypeScript und gezieltes ESLint erfolgreich.
- 31 Client-/API-Prüfungen einschließlich ungültiger Paarungen, Referenzschutz, Dezimalwerten, Bestätigung und Entwurfstrennung. Nur temporäre Review-Datensätze verwendet; sämtliche erzeugten Datensätze entfernt und ursprüngliche Inhalte abgeglichen.
- Bestehende Veröffentlichungstests bestanden: öffentliche Slugs, konkurrierende Bearbeitung, Entwurfsreferenzen und atomare Fightcard-Reihenfolge.
- 322 öffentliche Seiten-/Größenkombinationen im Review-Bestand: 23 Seiten bei 14 Breiten von 320 bis 1920 px. Keine horizontalen Überläufe, abgeschnittenen geprüften Texte, defekten geladenen Bilder oder JavaScript-Seitenfehler.
- Team-Fightcard und Profil bei zehn Breiten, Team-Editor bei vier Breiten; schmale Vorschau separat geprüft. Testdaten dafür ausschließlich im Browser simuliert.
- Hero bei 320, 390, 768, 1440 und 1920 px an jeweils drei Scrollpositionen geprüft: unveränderter Hintergrund und Wortmarke am Headerziel. Diese Prüfung wird nach Veröffentlichung auch live wiederholt.
- Chromium mit simulierten Viewports; keine physische Geräte- oder vollständige Safari-/Firefox-Prüfung behauptet.

## Veröffentlichung

243 geänderte Produktionsdateien einschließlich API wurden nach vorheriger Sicherung veröffentlicht. Alle 243 Dateien wurden anschließend gegen den getesteten Export abgeglichen; der API-Quelltext über die geschützte Serververbindung, die öffentlichen Dateien über HTTP. Die Hero-Prüfung mit fünf Breiten und drei Scrollpositionen pro Breite wurde auf der Live-Website erfolgreich wiederholt. Frontend, Dashboard und Test-API auf localhost antworten weiterhin.

Nachweise: `artifacts/platform-stage2-20260924/` mit Browserbildern, API-Ergebnissen, Größenprüfung und Veröffentlichungsmanifest. Die Beispielpaarungen auf den Testbildern sind keine sportlichen Ankündigungen.

## Noch offen im Gesamtplan

Der vollständige Event-Arbeitsbereich, Event-/Ticketstatus, weitere Startseitenstraffung, Medienzuordnungen, Metadaten, Betreibertexte und die übrigen Betriebsprüfungen bleiben offen. Fotos, Logos und tatsächlich bestätigte Teamaufstellungen benötigen redaktionelle Daten. Diese Änderung stellt die Erfassung und Darstellung bereit; sie ergänzt keine unbekannten sportlichen Angaben.
