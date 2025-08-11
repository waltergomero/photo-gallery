// Enhanced type definitions for the photo gallery

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  isadmin: boolean;
  isactive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  category_name: string;
  description?: string;
  isactive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserImage {
  id: string;
  userId: string;
  categoryId: string;
  category_name?: string;
  src: string;
  caption?: string;
  format: string;
  width: number;
  height: number;
  isblackwhite?: boolean;
  isactive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface GalleryImage {
  id: string;
  src: string;
  caption?: string;
  categoryId: string;
  category_name: string;
  width: number;
  height: number;
  format: string;
  isactive: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  category?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'category_name';
  sortOrder?: 'asc' | 'desc';
}

export interface ImageUploadData {
  file: File;
  categoryId: string;
  caption?: string;
  userId: string;
}

export interface GalleryFilters {
  category?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  isBlackWhite?: boolean;
  isActive?: boolean;
}

// API Response types
export type FetchImagesResponse = ApiResponse<UserImage[]>;
export type FetchCategoriesResponse = ApiResponse<Category[]>;
export type UploadImageResponse = ApiResponse<UserImage>;
export type DeleteImageResponse = ApiResponse<{ deleted: boolean }>;
