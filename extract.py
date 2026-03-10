import zipfile, re

path = r'c:\Users\adity\OneDrive\Desktop\moonlightent\Company Profile (2).docx'
with zipfile.ZipFile(path) as z:
    with z.open('word/document.xml') as f:
        xml = f.read().decode('utf-8')

# Extract text between <w:t> tags for cleaner output
texts = re.findall(r'<w:t[^>]*>([^<]*)</w:t>', xml)
output = '\n'.join(t for t in texts if t.strip())

with open(r'c:\Users\adity\OneDrive\Desktop\moonlightent\doc_text.txt', 'w', encoding='utf-8') as f:
    f.write(output)
print('Done')
