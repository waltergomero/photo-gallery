'use client';

import { useState, useCallback, useMemo } from 'react';
import { UserImage, GalleryFilters, PaginationParams } from '@/types/gallery';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface GalleryGridProps {
  images: UserImage[];
  loading?: boolean;
  onImageClick?: (image: UserImage) => void;
  columns?: 2 | 3 | 4;
  showCaptions?: boolean;
}

export default function GalleryGrid({
  images,
  loading = false,
  onImageClick,
  columns = 3,
  showCaptions = true
}: GalleryGridProps) {
  const { handleError } = useErrorHandler();
  
  const gridCols = useMemo(() => {
    const colMap = {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4'
    };
    return colMap[columns];
  }, [columns]);

  const handleImageError = useCallback((image: UserImage) => {
    handleError(`Failed to load image: ${image.caption || 'Unknown'}`, 'GalleryGrid');
  }, [handleError]);

  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-4`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
        <p className="text-gray-500 text-center max-w-sm">
          There are no images in this category yet. Check back later or try a different filter.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onImageClick?.(image)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.caption || `Gallery image ${index + 1}`}
            width={400}
            height={400}
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>

          {/* Caption */}
          {showCaptions && image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white text-sm truncate">{image.caption}</p>
            </div>
          )}

          {/* Category badge */}
          {image.category_name && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {image.category_name}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
