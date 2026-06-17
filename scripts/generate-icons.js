const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const inputImage = path.join(__dirname, '../public/logo.jpg');
  
  if (!fs.existsSync(inputImage)) {
    console.error(`Input image not found: ${inputImage}`);
    process.exit(1);
  }

  // 1. Generate app/icon.png (for modern browsers)
  await sharp(inputImage)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '../app/icon.png'));
  console.log('Generated app/icon.png (192x192)');

  // 2. Generate app/apple-icon.png (for iOS)
  await sharp(inputImage)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../app/apple-icon.png'));
  console.log('Generated app/apple-icon.png (180x180)');
  
  // 3. Remove the old favicon.ico as we are using icon.png
  const oldFavicon = path.join(__dirname, '../app/favicon.ico');
  if (fs.existsSync(oldFavicon)) {
    fs.unlinkSync(oldFavicon);
    console.log('Removed old app/favicon.ico');
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
