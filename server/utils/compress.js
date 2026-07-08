const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MAX_SIZE_BYTES = 150 * 1024; // 150KB
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".bmp"];

// Check if image needs resize based on target dimensions
function needsResize(filePath, targetWidth, targetHeight) {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(ext)) return false;

  return sharp(filePath)
    .metadata()
    .then((metadata) => {
      return metadata.width !== targetWidth || metadata.height !== targetHeight;
    });
}

// Resize image to exact dimensions
async function resizeImage(filePath, targetWidth, targetHeight, fit = "cover") {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(ext)) return null;

  const stats = fs.statSync(filePath);
  const metadata = await sharp(filePath).metadata();

  // Check if resize is needed
  if (metadata.width === targetWidth && metadata.height === targetHeight) {
    return null; // Already correct dimensions
  }

  const buffer = fs.readFileSync(filePath);

  // Resize to exact dimensions
  const outputBuffer = await sharp(buffer)
    .resize(targetWidth, targetHeight, { fit })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();

  // Write resized file back
  fs.writeFileSync(filePath, outputBuffer);

  return {
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    newWidth: targetWidth,
    newHeight: targetHeight,
    originalSize: stats.size,
    newSize: outputBuffer.length,
  };
}

// Compress image to target size (150KB)
async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // Only compress image files
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return null;
  }

  const stats = fs.statSync(filePath);
  if (stats.size <= MAX_SIZE_BYTES) {
    return null; // Already under 150KB
  }

  const buffer = fs.readFileSync(filePath);
  let quality = 80;
  let outputBuffer;
  let iterations = 0;
  const maxIterations = 10;

  // Iteratively reduce quality until under 150KB
  while (iterations < maxIterations) {
    outputBuffer = await sharp(buffer)
      .resize(1920, null, { withoutEnlargement: true }) // Max width 1920px
      .jpeg({ quality, progressive: true })
      .toBuffer();

    if (outputBuffer.length <= MAX_SIZE_BYTES) {
      break;
    }

    quality -= 10;
    iterations++;
  }

  // Write compressed file back (replace original)
  fs.writeFileSync(filePath, outputBuffer);

  return {
    originalSize: stats.size,
    newSize: outputBuffer.length,
    saved: stats.size - outputBuffer.length,
    quality,
  };
}

// Compress multiple files (used after multer upload)
async function compressFiles(files) {
  const results = [];

  for (const file of files) {
    const filePath = file.path || file.destination
      ? path.join(file.destination, file.filename)
      : null;

    if (filePath && fs.existsSync(filePath)) {
      const result = await compressImage(filePath);
      if (result) {
        results.push({
          filename: file.filename,
          ...result,
        });
      }
    }
  }

  return results;
}

// Resize multiple files to target dimensions
async function resizeFiles(files, targetWidth, targetHeight, fit = "cover") {
  const results = [];

  for (const file of files) {
    const filePath = file.path || file.destination
      ? path.join(file.destination, file.filename)
      : null;

    if (filePath && fs.existsSync(filePath)) {
      const result = await resizeImage(filePath, targetWidth, targetHeight, fit);
      if (result) {
        results.push({
          filename: file.filename,
          ...result,
        });
      }
    }
  }

  return results;
}

module.exports = {
  compressImage,
  compressFiles,
  resizeImage,
  resizeFiles,
  needsResize,
  MAX_SIZE_BYTES,
};
