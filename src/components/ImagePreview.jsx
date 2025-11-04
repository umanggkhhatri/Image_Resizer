import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';

const ImagePreview = ({ image, processedImage, onRemove, darkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    if (processedImage && processedImage.processedBlob) {
      const url = URL.createObjectURL(processedImage.processedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = processedImage.name || `processed_${image.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        darkMode ? 'glass-card-dark' : 'glass-card'
      }`}
    >
      {/* Image Thumbnail */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
        )}
        
        <img
          src={image.url}
          alt={image.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay for processed images */}
        {processedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-3"
          >
            <div className="bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">Processed</span>
            </div>
          </motion.div>
        )}
        
        {/* Remove button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X className="w-4 h-4" />
        </motion.button>
        
        {/* Download button for processed images */}
        {processedImage && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              downloadImage();
            }}
            className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      
      {/* Image Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1" title={image.name}>
            {image.name.length > 20 ? `${image.name.substring(0, 20)}...` : image.name}
          </h4>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Original:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {formatFileSize(image.originalSize)}
            </span>
          </div>
          
          {processedImage && processedImage.processedSize && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between items-center"
            >
              <span className="text-green-600 dark:text-green-400">Processed:</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatFileSize(processedImage.processedSize)}
                </span>
                <span className="text-xs text-green-500 dark:text-green-500">
                  (-{((1 - processedImage.processedSize / image.originalSize) * 100).toFixed(0)}%)
                </span>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Processing status */}
        {image.isProcessing && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${image.progress || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              Processing... {image.progress || 0}%
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImagePreview;