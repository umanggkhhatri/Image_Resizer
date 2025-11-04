import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';

const ImageUploader = ({ onImageUpload, darkMode }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragReject(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragReject(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onImageUpload(imageFiles);
    } else if (files.length > 0) {
      setIsDragReject(true);
      setTimeout(() => setIsDragReject(false), 2000);
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onImageUpload(imageFiles);
    }
  }, [onImageUpload]);

  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="relative">
      <motion.div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        className={`drop-zone relative overflow-hidden cursor-pointer ${
          isDragActive ? 'drop-zone-active' : ''
        } ${
          isDragReject ? 'border-red-500 bg-red-50/50' : ''
        } ${
          darkMode ? 'glass-card-dark' : 'glass-card'
        } p-8 sm:p-12 text-center`}
        onClick={triggerFileInput}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20"
          animate={{
            x: isDragActive ? [0, 100, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isDragActive ? Infinity : 0,
            ease: "linear"
          }}
        />
        
        <div className="relative z-10">
          <motion.div
            animate={{
              y: isDragActive ? [-5, 5, -5] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: isDragActive ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="mb-4"
          >
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" />
            </div>
          </motion.div>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop your photos here' : 'Drop or select your photos'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isDragReject 
              ? 'Please drop only image files (JPG, PNG, GIF, WebP)'
              : 'Drag and drop multiple images or click to browse'
            }
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="gradient-button inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Select Photos</span>
          </motion.button>
          
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Supports JPG, PNG, GIF, WebP up to 10MB each
          </p>
        </div>
      </motion.div>
      
      {/* Hidden file input */}
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {/* Mobile touch area hint */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          📱 Touch the area above to select photos
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;