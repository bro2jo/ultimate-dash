const sharp = require('sharp');
const path = require('path');

// Input image path
const inputImage = path.join(__dirname, '../src/assets/background.jpg');

// Output directory
const outputDir = path.join(__dirname, '../public/images');

// Define size variants (maintaining 16:9 aspect ratio)
const sizeVariants = {
  sm: { width: 640, height: 360 },    // Small screens
  md: { width: 1280, height: 720 },   // Medium screens
  lg: { width: 1920, height: 1080 },  // Large screens/desktop
};

// Create different sizes and formats
async function optimizeImages() {
  try {
    // Generate WebP versions for all sizes
    for (const [size, dimensions] of Object.entries(sizeVariants)) {
      // WebP version
      await sharp(inputImage)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          withoutEnlargement: true // Prevents upscaling if original is smaller
        })
        .webp({ 
          quality: 80,
          effort: 6, // Higher compression effort
          smartSubsample: true // Better color detail preservation
        })
        .toFile(path.join(outputDir, `background-${size}.webp`));

      // JPEG fallback
      await sharp(inputImage)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 80,
          progressive: true,
          mozjpeg: true, // Use mozjpeg for better compression
          chromaSubsampling: '4:4:4' // Better quality
        })
        .toFile(path.join(outputDir, `background-${size}.jpg`));
    }

    // Generate special mobile-optimized versions (still landscape)
    const mobileVariants = {
      mobileSm: { width: 640, height: 360 },
      mobileMd: { width: 960, height: 540 },
      mobileLg: { width: 1280, height: 720 }
    };

    for (const [size, dimensions] of Object.entries(mobileVariants)) {
      await sharp(inputImage)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 80,
          effort: 6,
          smartSubsample: true
        })
        .toFile(path.join(outputDir, `background-${size}.webp`));

      await sharp(inputImage)
        .resize(dimensions.width, dimensions.height, {
          fit: 'cover',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 80,
          progressive: true,
          mozjpeg: true,
          chromaSubsampling: '4:4:4'
        })
        .toFile(path.join(outputDir, `background-${size}.jpg`));
    }

    // Generate a tiny placeholder for blur-up effect
    await sharp(inputImage)
      .resize(20, 11) // Tiny version maintaining aspect ratio
      .blur(2) // Slight blur for better placeholder appearance
      .webp({ quality: 20 })
      .toFile(path.join(outputDir, 'background-placeholder.webp'));

    console.log('Images optimized successfully!');
    
    // Log out the file sizes for verification
    const files = await Promise.all([
      sharp(path.join(outputDir, 'background-sm.webp')).metadata(),
      sharp(path.join(outputDir, 'background-md.webp')).metadata(),
      sharp(path.join(outputDir, 'background-lg.webp')).metadata(),
      sharp(path.join(outputDir, 'background-mobileSm.webp')).metadata(),
      sharp(path.join(outputDir, 'background-mobileMd.webp')).metadata(),
      sharp(path.join(outputDir, 'background-mobileLg.webp')).metadata(),
    ]);
    
    console.log('Generated file sizes:');
    files.forEach(file => {
      console.log(`${file.width}x${file.height}: ${(file.size / 1024).toFixed(2)}KB`);
    });

  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

// Run the optimization
optimizeImages();