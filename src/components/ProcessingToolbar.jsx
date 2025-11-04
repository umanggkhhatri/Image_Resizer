import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, Sliders, Zap } from 'lucide-react';

const ProcessingToolbar = ({ settings, onSettingsChange, onProcess, isProcessing, darkMode }) => {
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const presets = [
    {
      id: 'instagram',
      name: 'Instagram Post',
      width: 1080,
      height: 1080,
      icon: '📷',
      description: 'Square format for Instagram posts'
    },
    {
      id: 'story',
      name: 'Instagram Story',
      width: 1080,
      height: 1920,
      icon: '📱',
      description: 'Vertical format for Instagram stories'
    },
    {
      id: 'twitter',
      name: 'Twitter Post',
      width: 1200,
      height: 675,
      icon: '🐦',
      description: 'Landscape format for Twitter/X posts'
    },
    {
      id: 'facebook',
      name: 'Facebook Post',
      width: 1200,
      height: 630,
      icon: '👥',
      description: 'Landscape format for Facebook posts'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Post',
      width: 1200,
      height: 627,
      icon: '💼',
      description: 'Professional format for LinkedIn posts'
    },
    {
      id: 'custom',
      name: 'Custom Size',
      width: 0,
      height: 0,
      icon: '⚙️',
      description: 'Set your own dimensions'
    }
  ];

  const currentPreset = presets.find(p => p.id === settings.preset) || presets[0];

  const handlePresetSelect = (preset) => {
    onSettingsChange({
      ...settings,
      preset: preset.id,
      width: preset.width,
      height: preset.height
    });
    setIsPresetOpen(false);
  };

  const handleQualityChange = (e) => {
    onSettingsChange({
      ...settings,
      quality: parseInt(e.target.value)
    });
  };

  const handleCustomDimensionChange = (dimension, value) => {
    const numValue = parseInt(value) || 0;
    onSettingsChange({
      ...settings,
      [dimension]: numValue,
      preset: 'custom'
    });
  };

  return (
    <div className={`rounded-xl p-4 sm:p-6 ${
      darkMode ? 'glass-card-dark' : 'glass-card'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        
        {/* Preset Dropdown */}
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Size Preset
          </label>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPresetOpen(!isPresetOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-800/70 text-white' 
                : 'bg-white/50 border-gray-300 hover:bg-white/70 text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{currentPreset.icon}</span>
              <div className="text-left">
                <div className="font-medium">{currentPreset.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentPreset.width} × {currentPreset.height}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${
              isPresetOpen ? 'rotate-180' : ''
            }`} />
          </motion.button>
          
          <AnimatePresence>
            {isPresetOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border z-20 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                {presets.map((preset) => (
                  <motion.button
                    key={preset.id}
                    whileHover={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                    onClick={() => handlePresetSelect(preset)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      preset.id === settings.preset 
                        ? (darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-700')
                        : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')
                    }`}
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {preset.description}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {preset.width} × {preset.height}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quality Slider */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quality: {settings.quality}%
          </label>
          <div className="flex items-center space-x-3">
            <Sliders className="w-5 h-5 text-gray-400" />
            <input
              type="range"
              min="60"
              max="100"
              value={settings.quality}
              onChange={handleQualityChange}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(settings.quality - 60) / 0.4}%, ${darkMode ? '#374151' : '#e5e7eb'} ${(settings.quality - 60) / 0.4}%, ${darkMode ? '#374151' : '#e5e7eb'} 100%)`
              }}
            />
            <div className="flex space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <span>60</span>
              <span>100</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Smaller size</span>
            <span>Better quality</span>
          </div>
        </div>

        {/* Custom Dimensions */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Size
            </label>
            <button
              onClick={() => setIsCustomOpen(!isCustomOpen)}
              className="text-primary-500 hover:text-primary-600"
            >
              <Settings className={`w-4 h-4 transition-transform ${
                isCustomOpen ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
          
          <AnimatePresence>
            {isCustomOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Width"
                    value={settings.width || ''}
                    onChange={(e) => handleCustomDimensionChange('width', e.target.value)}
                    className={`flex-1 px-3 py-2 rounded border text-sm ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <span className="flex items-center text-gray-500 dark:text-gray-400">×</span>
                  <input
                    type="number"
                    placeholder="Height"
                    value={settings.height || ''}
                    onChange={(e) => handleCustomDimensionChange('height', e.target.value)}
                    className={`flex-1 px-3 py-2 rounded border text-sm ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {settings.width} × {settings.height} pixels
          </div>
        </div>
      </div>

      {/* Process Button */}
      <div className="mt-6 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProcess}
          disabled={isProcessing}
          className="gradient-button inline-flex items-center space-x-2 px-8 py-3 text-lg font-semibold rounded-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Resize & Compress</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ProcessingToolbar;