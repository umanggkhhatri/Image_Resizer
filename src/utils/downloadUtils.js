import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const downloadAsZip = async (processedImages) => {
  try {
    const zip = new JSZip();
    const folder = zip.folder('snapshrink-images');
    
    // Add each processed image to the ZIP
    for (const image of processedImages) {
      if (image.processedBlob && !image.error) {
        // Convert blob to array buffer
        const arrayBuffer = await image.processedBlob.arrayBuffer();
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const extension = image.name.split('.').pop() || 'jpg';
        const filename = `processed_${timestamp}_${image.name}`;
        
        folder.file(filename, arrayBuffer);
      }
    }
    
    // Generate ZIP file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Balance between compression ratio and speed
      }
    });
    
    // Create download filename with timestamp
    const downloadTimestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const downloadFilename = `snapshrink-${downloadTimestamp}.zip`;
    
    // Trigger download
    saveAs(zipBlob, downloadFilename);
    
    return {
      success: true,
      filename: downloadFilename,
      size: zipBlob.size
    };
    
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error(`Failed to create ZIP file: ${error.message}`);
  }
};

export const downloadSingleImage = (imageBlob, filename) => {
  try {
    saveAs(imageBlob, filename);
    return {
      success: true,
      filename: filename
    };
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error(`Failed to download image: ${error.message}`);
  }
};

// Utility to format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Utility to estimate ZIP file size (rough approximation)
export const estimateZipSize = (totalImageSize) => {
  // ZIP compression typically reduces size by 10-30% for images
  // We'll estimate 20% reduction as a reasonable average
  const estimatedReduction = 0.2;
  const estimatedSize = totalImageSize * (1 - estimatedReduction);
  return estimatedSize;
};