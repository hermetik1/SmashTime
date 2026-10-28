# Lokale Umsetzung nach Browseraudit

## Vereinbarte Reihenfolge

Domain/TLS wird auf Wunsch des Betreibers bis zur abschließenden Veröffentlichung zurückgestellt. Keine Domainregistrierung, kein öffentlicher Tunnel und kein Deployment in dieser Runde.

## Änderungen

- Browser-Zurück/Vorwärts wird in Browsern mit unterstützter Navigation API durch den Speichern-/Verwerfen-Dialog geschützt. Zusätzlich werden Eventeingaben bei einem internen Seitenwechsel im Arbeitsspeicher gehalten und beim erneuten Öffnen desselben Editors wiederhergestellt. Ein Hinweis kennzeichnet sie ausdrücklich als ungespeichert. Speichern oder bewusstes Verwerfen entfernt diese Wiederherstellung; Abmelden leert sie ebenfalls. Neuladen und Schließen bleiben durch eine Browserwarnung geschützt. Dies ist keine automatische Speicherung im Backend. Der Wechsel aus einer offenen Neuanlage zu einem bestehenden Event nutzt denselben Schutz.
- Kampflisten und Ergebniseditor zeigen die Teilnehmernamen beider Ecken, auch bei Teams. Die Ergebnisauswahl enthält dieselben Namen, während gespeicherte Werte unverändert bleiben.
- Neues Event beginnt mit Name und Datum und führt nach Speicherung in den Eventarbeitsbereich.
- Eventeditor nennt fehlende Angaben vor Veröffentlichung, ohne frühe Ankündigungen pauschal zu verbieten.
- Einzahl und Mehrzahl in öffentlichen Listen korrigiert; leere gefilterte Listen bieten „Filter zurücksetzen“.
- Platzhalterdisziplinen mit „folgt“ oder „angekündigt“ werden nicht als reguläre öffentliche Filter angeboten. Bestehende Zuordnungen werden nicht verändert.
- Vergangene bzw. abgesagte Events zeigen keinen zusätzlichen Countdownhinweis neben dem Ticketstatus. Fehlende Ergebnisse werden ausdrücklich als ausstehend bezeichnet.
- Kontaktinformationen auf die vom Betreiber gelieferten Daten umgestellt.
- Impressum und Datenschutzhinweise mit Footerlinks lokal vorbereitet; beide Seiten bleiben sichtbar als Entwurf markiert und von Suchindexierung ausgeschlossen.

## Noch benötigte Angaben

Geliefert: Michele Ott e.U., Josefstraße 75, 3100 St. Pölten, Österreich; Werbeagentur; GISA 37416874; Kontakt ottcastpodcast@gmail.com; Datenschutzkontakt Willi Ott.

Noch ungeklärt: Firmenbuchnummer, tatsächliches Firmenbuchgericht, zuständige Gewerbebehörde. Die wiederholt genannte Angabe „Firmenbuchgericht: Magistrat der Stadt St. Pölten“ wird nicht als Gericht übernommen. GISA-Zahl und Firmenbuchnummer sind unterschiedliche Kennungen.

Datenschutz: konkrete Hosting-Vertragsgesellschaft, Auftragsverarbeitung, Löschfristen sowie Grundlagen/Freigaben für Athleten- und Medieninhalte prüfen. Keine rechtsverbindliche Freigabe durch diesen technischen Umsetzungsschritt.

Echte Ergebnisse, überarbeitete Veranstaltungstexte und fehlende Portraits/Profildaten bleiben redaktionelle Aufgaben; sie werden nicht erfunden.

## Quellen für die Entwürfe

- [WKO: Informationspflichten nach UGB](https://www.wko.at/internetrecht/impressumsvorschriften-fuer-e-mails-und-websites-nach-ugb)
- [Österreichische Datenschutzbehörde: Betroffenenrechte](https://dsb.gv.at/rechte-pflichten/ihre-rechte-als-betroffene-person)
- [IONOS: Hinweise zu Logdateien](https://www.ionos.de/hilfe/index.php?id=2790)

Weitere offene Freigabeprüfungen stehen im [Audit](BETRIEBSSTART-AUDIT-20261020.md). Die ursprüngliche Testabdeckung ist kein automatischer Nachweis für nachträgliche Änderungen.

## Verifikation dieser Änderungen

- Produktionsbuild einschließlich TypeScript erfolgreich; ESLint für die geänderten Komponenten erfolgreich.
- 48 zusätzliche Layoutprüfungen: sechs öffentliche Ansichten, Ergebniseditor und Eventneuanlage jeweils bei 320, 390, 768, 1024, 1440 und 1920 px. Kein horizontaler Dokumentüberlauf. Nachweise: `artifacts/readiness-20261020/fix-responsive.json`.
- Browser-Zurück: Dialog erscheint, Abbrechen erhält den Wert, Verwerfen navigiert zurück, Speichern als Entwurf navigiert danach zurück.
- Neuanlage: Wechsel zu anderem Event zeigt Warnung; Abbrechen erhält eingegebenen Namen.
- Veröffentlichung/Entwurf anhand der sichtbaren Beschreibung im isolierten Reviewbestand geprüft: veröffentlichter Text bleibt unverändert, neuer Entwurf erscheint nicht öffentlich.
- Testevent anschließend wieder archiviert; öffentliche Detailseite zeigt Nichtverfügbarkeit.
- Suche: ein Treffer zeigt „1 Athlet“; „Filter zurücksetzen“ leert den Suchbegriff und stellt die Liste wieder her.
- Ergebnisliste, Editor und Auswahl zeigen Namen; mobile und Desktopansichten als Screenshots gesichert.

Keine Behauptung einer Prüfung auf physischen Geräten oder älteren Safari-/Firefox-Versionen. Domain/TLS und rechtliche/redaktionelle Freigaben bleiben vor Betriebsstart erforderlich.
