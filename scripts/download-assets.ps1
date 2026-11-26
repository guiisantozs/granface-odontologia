$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path 'public/assets' | Out-Null
$assets = @(
  @{ Name = 'smile.jpg'; Url = 'https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?auto=format&fit=crop&w=1600&q=90' },
  @{ Name = 'clinic.jpg'; Url = 'https://images.unsplash.com/photo-1704455306251-b4634215d98f?auto=format&fit=crop&w=2200&q=85' },
  @{ Name = 'specialist-1.jpg'; Url = 'https://images.pexels.com/photos/6303550/pexels-photo-6303550.jpeg?auto=compress&cs=tinysrgb&w=800' },
  @{ Name = 'specialist-2.jpg'; Url = 'https://images.pexels.com/photos/7446991/pexels-photo-7446991.jpeg?auto=compress&cs=tinysrgb&w=800' },
  @{ Name = 'specialist-3.jpg'; Url = 'https://images.pexels.com/photos/19963165/pexels-photo-19963165.jpeg?auto=compress&cs=tinysrgb&w=800' }
)
foreach ($asset in $assets) {
  Invoke-WebRequest -Uri $asset.Url -OutFile (Join-Path 'public/assets' $asset.Name)
  Write-Output $asset.Name
}
