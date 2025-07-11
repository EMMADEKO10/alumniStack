# Script pour convertir les fichiers JavaScript en TypeScript
# Usage: .\convert-to-ts.ps1

Write-Host "Début de la conversion des fichiers JavaScript vers TypeScript..." -ForegroundColor Green

# Fonction pour convertir un fichier JS en TS
function Convert-JsToTs {
    param(
        [string]$JsFilePath
    )
    
    $TsFilePath = $JsFilePath -replace '\.js$', '.tsx'
    
    # Si c'est un composant React, utiliser .tsx
    $content = Get-Content $JsFilePath -Raw
    
    if ($content -match 'import React' -or $content -match 'export default' -or $content -match 'function.*\(') {
        $TsFilePath = $JsFilePath -replace '\.js$', '.tsx'
    } else {
        $TsFilePath = $JsFilePath -replace '\.js$', '.ts'
    }
    
    Write-Host "Conversion de $JsFilePath vers $TsFilePath" -ForegroundColor Yellow
    
    # Lire le contenu et ajouter les types TypeScript
    $content = Get-Content $JsFilePath -Raw
    
    # Ajouter les imports React si nécessaire
    if ($content -match 'import React' -and $content -notmatch 'React\.FC') {
        $content = $content -replace 'const (\w+) = \(', 'const $1: React.FC = ('
        $content = $content -replace 'function (\w+)\(', 'const $1: React.FC = ('
    }
    
    # Ajouter les types pour les props
    if ($content -match 'const (\w+) = \(\{([^}]+)\}' -and $content -notmatch 'interface') {
        $componentName = $matches[1]
        $props = $matches[2]
        
        # Créer une interface simple
        $interface = "interface ${componentName}Props {`n"
        $propsArray = $props -split ',' | ForEach-Object { $_.Trim() }
        foreach ($prop in $propsArray) {
            if ($prop -match '(\w+):') {
                $propName = $matches[1]
                $interface += "  $propName: string;`n"
            }
        }
        $interface += "}`n`n"
        
        $content = $interface + $content
    }
    
    # Écrire le nouveau fichier
    Set-Content -Path $TsFilePath -Value $content -Encoding UTF8
    
    # Supprimer l'ancien fichier
    Remove-Item $JsFilePath
    
    Write-Host "✓ Converti: $TsFilePath" -ForegroundColor Green
}

# Trouver tous les fichiers .js dans src (excluant node_modules et .next)
$jsFiles = Get-ChildItem -Recurse -Filter "*.js" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*.next*" -and
    $_.FullName -like "*src*"
}

Write-Host "Trouvé $($jsFiles.Count) fichiers JavaScript à convertir" -ForegroundColor Cyan

foreach ($file in $jsFiles) {
    try {
        Convert-JsToTs -JsFilePath $file.FullName
    }
    catch {
        Write-Host "Erreur lors de la conversion de $($file.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "Conversion terminée!" -ForegroundColor Green 