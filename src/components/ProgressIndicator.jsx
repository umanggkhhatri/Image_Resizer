import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

const ProgressIndicator = ({ progress, totalImages, darkMode }) => {
  const completedImages = Object.values(progress).filter(p => p === 100).length;
  const averageProgress = Object.values(progress).length > 0 
    ? Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / Object.values(progress).length)
    : 0;

  const getStatusIcon = (progressValue) => {
    if (progressValue === 100) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (progressValue > 0) {
      return <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={`rounded-xl p-6 ${
      darkMode ? 'glass-card-dark' : 'glass-card'
    }`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Processing Images
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedImages} of {totalImages} completed
          </span>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${averageProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Overall Progress</span>
          <span>{averageProgress}%</span>
        </div>
      </div>

      {/* Individual Image Progress */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {Object.entries(progress).map(([imageId, progressValue], index) => (
          <motion.div
            key={imageId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-white/30 dark:bg-gray-800/30"
          >
            {getStatusIcon(progressValue)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Image {parseInt(index) + 1}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                  {progressValue}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Animation */}
      {completedImages === totalImages && totalImages > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mt-4 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 dark:text-green-400 font-medium">
              All images processed successfully!
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressIndicator;