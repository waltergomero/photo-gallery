// Security utilities and middleware

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import { headers } from 'next/headers';

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limits
export const apiLimiter = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const uploadLimiter = createRateLimit(60 * 60 * 1000, 10); // 10 uploads per hour
export const deleteLimiter = createRateLimit(60 * 60 * 1000, 50); // 50 deletes per hour

// Input validation and sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'%;()&+]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF files are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.'
    };
  }

  return { valid: true };
}

// Admin access control
export async function requireAdmin(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Type assertion since we know the user structure
  const user = session.user as any;
  if (!user.isadmin) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  return null; // No redirect needed
}

// CSRF protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length >= 20;
}

// Content Security Policy headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: https:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// File path validation to prevent directory traversal
export function validateFilePath(filePath: string): boolean {
  const normalizedPath = path.normalize(filePath);
  
  // Check for directory traversal attempts
  if (normalizedPath.includes('..') || normalizedPath.startsWith('/')) {
    return false;
  }

  // Only allow specific directories
  const allowedPrefixes = ['images/', 'uploads/', 'gallery/'];
  return allowedPrefixes.some(prefix => normalizedPath.startsWith(prefix));
}

// Image processing security
export function sanitizeImageMetadata(metadata: any): any {
  // Remove potentially sensitive EXIF data
  const safeMeta = {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    // Don't include GPS, camera, or other sensitive data
  };
  
  return safeMeta;
}

// Database query validation
export function validatePaginationParams(params: any): {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
} {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 12)); // Cap at 100
  
  const allowedSortFields = ['createdAt', 'updatedAt', 'category_name', 'width', 'height'];
  const sortBy = allowedSortFields.includes(params.sortBy) ? params.sortBy : 'createdAt';
  
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
  
  return { page, limit, sortBy, sortOrder };
}
