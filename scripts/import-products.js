const fs = require('fs');
const path = require('path');

//node scripts/import-products.js "C:\Đường\Dẫn\Đến\Thư\Mục\Sản\Phẩm"

// CONFIGURATION
const BASE_DIR = process.argv[2]; // Path to your local folder
const API_URL = 'http://localhost:3000/api/admin/bulk-import';
const IMPORT_SECRET = 'bee-secret-import-key'; // Match your .env IMPORT_SECRET

if (!BASE_DIR) {
  console.error("Please provide the base directory path.");
  console.log("Usage: node import-products.js <path_to_folder>");
  process.exit(1);
}

async function importProduct(productName, categoryPath, imagePaths) {
  const formData = new FormData();
  formData.append('productName', productName);
  formData.append('categoryPath', JSON.stringify(categoryPath));
  formData.append('price', '0'); // Default price
  formData.append('description', `Sản phẩm ${productName} thuộc danh mục ${categoryPath.join(' > ')}`);

  for (const imgPath of imagePaths) {
    const fileBuffer = fs.readFileSync(imgPath);
    const fileName = path.basename(imgPath);
    const blob = new Blob([fileBuffer]);
    formData.append('images', blob, fileName);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-import-secret': IMPORT_SECRET
      },
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      console.log(`✅ Imported: ${productName} (${categoryPath.join(' > ')})`);
    } else {
      console.error(`❌ Failed: ${productName} - ${result.error}`);
    }
  } catch (error) {
    console.error(`❌ Error importing ${productName}:`, error.message);
  }
}

function isImage(fileName) {
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return exts.includes(path.extname(fileName).toLowerCase());
}

async function scanDirectory(currentPath, categoryPath = []) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  const folders = entries.filter(e => e.isDirectory());
  const files = entries.filter(e => e.isFile() && isImage(e.name));

  // If there are images and no subfolders, this is a Product Folder (Folder C)
  if (files.length > 0) {
    const productName = path.basename(currentPath);
    const imagePaths = files.map(f => path.join(currentPath, f.name));
    await importProduct(productName, categoryPath, imagePaths);
  }

  // Recurse into subfolders
  for (const folder of folders) {
    const nextCategoryPath = [...categoryPath, folder.name];
    await scanDirectory(path.join(currentPath, folder.name), nextCategoryPath);
  }
}

console.log(`🚀 Starting import from: ${BASE_DIR}`);
scanDirectory(BASE_DIR)
  .then(() => console.log("✨ All done!"))
  .catch(err => console.error("💥 Fatal error:", err));
