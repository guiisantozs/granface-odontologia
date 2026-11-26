$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent $PSScriptRoot
$packageRoot = Join-Path $workspace 'entrega\GRANFACE-APRESENTACAO-WINDOWS'
$buildRoot = Join-Path $workspace 'dist'
if (-not (Test-Path -LiteralPath (Join-Path $buildRoot 'index.html'))) {
    throw 'Gere a versao estatica com npm run build antes de criar o pacote.'
}
New-Item -ItemType Directory -Force -Path (Join-Path $packageRoot 'site') | Out-Null
Get-ChildItem -LiteralPath $buildRoot | Copy-Item -Destination (Join-Path $packageRoot 'site') -Recurse -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'portable\ABRIR-GRANFACE.cmd') -Destination $packageRoot -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'portable\apresentacao.ps1') -Destination $packageRoot -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'portable\LEIA-ME.txt') -Destination $packageRoot -Force
$archive = Join-Path $workspace 'entrega\GRANFACE-APRESENTACAO-WINDOWS.zip'
Compress-Archive -LiteralPath $packageRoot -DestinationPath $archive -Force
Get-Item -LiteralPath $archive | Select-Object FullName, Length
