$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
Set-Location -LiteralPath '..'
if (-not (Test-Path -LiteralPath 'node_modules')) { npm.cmd install }
if (Test-Path -LiteralPath 'dist\index.html') {
  npm.cmd run preview -- --open
} else {
  npm.cmd run dev -- --open
}
