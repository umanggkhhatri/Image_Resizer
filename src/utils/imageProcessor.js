import imageCompression from 'browser-image-compression';

const processImage = async (imageFile, settings, onProgress) => {
  try {
    // Create canvas for resizing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load image
    const img = new Image();
    img.src = URL.createObjectURL(imageFile.file);
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Calculate dimensions maintaining aspect ratio
    let { width, height } = settings;
    const aspectRatio = img.width / img.height;
    
    if (width && height) {
      // Both dimensions specified - fit to container
      const containerRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      
      if (aspectRatio > containerRatio) {
        // Image is wider - fit to width
        drawHeight = width / aspectRatio;
      } else {
        // Image is taller - fit to height
        drawWidth = height * aspectRatio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // Center the image
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else if (width) {
      // Only width specified - scale proportionally
      height = Math.round(width / aspectRatio);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    } else if (height) {
      // Only height specified - scale proportionally
      width = Math.round(height * aspectRatio);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    } else {
      // No dimensions specified - use original size
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    }
    
    // Convert canvas to blob
    const canvasBlob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', settings.quality / 100);
    });
    
    // Clean up
    URL.revokeObjectURL(img.src);
    
    // Additional compression with browser-image-compression
    const compressionOptions = {
      maxSizeMB: 10,
      maxWidthOrHeight: Math.max(width || img.width, height || img.height),
      useWebWorker: true,
      initialQuality: settings.quality / 100,
      onProgress: (progress) => {
        if (onProgress) {
          onProgress(imageFile.id, Math.round(progress * 100));
        }
      }
    };
    
    const compressedFile = await imageCompression(canvasBlob, compressionOptions);
    
    return {
      id: imageFile.id,
      name: `processed_${imageFile.name}`,
      originalBlob: imageFile.file,
      processedBlob: compressedFile,
      processedSize: compressedFile.size,
      originalSize: imageFile.originalSize,
      width: canvas.width,
      height: canvas.height,
      quality: settings.quality
    };
    
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export const processImages = async (images, settings, onProgress) => {
  const processedImages = [];
  
  // Process images sequentially to avoid memory issues
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      const processed = await processImage(image, settings, onProgress);
      processedImages.push(processed);
    } catch (error) {
      console.error(`Failed to process image ${image.name}:`, error);
      // Continue with other images even if one fails
      processedImages.push({
        id: image.id,
        name: image.name,
        error: true,
        errorMessage: error.message
      });
    }
  }
  
  return processedImages;
};

// Utility function to format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Utility function to calculate compression ratio
export const calculateCompressionRatio = (originalSize, compressedSize) => {
  if (originalSize === 0) return 0;
  return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
};