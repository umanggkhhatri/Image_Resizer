# PicSqueeze 🖼️

A modern, mobile-first batch image resizer and compressor web app designed for photographers who want to quickly prepare images for social media.

## ✨ Features

- **📱 Mobile-First Design**: Optimized for touch interaction on phones with responsive desktop layout
- **🎨 Modern UI**: Clean, minimal design with glassmorphism cards and pastel gradients
- **⚡ Fast Processing**: Efficient batch image processing with real-time progress tracking
- **📊 Smart Compression**: Quality slider (60-100%) with preset social media dimensions
- **📦 Batch Download**: Download all processed images as a ZIP file
- **🌙 Dark Mode**: Toggle between light and dark themes
- **🎯 Social Media Presets**: Instagram, Stories, Twitter, Facebook, LinkedIn optimized sizes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
cd picsqueeze
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment on Vercel, Netlify, or any static hosting service.

## 🎨 Design Features

### Visual Style
- **Theme**: Futuristic minimal - Apple Photos meets Google Drive
- **Colors**: White backgrounds with teal and purple gradient accents
- **Typography**: Inter font family for clean, modern text
- **Icons**: Lucide React icons for consistent iconography
- **Animations**: Smooth Framer Motion transitions and micro-interactions

### Mobile Optimization
- Touch-friendly drag-and-drop area
- Sticky bottom action bar on mobile
- Responsive grid layouts
- Optimized for one-handed use

## 🔧 Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Image Processing**: Canvas API + browser-image-compression
- **File Handling**: JSZip for ZIP downloads
- **Icons**: Lucide React

## 📋 Usage Guide

### 1. Upload Images
- Drag and drop multiple images onto the upload area
- Or click/tap to select images from your device
- Supports JPG, PNG, GIF, and WebP formats

### 2. Configure Settings
- **Preset**: Choose from social media optimized sizes
- **Quality**: Adjust compression level (60-100%)
- **Custom Size**: Set your own dimensions if needed

### 3. Process Images
- Click "Resize & Compress" to start processing
- Watch real-time progress for each image
- View space saved and compression ratio

### 4. Download Results
- Download individual processed images
- Or download all images as a ZIP file
- Files are automatically named with timestamps

## 🎯 Social Media Presets

| Platform | Dimensions | Use Case |
|----------|------------|----------|
| Instagram Post | 1080×1080 | Square posts |
| Instagram Story | 1080×1920 | Vertical stories |
| Twitter/X | 1200×675 | Landscape posts |
| Facebook | 1200×630 | Timeline posts |
| LinkedIn | 1200×627 | Professional posts |

## 🌟 Key Features

### Smart Compression
- Maintains image quality while reducing file size
- Configurable quality settings (60-100%)
- Real-time size comparison

### Batch Processing
- Process multiple images simultaneously
- Individual progress tracking
- Error handling for failed conversions

### User Experience
- Intuitive drag-and-drop interface
- Smooth animations and transitions
- Responsive design for all devices
- Dark mode support

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ImageUploader.jsx
│   ├── ImagePreview.jsx
│   ├── ProcessingToolbar.jsx
│   └── ProgressIndicator.jsx
├── utils/              # Utility functions
│   ├── imageProcessor.js
│   └── downloadUtils.js
├── App.jsx              # Main application
├── main.jsx            # Entry point
└── index.css           # Global styles
```

### Customization
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for additional styles
- Adjust animation settings in components
- Customize social media presets in `ProcessingToolbar.jsx`

## 📱 Mobile Features

- **Touch-optimized**: Large tap targets and gesture support
- **Sticky actions**: Important buttons stay visible while scrolling
- **Responsive grid**: Images adapt to screen size
- **Mobile-first**: Designed for phones, enhanced for desktop

## 🔒 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve PicSqueeze!

## 📄 License

This project is open source and available under the MIT License.

---

**PicSqueeze** - Making image optimization simple, fast, and beautiful. ✨