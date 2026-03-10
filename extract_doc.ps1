Add-Type -AssemblyName WindowsBase
$path = 'c:\Users\adity\OneDrive\Desktop\moonlightent\Company Profile (2).docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($path)
$entry = $zip.Entries | Where-Object {$_.Name -eq 'document.xml'}
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

# Strip XML tags to get plain text
$text = $content -replace '<[^>]+>', ' '
$text = $text -replace '\s+', ' '
$text = $text.Trim()

[System.IO.File]::WriteAllText('c:\Users\adity\OneDrive\Desktop\moonlightent\doc_text.txt', $text)
Write-Host "Done - text extracted"
