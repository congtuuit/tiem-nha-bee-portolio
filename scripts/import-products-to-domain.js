const fs = require("fs");
const path = require("path");

loadEnvFile(path.resolve(process.cwd(), ".env"));

const DEFAULT_BASE_DIR = "D:\\BeeShop\\data";
const DEFAULT_API_URL = "https://tiemnhabee.vercel.app/api/admin/bulk-import";
const DEFAULT_CATEGORY_PATH = ["Chưa phân loại"];
const DEFAULT_IMPORT_SECRET = "bee-secret-import-key";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const args = process.argv.slice(2);
const options = parseArgs(args);

const BASE_DIR = options.baseDir || DEFAULT_BASE_DIR;
const API_URL = options.apiUrl || process.env.IMPORT_API_URL || DEFAULT_API_URL;
const IMPORT_SECRET =
  options.secret || process.env.IMPORT_SECRET || DEFAULT_IMPORT_SECRET;
const CATEGORY_PATH = parseCategoryPath(
  options.categoryPath || process.env.IMPORT_CATEGORY_PATH
);
const DRY_RUN = options.dryRun;

if (!fs.existsSync(BASE_DIR)) {
  console.error(`Base directory does not exist: ${BASE_DIR}`);
  process.exit(1);
}

async function main() {
  console.log(`Starting import from: ${BASE_DIR}`);
  console.log(`Target API: ${API_URL}`);
  console.log(`Category path: ${CATEGORY_PATH.join(" > ")}`);
  if (DRY_RUN) {
    console.log("Dry run enabled. No request will be sent.");
  }

  const productDirs = findProductDirectories(BASE_DIR);
  if (productDirs.length === 0) {
    console.log("No folder with product.json found.");
    return;
  }

  const summary = {
    total: productDirs.length,
    imported: 0,
    failed: 0,
    skipped: 0,
  };

  for (const dir of productDirs) {
    const result = await importFromDirectory(dir);
    summary[result] += 1;
  }

  console.log("");
  console.log("Import summary:");
  console.log(`- Total folders with product.json: ${summary.total}`);
  console.log(`- Imported: ${summary.imported}`);
  console.log(`- Failed: ${summary.failed}`);
  console.log(`- Skipped: ${summary.skipped}`);
}

async function importFromDirectory(directoryPath) {
  const jsonPath = path.join(directoryPath, "product.json");

  let productPayload;
  try {
    productPayload = readProductJson(jsonPath);
  } catch (error) {
    console.error(`[SKIP] ${directoryPath} - ${error.message}`);
    return "skipped";
  }

  if (!productPayload.productName) {
    console.error(`[SKIP] ${directoryPath} - Missing productName in product.json`);
    return "skipped";
  }

  const imagePath = findFirstImage(directoryPath);

  if (DRY_RUN) {
    console.log(
      `[DRY RUN] ${productPayload.productName} | image: ${imagePath ? path.basename(imagePath) : "none"}`
    );
    return "imported";
  }

  const formData = new FormData();
  formData.append("productName", productPayload.productName);
  formData.append("categoryPath", JSON.stringify(CATEGORY_PATH));
  formData.append("price", String(productPayload.sellPrice ?? 0));
  formData.append("description", productPayload.description || "");

  if (imagePath) {
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);
    const mimeType = getMimeType(imagePath);
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append("images", blob, fileName);
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-import-secret": IMPORT_SECRET,
      },
      body: formData,
    });

    const responseBody = await readResponseBody(response);

    if (!response.ok || !responseBody.success) {
      console.error(
        `[FAIL] ${productPayload.productName} - ${response.status} ${response.statusText} - ${
          responseBody.error || "Unknown error"
        }`
      );
      return "failed";
    }

    console.log(
      `[OK] ${productPayload.productName} | image: ${imagePath ? path.basename(imagePath) : "none"}`
    );
    return "imported";
  } catch (error) {
    console.error(`[FAIL] ${productPayload.productName} - ${error.message}`);
    return "failed";
  }
}

function findProductDirectories(rootDir) {
  const results = [];
  walkDirectories(rootDir, results);
  return results.sort((a, b) => a.localeCompare(b));
}

function walkDirectories(currentDir, results) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  const hasProductJson = entries.some(
    (entry) => entry.isFile() && entry.name.toLowerCase() === "product.json"
  );

  if (hasProductJson) {
    results.push(currentDir);
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    walkDirectories(path.join(currentDir, entry.name), results);
  }
}

function readProductJson(jsonPath) {
  const raw = fs.readFileSync(jsonPath, "utf8");
  const parsed = JSON.parse(raw);
  const item = Array.isArray(parsed) ? parsed[0] : parsed;

  if (!item || typeof item !== "object") {
    throw new Error("product.json must contain an object or an array with one object");
  }

  return {
    productName:
      typeof item.productName === "string" ? item.productName.trim() : "",
    sellPrice: normalizePrice(item.sellPrice),
    description:
      typeof item.description === "string" ? item.description.trim() : "",
  };
}

function normalizePrice(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    throw new Error(`Invalid sellPrice: ${value}`);
  }

  return numericValue;
}

function findFirstImage(directoryPath) {
  const imageFile = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))[0];

  return imageFile ? path.join(directoryPath, imageFile) : null;
}

function isImageFile(fileName) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

async function readResponseBody(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

function parseCategoryPath(rawValue) {
  if (!rawValue) {
    return DEFAULT_CATEGORY_PATH;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
  } catch {
    return rawValue
      .split(">")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return DEFAULT_CATEGORY_PATH;
}

function parseArgs(argv) {
  const parsed = {
    baseDir: "",
    apiUrl: "",
    secret: "",
    categoryPath: "",
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (arg === "--base-dir") {
      parsed.baseDir = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg === "--api-url") {
      parsed.apiUrl = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg === "--secret") {
      parsed.secret = argv[index + 1] || "";
      index += 1;
      continue;
    }

    if (arg === "--category-path") {
      parsed.categoryPath = argv[index + 1] || "";
      index += 1;
      continue;
    }
  }

  return parsed;
}

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

main().catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
