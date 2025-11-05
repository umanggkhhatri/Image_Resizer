import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Sun, Moon, X, Download, Settings, Trash2 } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import ProcessingToolbar from './components/ProcessingToolbar';
import ProgressIndicator from './components/ProgressIndicator';
import { processImages } from './utils/imageProcessor';
import { downloadAsZip } from './utils/downloadUtils';

function App() {
  const [images, setImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    preset: 'instagram',
    quality: 85,
    width: 1080,
    height: 1080
  });

  // Dark mode toggle
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleImageUpload = useCallback((newImages) => {
    const imageObjects = newImages.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      originalSize: file.size
    }));
    
    setImages(prev => [...prev, ...imageObjects]);
  }, []);

  const removeImage = useCallback((id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setProcessedImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const clearAllImages = () => {
    setImages([]);
    setProcessedImages([]);
    setProcessingProgress({});
  };

  const handleProcessImages = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProcessedImages([]);
    setProcessingProgress({});

    try {
      const processed = await processImages(images, settings, (progress) => {
        setProcessingProgress(progress);
      });
      
      setProcessedImages(processed);
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (processedImages.length === 0) return;
    await downloadAsZip(processedImages);
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalProcessedSize = processedImages.reduce((sum, img) => sum + (img.processedSize || 0), 0);
  const sizeSaved = totalOriginalSize - totalProcessedSize;
  const compressionRatio = totalOriginalSize > 0 ? ((sizeSaved / totalOriginalSize) * 100).toFixed(1) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                PicSqueeze
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {images.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllImages}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Clear All</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ImageUploader onImageUpload={handleImageUpload} darkMode={darkMode} />
        </motion.div>

        {/* Processing Toolbar */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 relative z-10"
          >
            <ProcessingToolbar
              settings={settings}
              onSettingsChange={setSettings}
              onProcess={handleProcessImages}
              isProcessing={isProcessing}
              darkMode={darkMode}
            />
          </motion.div>
        )}

        {/* Image Previews */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ImagePreview
                      image={image}
                      processedImage={processedImages.find(p => p.id === image.id)}
                      onRemove={removeImage}
                      darkMode={darkMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Progress Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ProgressIndicator
              progress={processingProgress}
              totalImages={images.length}
              darkMode={darkMode}
            />
          </motion.div>
        )}

        {/* Results Section */}
        {processedImages.length > 0 && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
              darkMode ? 'glass-card-dark' : 'glass-card'
            }`}>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse-subtle"></div>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Space saved</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {(totalOriginalSize / 1024 / 1024).toFixed(1)} MB → {(totalProcessedSize / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {compressionRatio}% reduction ({(sizeSaved / 1024 / 1024).toFixed(1)} MB saved)
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadAll}
              className="gradient-button inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span>Download All as ZIP</span>
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Sticky Mobile Action Bar */}
      {images.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-white/20 dark:border-gray-800/20 lg:hidden">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProcessImages}
              disabled={isProcessing}
              className="flex-1 gradient-button py-3 px-6 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Resize & Compress'}
            </motion.button>
            
            {processedImages.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadAll}
                className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;