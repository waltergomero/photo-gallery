'use client';

import React, { useState, useCallback, useEffect } from 'react'
import { XMarkIcon, ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Compressor from 'compressorjs';
import {fetchCategories} from "@/actions/category-actions";
import {  redirect, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';

interface PreviewImage {
  file: File
  compressedFile: File
  url: string
  id: string
  caption: string
}

const UploadImages = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const userId =   session?.user?.id;

  const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
   const [categoryValue, setCategoryValue] = useState(null);
   const [categoryText, setCategoryText] = useState(null);

  type Category = { id: string | number; category_name: string };
  const [categories, setCategories] = useState<Category[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9)

  useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
       getCategories();
      }, []);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.95,
        maxWidth: 800,
        maxHeight: 600,
        success: (compressedFile) => {
          resolve(compressedFile as File)
        },
        error: (error) => {
          console.error('Compression error:', error)
          // If compression fails, return original file
          resolve(file)
        }
      })
    })
  }

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )

    if (imageFiles.length === 0) return

    setIsCompressing(true)
    
    try {
      const newImages: PreviewImage[] = await Promise.all(
        imageFiles.map(async (file) => {
          const compressedFile = await compressImage(file)
          return {
            file,
            compressedFile,
            url: URL.createObjectURL(compressedFile),
            id: generateId(),
            caption: ''
          }
        })
      )

      setSelectedImages(prev => [...prev, ...newImages])
    } catch (error) {
      console.error('Error processing files:', error)
    } finally {
      setIsCompressing(false)
    }
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileSelect(e.target.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    await handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (id: string) => {
    setSelectedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  const updateCaption = (id: string, caption: string) => {
    setSelectedImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, caption } : img
      )
    )
  }

   const handleClick = (e: any) => {
        e.preventDefault();
        const dropdownName = e.target.options[e.target.selectedIndex].text;
        if(dropdownName){
          setCategoryText(dropdownName);
          setCategoryValue(e.target.value);
        } 
        else{
          setCategoryText(null);
          setCategoryValue(null);
        }
      };

  const clearAllImages = () => {
    selectedImages.forEach(img => URL.revokeObjectURL(img.url))
    setSelectedImages([])
  }

  const handleUpload = async () => {
    if (selectedImages.length === 0) return
    
    if (categoryText === null) {
            toast.error("Please select a category.");
            return;
        }
    

    setIsUploading(true);

    try {
      // TODO: Implement actual upload logic here
      console.log('Uploading images with captions:', selectedImages.map(img => ({
        file: img.file, // Use original file for upload
        caption: img.caption
      })))
      // TODO: Implement actual upload logic here, save images one by one
      const API_PATH = "/api/admin/gallery/";

      for (const img of selectedImages) {
        const extension = img.file.name.substr(img.file.name.lastIndexOf(".") + 1);

        const formData = new FormData()
        formData.append('image', img.file)
        formData.append('extension', extension)
        formData.append('caption', img.caption)
        formData.append("categoryId", categoryValue ?? "");
        formData.append("category_name", categoryText ?? "");
        formData.append("userId", userId ?? "");

        const response = await fetch(API_PATH, {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        console.log('Upload response:', data)
        if (!response.ok) throw new Error(data.message || 'Upload failed')
      }

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Clear images after successful upload
      clearAllImages();
       router.push(`/admin/gallery/category/${categoryText}`);
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.url))
    }
  }, [])

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
            <div className="mb-3 col-md-2">
            <label htmlFor="category" className="form-label">Select Category: </label>
            <select
                name="category_id"
                onClick={handleClick}
                required
                className="form-select">
                <option value=""></option>
                {categories.map((category) => (
                <option key={category.id} value={category.id}>
                    {category.category_name}
                </option>
                ))}
            </select>
            </div>
              <div
                className={`border rounded text-center mb-4 ${
                  isDragOver 
                    ? 'border-primary bg-light' 
                    : 'border-2'
                }`}
                style={{ 
                  borderStyle: 'dashed',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <PhotoIcon style={{ width: '48px', height: '48px' }} className="text-muted mb-3" />
                {isCompressing ? (
                  <>
                    <div className="spinner-border text-primary mb-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="text-primary mb-2">
                      Compressing images...
                    </h5>
                  </>
                ) : (
                  <>
                    <h5 className="text-dark mb-2">
                      Drop images here or click to select
                    </h5>
                    <p className="text-muted mb-3">
                      Supports: JPG, JPEG, PNG, GIF, WebP
                    </p>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                  id="file-input"
                  disabled={isCompressing}
                />
                <label
                  htmlFor="file-input"
                  className={`btn d-inline-flex align-items-center ${
                    isCompressing ? 'btn-secondary' : 'btn-primary'
                  }`}
                  style={{ 
                    cursor: isCompressing ? 'not-allowed' : 'pointer',
                    pointerEvents: isCompressing ? 'none' : 'auto'
                  }}
                >
                  <ArrowUpTrayIcon style={{ width: '16px', height: '16px' }} className="me-2" />
                  {isCompressing ? 'Processing...' : 'Choose Images'}
                </label>
              </div>

              {/* Preview Section */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="mb-0">
                      Preview ({selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''})
                      {selectedImages.filter(img => img.caption.trim()).length > 0 && (
                        <small className="text-success ms-2">
                          ({selectedImages.filter(img => img.caption.trim()).length} with captions)
                        </small>
                      )}
                    </h5>
                    <button
                      type="button"
                      onClick={clearAllImages}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Image Grid */}
                  <div className="row mb-2">
                    {selectedImages.map((image) => (
                      <div key={image.id} className="col-md-2 col-sm-3 col-4 mb-1">
                        <div className="card h-100">
                          <div className="position-relative">
                            <div
                              className="card-img-top"
                              style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                overflow: 'hidden',
                                background: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <img
                                src={image.url}
                                alt={image.file.name}
                                className="img-fluid"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="btn btn-danger btn-sm position-absolute"
                              style={{ 
                                top: '8px', 
                                right: '8px',
                                width: '28px',
                                height: '28px',
                                padding: '0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <XMarkIcon style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                          <div className="card-body p-2 mt-2">
                            <div className="mb-0">
                              <textarea
                                className="form-control form-control-sm"
                                placeholder="Enter caption..."
                                value={image.caption}
                                onChange={(e) => updateCaption(image.id, e.target.value)}
                                rows={2}
                                style={{ 
                                  fontSize: '12px',
                                  resize: 'vertical',
                                  minHeight: '38px'
                                }}
                              />
                              {image.caption.length > 0 && (
                                <small className="text-muted" style={{ fontSize: '10px' }}>
                                  {image.caption.length} characters
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload Button */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading || selectedImages.length === 0}
                      className="btn btn-success btn-lg d-inline-flex align-items-center"
                    >
                      {isUploading ? (
                        <>
                          <div 
                            className="spinner-border spinner-border-sm me-2" 
                            role="status" 
                            aria-hidden="true"
                          ></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon style={{ width: '16px', height: '16px' }} className="me-2" />
                          Upload {selectedImages.length} Image{selectedImages.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadImages