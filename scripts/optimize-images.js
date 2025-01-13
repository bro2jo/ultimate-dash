const sharp = require('sharp');
const path = require('path');

// Input image path
const inputImage = path.join(__dirname, '../src/assets/background.jpg');

// Output directory
const outputDir = path.join(__dirname, '../public/images');

// Create different sizes and formats
async function optimizeImages() {
  try {
    // Desktop WebP (1920x1080)
    await sharp(inputImage)
      .resize(1920, 1080, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'background.webp'));

    // Desktop JPG (1920x1080)
    await sharp(inputImage)
      .resize(1920, 1080, { fit: 'cover' })
      .jpeg({ quality: 80, progressive: true })
      .toFile(path.join(outputDir, 'background.jpg'));

    // Mobile WebP (768x1024)
    await sharp(inputImage)
      .resize(768, 1024, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, 'background-mobile.webp'));

    // Mobile JPG (768x1024)
    await sharp(inputImage)
      .resize(768, 1024, { fit: 'cover' })
      .jpeg({ quality: 80, progressive: true })
      .toFile(path.join(outputDir, 'background-mobile.jpg'));

    console.log('Images optimized successfully!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization
optimizeImages();