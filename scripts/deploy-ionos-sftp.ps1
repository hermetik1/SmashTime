[CmdletBinding()]
param(
  [string]$Source = "out"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$scriptPath = Join-Path $projectRoot "scripts\deploy-ionos-sftp.mjs"

if (-not (Test-Path -LiteralPath $scriptPath -PathType Leaf)) {
  throw "SFTP-Upload-Skript nicht gefunden: $scriptPath"
}

node $scriptPath --source $Source
if ($LASTEXITCODE -ne 0) {
  throw "SFTP-Upload fehlgeschlagen (Exit-Code $LASTEXITCODE)."
}
