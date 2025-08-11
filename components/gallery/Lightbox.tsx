'use client';

import { useState, useCallback, useEffect } from 'react';
import { UserImage } from '@/types/gallery';

interface LightboxProps {
  images: UserImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onPrevious?.();
        break;
      case 'ArrowRight':
        onNext?.();
        break;
    }
  }, [isOpen, onClose, onNext, onPrevious]);

  // Add keyboard event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {onPrevious && currentIndex > 0 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60"
          aria-label="Previous image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {onNext && currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60"
          aria-label="Next image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div className="relative max-w-4xl max-h-screen w-full h-full flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <img
          src={currentImage.src}
          alt={currentImage.caption || `Gallery image ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>

      {/* Image info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <h2 id="lightbox-title" className="text-white text-xl font-semibold mb-2">
            {currentImage.caption || `Image ${currentIndex + 1}`}
          </h2>
          
          <div className="flex items-center justify-between text-white/80 text-sm">
            <div className="flex items-center space-x-4">
              {currentImage.category_name && (
                <span className="bg-white/20 px-2 py-1 rounded">
                  {currentImage.category_name}
                </span>
              )}
              <span>{currentImage.width} × {currentImage.height}</span>
            </div>
            
            <span>{currentIndex + 1} / {images.length}</span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip for mobile */}
      <div className="absolute bottom-20 left-0 right-0 md:hidden">
        <div className="flex justify-center space-x-2 px-4 overflow-x-auto">
          {images.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, index) => {
            const actualIndex = Math.max(0, currentIndex - 2) + index;
            return (
              <button
                key={image.id}
                onClick={() => {
                  // Navigate to this image
                  const diff = actualIndex - currentIndex;
                  if (diff > 0 && onNext) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else if (diff < 0 && onPrevious) {
                    for (let i = 0; i < Math.abs(diff); i++) onPrevious();
                  }
                }}
                className={`w-12 h-12 rounded overflow-hidden border-2 ${
                  actualIndex === currentIndex ? 'border-white' : 'border-white/30'
                }`}
              >
                <img
                  src={image.src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
