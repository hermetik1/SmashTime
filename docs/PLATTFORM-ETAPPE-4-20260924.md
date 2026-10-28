# Etappe 4 – Navigation und Dashboard, 24.09.2026

Die Sidebar enthält Übersicht, Events, Athleten, Medien, Partner, Einstellungen und Aktivitäten. Fightcards werden ausschließlich im Event-Arbeitsbereich verwaltet. Alte Fightcard-Links bleiben als Weiterleitung erhalten; ein Link zu einem bestehenden Kampf öffnet dessen Editor im zugehörigen Event.

Stories und Videos besitzen gemeinsame Navigation und einen Eventfilter. Website, Disziplinen und Konto sind durch Einstellungstabs verbunden. Auch Unterseiten markieren den übergeordneten Sidebar-Eintrag korrekt.

Die Startseite verwendet eine kompakte Eventzeile statt eines großen Countdowns. Arbeitslisten bieten Offene Aufgaben (Portrait-/Rekordprüfung), Entwürfe und Zuletzt bearbeitet, mit Pagination. Hinweise zum selben Athleten sind zusammengefasst. Links zu Eventmedien und Kämpfen öffnen deren Eventkontext. Große Bestandszahlen und parallele Schnellzugriffsblöcke wurden entfernt.

Keine Änderung an Datenmodell oder API. Bestehende Bearbeitung, Validierung und Veröffentlichung werden weiterverwendet. Aufgaben umfassen derzeit die konkret verfügbaren Portrait- und Rekordprüfungen; eine umfassende automatische Event-Freigabeprüfung ist damit nicht eingeführt.

## Prüfung
Produktionsbuild mit 48 Routen und gezieltes ESLint erfolgreich. 60 vollständig geladene Seitenansichten (sechs Seiten auf zehn Breiten von 320 bis 1920 px) ohne Seitenüberlauf; genau ein aktiver Sidebar-Eintrag. Mobile Navigation inkl. Escape, Arbeitslistenumschaltung, Medienfilter, Weiterleitung des alten Fightcard-Einstiegs und Schutz ungespeicherter Eingaben geprüft. Desktop- und Mobil-Screenshots visuell kontrolliert. Keine Redaktionsdaten verändert.

## Veröffentlichung
246 geänderte Produktionsdateien hochgeladen und anschließend vollständig über HTTP per SHA-256 mit dem geprüften Export abgeglichen. Bestehende Serverdateien vorher gesichert. API, Medien und private Konfiguration nicht verändert.
