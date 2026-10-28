# Fightcard – 17. September 2026

## Referenzen und Umsetzung

Offizielle UFC-Eventseite (https://www.ufc.com/event/cryptocom-ufc-331) und OKTAGON 91 (https://oktagonmma.com/en/events/134/) im Browser auf Desktop und Mobil angesehen. Übernommen wurden gegenübergestellte Athleten, Bilder an den Außenkanten, ein zentraler Vergleich und klar erkennbare Kampf-Metadaten. Keine fremden Bilder, Logos oder Statistiken übernommen.

Die gemeinsame Komponente `components/public-fightcard.tsx` wird auf der Startseite, Eventdetails und Athletenprofilen verwendet. Desktop: Bilder außen, Namen und Informationen innen. Mobil bis 480 px: Bilder außen, Namen und VS vertikal in der Mitte. Tablets zeigen die Namen unter den Bildern. Hauptkämpfe erhalten einen goldenen Rahmen und auf großen Bildschirmen größere Bilder. Das vorhandene rote VS bleibt unverändert.

Nur veröffentlichte Athleteninformationen und ausdrücklich bestätigte Rekorde werden gezeigt. Fehlende Bilder erhalten Initialen; fehlende Athleten werden angekündigt, ohne leere Profillinks. Titelkampf, Gewichtsklasse, Runden und Ergebnis erscheinen nur gemäß vorhandenen Daten. Die veröffentlichte Smash Time 3 Fightcard enthält derzeit ein Foto bei sechs Athleten.

Die Startseite verlinkt auf die vollständige Fightcard. Der Anker wird nach dem asynchronen Laden des Events angesprungen, sodass Direktlinks und die Navigation von der Startseite bei der Fightcard landen.

## Prüfung

- Produktionsbuild inklusive TypeScript erfolgreich; gezieltes ESLint erfolgreich.
- Event-Fightcard mit echten öffentlichen Daten bei 320, 375, 390, 412, 600, 768, 800, 900, 1024, 1440 und 1920 px: drei Paarungen, keine Überläufe, keine JavaScript-Seitenfehler, Bilder geladen.
- Weitere zwölf Zustände: Startseite, Athletenprofil sowie ausschließlich im Testbrowser ergänzte Titelkampf-/Ergebnis-/Rekorddaten bei 320, 390, 768 und 1440 px.
- Profillinks per Tastatur und Link von der Startseite einschließlich Ankerposition geprüft.
- Screenshots für Mobil, Tablet und Desktop visuell überprüft. Chromium mit simulierten Bildschirmgrößen, keine Behauptung über Tests auf physischen Geräten.
- Artefakte und Prüfskripte unter `artifacts/fightcard-comparison-20260917/`. Testdaten wurden nicht im CMS gespeichert.

Deployment: Nur geänderte Dateien des geprüften Produktionsexports, bestehende Versionen vorher gesichert. Serverseitige API, Uploads und private Konfiguration bleiben unverändert. `manifest.json` und `live-verified.json` dokumentieren Umfang und anschließenden Bytevergleich.
