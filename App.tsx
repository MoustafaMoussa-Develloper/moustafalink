import React, { useState, useEffect } from 'react';
import { AppSection, ImageAsset } from './types';
import { NAV_ITEMS } from './constants';
import { Menu, X, Camera } from 'lucide-react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ImageEditor from './components/ImageEditor';
import AiGenerator from './components/AiGenerator';

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<ImageAsset | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load from local storage on mount (optional mock persistence)
  useEffect(() => {
    const saved = localStorage.getItem('mustafa_app_images');
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load images");
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('mustafa_app_images', JSON.stringify(images));
  }, [images]);

  const handleSaveImage = (img: ImageAsset) => {
    setImages(prev => [img, ...prev]);
    // Optional: Switch to gallery or stay? Let's stay to show success or maybe show toast.
  };

  const handleEditSelect = (img: ImageAsset) => {
    setSelectedImageForEdit(img);
    setActiveSection(AppSection.EDITOR);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
       setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.HOME:
        return <Hero onNavigate={setActiveSection} />;
      case AppSection.GALLERY:
        return <Gallery images={images} onSelectForEdit={handleEditSelect} onDelete={handleDelete} />;
      case AppSection.EDITOR:
        return <ImageEditor initialImage={selectedImageForEdit} onSave={handleSaveImage} />;
      case AppSection.GENERATOR:
        return <AiGenerator onSave={handleSaveImage} />;
      default:
        return <Hero onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-right" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => setActiveSection(AppSection.HOME)}
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none">مصطفى</h1>
                <span className="text-xs text-primary-600 font-medium tracking-wide">للإبداع الرقمي</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1 bg-gray-100/50 p-1.5 rounded-2xl">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as AppSection);
                      if (item.id !== 'EDITOR') setSelectedImageForEdit(null);
                    }}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-white text-primary-600 shadow-md shadow-gray-200' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg p-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as AppSection);
                      setIsMobileMenuOpen(false);
                      if (item.id !== 'EDITOR') setSelectedImageForEdit(null);
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            تم التطوير بواسطة <span className="font-bold text-gray-800">مصطفى</span> © {new Date().getFullYear()}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            مدعوم بواسطة Google Gemini 2.5
          </p>
        </div>
      </footer>
    </div>
  );
}