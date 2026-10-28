# SmashTime · IONOS-SFTP-Deployment

## Ziel

Der öffentliche Build soll nach der Einrichtung reproduzierbar per SFTP auf IONOS hochgeladen werden können. Das Upload-Skript unterstützt den im IONOS-Webhosting üblichen Passwortzugang sowie optional einen SSH-Key. Zugangsdaten und private Schlüssel werden nicht im Repository gespeichert.

Das Upload-Skript liegt unter:

```text
scripts/deploy-ionos-sftp.ps1
```

Für diesen Rechner liegt die nicht versionierte Verbindungskonfiguration in `ionos-deploy.local.json`. Sie enthält nur Host, Benutzer, Zielpfad und den lokalen Pfad zum Schlüssel – niemals den Schlüssel selbst oder ein Passwort.

## Vor der Einrichtung klären

Bei IONOS gibt es zwei unterschiedliche Deployment-Varianten:

### IONOS-Webhosting

Hier wird normalerweise ein statischer Export in das Webverzeichnis hochgeladen. Dafür muss Next.js auf einen statischen Export konfiguriert werden. Server-Funktionen, serverseitige Authentifizierung und dynamische Backend-Funktionen laufen dort nicht wie auf einem Node-Server.

### IONOS-Server oder VPS

Hier kann die Next.js-Anwendung als Node-Prozess betrieben werden. SFTP wird dann für den Upload verwendet; zusätzlich werden auf dem Server Node.js, Umgebungsvariablen, Build und Prozessstart eingerichtet.

Die Hosting-Variante entscheidet daher, ob wir einen `out`-Ordner oder die komplette Next.js-Anwendung deployen.

## Benötigte Verbindungsdaten

Für die Einrichtung werden benötigt:

- IONOS-Produkt: Webhosting oder Server/VPS
- SFTP-Host
- SFTP-Benutzername
- SFTP-Port, normalerweise 22
- Remote-Webverzeichnis bzw. Document Root
- Passwort für den SFTP-Zugang oder optional ein lokaler SSH-Key

Private Schlüssel und Passwörter bitte nicht im Chat und nicht in Git speichern. Für den aktuellen Zugang ist ein Passwort ausreichend. Für einen komplett unbeaufsichtigten Upload kann später ein SSH-Key verwendet werden, sofern er im Hosting freigeschaltet ist.

## Lokale Variablen

Das Skript verwendet diese Umgebungsvariablen:

```powershell
$env:SMASHTIME_SFTP_HOST = "sftp.example"
$env:SMASHTIME_SFTP_PORT = "22"
$env:SMASHTIME_SFTP_USER = "smashtime"
$env:SMASHTIME_SFTP_REMOTE_PATH = "/public"
$env:SMASHTIME_SFTP_KEY = "C:\Users\PC\.ssh\smashtime-ionos-ed25519"
```

Für den aktuellen IONOS-Zugang wird zusätzlich das Passwort lokal gesetzt. Es wird dabei nicht ausgegeben:

```powershell
$securePassword = Read-Host "IONOS SFTP Passwort" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$env:SMASHTIME_SFTP_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
```

Die Werte gelten nur lokal für die aktuelle PowerShell-Sitzung und werden nicht in Git gespeichert.

Alternativ kann eine git-ignorierte Datei `ionos-deploy.local.json` auf Basis von `ionos-deploy.example.json` verwendet werden. Das ist für den eingerichteten Schlüsselzugang der empfohlene Weg.

## Optional: SSH-Key vorbereiten

Falls noch kein Deployment-Key vorhanden ist:

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\smashtime-ionos-ed25519" -C "smashtime-ionos-deploy"
Get-Content "$env:USERPROFILE\.ssh\smashtime-ionos-ed25519.pub"
```

Der Inhalt der `.pub`-Datei wird im IONOS-Konto hinterlegt. Die Datei ohne `.pub` bleibt privat auf dem Rechner.

## Upload

Der aktuelle Upload-Befehl lautet:

```powershell
.\scripts\deploy-ionos-sftp.ps1 -Source out
```

Alternativ:

```powershell
npm run deploy:ionos -- -Source out
```

Vor einem Upload muss der passende Build für die gewählte IONOS-Variante erzeugt werden. Das Skript lädt ausschließlich den angegebenen Ordner hoch und verändert keine Zugangsdaten.

## Aktueller Stand

SmashTime wird als statischer Next.js-Export in `out` gebaut. Für das aktuelle IONOS-Webhosting ist im SFTP-Kontext `/public` der korrekte Zielpfad. Der SSH-Pfad `/home/www/public` entspricht nicht direkt dem SFTP-Pfad und darf daher nicht als SFTP-Ziel verwendet werden.
