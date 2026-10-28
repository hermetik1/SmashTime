# SmashTime · Produktentscheidungen für den ersten Release

## Festgelegt

- Sprache: Deutsch
- Währung: EUR
- Zeitzone: `Europe/Vienna`
- Öffentliche Kämpferprofile: erst nach Prüfung und Freigabe
- Bewerbungen: manuelle Prüfung durch Admin oder Matchmaker
- Disziplinen: frei über das Admin-System anlegbar, nicht im Code fest verdrahtet
- Ticketing: externer Anbieter; SmashTime speichert zunächst nur eine optionale externe Ticket-URL
- Rollen: Superadmin, Admin, Matchmaker, Editor, Event-Staff, Kämpfer:in

## Erster vertikaler Produktablauf

1. Admin erstellt ein Event.
2. Eine Kämpferin oder ein Kämpfer registriert sich und beantragt die Teilnahme.
3. Admin oder Matchmaker prüft das Profil und die Bewerbung.
4. Matchmaker erstellt die Paarung und ordnet Disziplin und Gewichtsklasse zu.
5. Die Fightcard wird als Entwurf gespeichert und veröffentlicht.
6. Die veröffentlichte Fightcard erscheint auf der öffentlichen Eventseite.

## Bewusst später

- eigene Ticketbestellungen, Zahlungen, QR-Tickets und Check-in
- automatische Vorprüfung von Bewerbungen
- Livestream- und Social-Feed-Integrationen
- Mehrsprachigkeit
- Zwei-Faktor-Authentifizierung

## Sicherheitsleitplanken

- Secrets bleiben in lokalen oder Deployment-Umgebungsvariablen.
- Autorisierung erfolgt serverseitig und zusätzlich über Postgres Row-Level Security.
- Private Kämpferdaten werden nicht in öffentlichen Queries verwendet.
- Kritische Mutationen schreiben einen Audit-Eintrag.
