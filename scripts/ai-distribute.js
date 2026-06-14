const fs = require('fs');
const path = require('path');

const parsedFile = path.join(__dirname, '..', 'data', 'temp', 'ai_parsed.json');
const outputDir = path.join(__dirname, '..', 'data', 'zalo_export');

if (!fs.existsSync(parsedFile)) {
  console.error("Not found:", parsedFile);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(parsedFile, 'utf8'));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let count = 0;
for (const item of data) {
  const folderPath = path.join(outputDir, item.folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const productJson = [
    {
      productName: item.productName,
      sellPrice: item.sellPrice,
      description: item.description
    }
  ];
  
  const outputPath = path.join(folderPath, 'product.json');
  fs.writeFileSync(outputPath, JSON.stringify(productJson, null, 2) + '\n', 'utf8');
  console.log(`Created ${path.relative(path.join(__dirname, ".."), outputPath)}`);
  count++;
}

console.log(`\nSuccess! Distributed ${count} product.json files.`);
