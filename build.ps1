$projectRoot = $PSScriptRoot

Write-Host "[build] Minifying assets for NikodemBoryczka" -ForegroundColor Cyan

# --- Minify CSS ---
$cssPath = Join-Path (Join-Path $projectRoot "css") "style.css"
$cssMinPath = Join-Path (Join-Path $projectRoot "css") "style.min.css"

Write-Host "[build] Minifying CSS..." -ForegroundColor Yellow
$css = Get-Content $cssPath -Raw

# Remove comments
$css = [regex]::Replace($css, '/\*.*?\*/', '', 'Singleline')
# Remove extra whitespace
$css = [regex]::Replace($css, '\s+', ' ')
# Fix selector spacing
$css = [regex]::Replace($css, '} ', "}`r`n")
$css = [regex]::Replace($css, '; ', ';')
$css = [regex]::Replace($css, ' {', '{')
$css = [regex]::Replace($css, '{ ', '{')
$css = [regex]::Replace($css, ' ,', ',')
$css = [regex]::Replace($css, ', ', ',')
$css = [regex]::Replace($css, ' :', ':')
$css = [regex]::Replace($css, ': ', ':')
$css = [regex]::Replace($css, '> ', '>')
$css = [regex]::Replace($css, ' >', '>')
$css = [regex]::Replace($css, '~ ', '~')
$css = [regex]::Replace($css, ' ~', '~')
$css = [regex]::Replace($css, '\+ ', '+')
$css = [regex]::Replace($css, ' \+', '+')
# Trim lines
$css = ($css -split "`r`n" | ForEach-Object { $_.Trim() }) -join "`r`n"
# Remove leading/trailing whitespace
$css = $css.Trim()

Set-Content $cssMinPath $css -NoNewline
$origSize = (Get-Item $cssPath).Length
$minSize = (Get-Item $cssMinPath).Length
$saved = [math]::Round(($origSize - $minSize) / $origSize * 100, 1)
Write-Host "[build] CSS: $origSize B -> $minSize B (saved $saved%)" -ForegroundColor Green

# --- Minify JS files ---
$jsFiles = @(
    @{src = "nav.js"; min = "nav.min.js"},
    @{src = "animations.js"; min = "animations.min.js"},
    @{src = "github-api.js"; min = "github-api.min.js"}
)

foreach ($file in $jsFiles) {
    $srcPath = Join-Path (Join-Path $projectRoot "js") $file.src
    $minPath = Join-Path (Join-Path $projectRoot "js") $file.min

    Write-Host "[build] Minifying $($file.src)..." -ForegroundColor Yellow
    $js = Get-Content $srcPath -Raw

    # Remove single-line comments
    $js = [regex]::Replace($js, '//.*', '')
    # Remove multi-line comments
    $js = [regex]::Replace($js, '/\*.*?\*/', '', 'Singleline')
    # Compress whitespace
    $js = [regex]::Replace($js, '\s+', ' ')
    $js = [regex]::Replace($js, '\s*([{}();,=+\-*/<>!])\s*', '$1')
    $js = $js.Trim()

    Set-Content $minPath $js -NoNewline
    $origSize = (Get-Item $srcPath).Length
    $minSize = (Get-Item $minPath).Length
    $saved = [math]::Round(($origSize - $minSize) / $origSize * 100, 1)
    Write-Host "[build] JS: $origSize B -> $minSize B (saved $saved%)" -ForegroundColor Green
}

# --- Update HTML references to use minified files ---
Write-Host "[build] Updating HTML references..." -ForegroundColor Yellow
$htmlFiles = Get-ChildItem $projectRoot -Recurse -Filter "*.html"

foreach ($htmlFile in $htmlFiles) {
    $html = Get-Content $htmlFile.FullName -Raw
    $changed = $false

    # CSS
    if ($html -match 'href="[^"]*style\.css"') {
        $html = $html -replace 'href="([^"]*)style\.css"', 'href="$1style.min.css"'
        $changed = $true
    }

    # JS files
    if ($html -match 'src="[^"]*nav\.js"') {
        $html = $html -replace 'src="([^"]*)nav\.js"', 'src="$1nav.min.js"'
        $changed = $true
    }
    if ($html -match 'src="[^"]*animations\.js"') {
        $html = $html -replace 'src="([^"]*)animations\.js"', 'src="$1animations.min.js"'
        $changed = $true
    }
    if ($html -match 'src="[^"]*github-api\.js"') {
        $html = $html -replace 'src="([^"]*)github-api\.js"', 'src="$1github-api.min.js"'
        $changed = $true
    }

    if ($changed) {
        Set-Content $htmlFile.FullName $html -NoNewline
        Write-Host "[build] Updated $($htmlFile.Name)" -ForegroundColor Gray
    }
}

Write-Host "[build] Done!" -ForegroundColor Cyan
