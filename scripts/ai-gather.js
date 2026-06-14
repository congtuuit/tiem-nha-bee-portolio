const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'data', 'zalo_export');
const outputFile = path.join(__dirname, '..', 'data', 'temp', 'raw_contents.json');

const folders = fs.readdirSync(inputDir, { withFileTypes: true }).filter(f => f.isDirectory());
const results = [];

function scoreVietnameseText(text) {
  const goodMatches = text.match(/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi) || [];
  const mojibakeMatches = text.match(/(?:Ã.|á.|Ä.|Â.|Æ.|â€¦|â€“|â€”|)/g) || [];
  return goodMatches.length * 3 - mojibakeMatches.length * 2;
}

function repairEncoding(text) {
  const repaired = Buffer.from(text, "latin1").toString("utf8");
  return scoreVietnameseText(repaired) > scoreVietnameseText(text) ? repaired : text;
}

for (const folder of folders) {
  const folderPath = path.join(inputDir, folder.name);
  const txtFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));
  
  if (txtFiles.length > 0) {
    const textPath = path.join(folderPath, txtFiles[0]);
    const rawStr = fs.readFileSync(textPath, "utf8").replace(/\r\n?/g, "\n");
    const cleanedContent = repairEncoding(rawStr).replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
    
    results.push({
      folder: folder.name,
      content: cleanedContent
    });
  }
}

const outDir = path.dirname(outputFile);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
console.log(`Saved ${results.length} items to ${outputFile}`);
