const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "..", "data", "zalo_export");
const OUTPUT_DIR = path.join(__dirname, "..", "data", "zalo_export");
const OUTPUT_NAME = "product.json";
function scoreVietnameseText(text) {
  const goodMatches = text.match(/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi) || [];
  const mojibakeMatches = text.match(/(?:Ã.|á.|Ä.|Â.|Æ.|â€¦|â€“|â€”|�)/g) || [];
  return goodMatches.length * 3 - mojibakeMatches.length * 2;
}

function repairEncoding(text) {
  const repaired = Buffer.from(text, "latin1").toString("utf8");
  return scoreVietnameseText(repaired) > scoreVietnameseText(text) ? repaired : text;
}

function readTextFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r\n?/g, "\n");
  return repairEncoding(raw)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeLine(line) {
  return line
    .replace(/^[\s\-–—•]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanLines(text) {
  return text
    .split("\n")
    .map(normalizeLine)
    .filter((line) => line && line !== ".");
}

function isDetailLine(line) {
  return /:|^(thành phần|trọng lượng|khối lượng|cân nặng|chiều dài|độ dài|kim móc|kim đan|cỡ sợi|kích cỡ sợi|kích thước|chất liệu|xuất xứ|xuất sứ|đường kính sợi|sử dụng kim|màu|giá)(?:\s|:|$)/i.test(line);
}

function extractPrices(line) {
  const compactPriceMatches = [...line.matchAll(/(\d{4,6})1\s*cuộn/gi)];
  if (compactPriceMatches.length > 0) {
    return compactPriceMatches
      .map((match) => Number(match[1].replace(/[^\d]/g, "")))
      .filter((value) => Number.isFinite(value) && value >= 1000);
  }

  const matches = line.match(/\d{1,3}(?:[.,]\d{3})+|\d{4,6}/g) || [];
  return matches
    .map((value) => Number(value.replace(/[^\d]/g, "")))
    .filter((value) => Number.isFinite(value) && value >= 1000);
}

function isPriceLine(line) {
  if (/(khách sỉ|inbox)/i.test(line)) {
    return false;
  }
  const prices = extractPrices(line);
  return prices.length > 0 && /(?:màu|giá|cuộn|1 cuộn|\/1|=1|\btrơn\b|\bloang\b)/i.test(line) || /^\d{1,3}(?:[.,]\d{3})+|\d{4,6}/.test(line);
}

function smartTitleCase(text) {
  return text
    .split(/\s+/)
    .map((word) => {
      if (!word) {
        return word;
      }
      if (/[A-ZÀ-Ỵ].*[A-ZÀ-Ỵ]/.test(word) || /\d/.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\bVietNam\b/g, "Vietnam")
    .replace(/\bT-shirt\b/g, "T-Shirt");
}

function extractNameInfo(lines) {
  const nameLines = [lines[0] || ""].filter(Boolean);
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (isDetailLine(line) || isPriceLine(line)) {
      break;
    }
    if (/^\d+\.\s*\S+/u.test(line) || /^[\p{L}\d\s()\-]+$/u.test(line)) {
      nameLines.push(line);
      continue;
    }
    break;
  }

  const rawName = (nameLines.join(" ") || lines[0] || "").trim();
  let source = rawName
    .replace(/^\d+\.\s*/u, "")
    .replace(/\b\d+\.\s*/gu, " ")
    .replace(/^thông tin chi tiết về\s*/i, "")
    .replace(/^thông tin\s*/i, "")
    .replace(/:\s*$/u, "")
    .trim();

  let remainder = "";
  const laMatch = source.match(/^(.*?)(?:\s+là\s+)(.+)$/i);
  if (laMatch) {
    source = laMatch[1].trim();
    remainder = laMatch[2].trim();
  }

  source = source
    .replace(/\s+\(\s*/g, " (")
    .replace(/\s*\)\s*/g, ") ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    consumedLines: nameLines.length || 1,
    productName: smartTitleCase(source),
    remainder: remainder ? remainder.charAt(0).toUpperCase() + remainder.slice(1) : "",
  };
}

function parseProduct(text) {
  const lines = cleanLines(text);
  const nameInfo = extractNameInfo(lines);

  const prices = [];
  const priceLines = [];
  for (const line of lines) {
    if (isPriceLine(line)) {
      prices.push(...extractPrices(line));
      priceLines.push(line);
    }
  }

  const descriptionLines = [];
  if (nameInfo.remainder) {
    descriptionLines.push(nameInfo.remainder);
  }

  for (let index = nameInfo.consumedLines; index < lines.length; index += 1) {
    const line = lines[index];
    if (/(khách sỉ|inbox)/i.test(line)) {
      continue;
    }
    if (isPriceLine(line)) {
      continue;
    }
    descriptionLines.push(line);
  }

  const descriptionBody = descriptionLines.join("\n").trim();
  const descriptionPriceBlock = priceLines.join("\n").trim();
  const description = descriptionPriceBlock
    ? descriptionBody
      ? `${descriptionBody}\n\n${descriptionPriceBlock}`
      : descriptionPriceBlock
    : descriptionBody;

  return {
    productName: nameInfo.productName || "San Pham",
    sellPrice: prices.length > 0 ? prices[prices.length - 1] : 0,
    description,
  };
}

function splitProducts(text) {
  const matches = [...text.matchAll(/(?:^|\n{2,})(\d+\.\s+[^\n]+)/g)];
  if (matches.length <= 1) {
    return [text];
  }

  const segments = [];
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index + (text[matches[i].index] === "\n" ? 1 : 0);
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const segment = text.slice(start, end).trim();
    if (segment) {
      segments.push(segment);
    }
  }

  if (segments.length <= 1) {
    return [text];
  }

  const merged = [];
  for (const segment of segments) {
    if (!/\d{4,6}|\d{1,3}(?:[.,]\d{3})+/.test(segment) && merged.length > 0) {
      merged[merged.length - 1] = `${merged[merged.length - 1]}\n${segment}`.trim();
      continue;
    }
    merged.push(segment);
  }
  return merged;
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const folders = fs.existsSync(INPUT_DIR)
    ? fs.readdirSync(INPUT_DIR, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    : [];

  for (const folder of folders) {
    const folderPath = path.join(INPUT_DIR, folder.name);
    const txtFiles = fs.readdirSync(folderPath).filter((file) => file.toLowerCase().endsWith(".txt"));
    if (txtFiles.length === 0) {
      continue;
    }

    const inputPath = path.join(folderPath, txtFiles[0]);
    const text = readTextFile(inputPath);
    const products = splitProducts(text).map(parseProduct);

    const outputFolder = path.join(OUTPUT_DIR, folder.name);
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
    const outputPath = path.join(outputFolder, OUTPUT_NAME);

    fs.writeFileSync(outputPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
    console.log(`Created ${path.relative(path.join(__dirname, ".."), outputPath)}`);
  }
}

main();
