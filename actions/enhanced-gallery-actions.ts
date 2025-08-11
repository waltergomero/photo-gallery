// Enhanced gallery actions with better error handling, pagination, and caching

'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/prisma/prisma';
import { UserImage, ApiResponse, PaginationParams, GalleryFilters } from '@/types/gallery';
import fs from 'fs/promises';
import path from 'path';

// Enhanced fetch with pagination and filtering
export async function fetchImagesPaginated(
  params: PaginationParams,
  filters: GalleryFilters = {}
): Promise<ApiResponse<{ images: UserImage[]; total: number; pages: number }>> {
  try {
    noStore();

    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const whereClause: any = {
      isactive: true,
      ...(filters.category && filters.category !== 'All' && filters.category !== '0' && {
        category_name: {
          equals: filters.category,
          mode: 'insensitive'
        }
      }),
      ...(filters.orientation && {
        format: filters.orientation
      }),
      ...(filters.isBlackWhite !== undefined && {
        isblackwhite: filters.isBlackWhite
      })
    };

    // Get total count for pagination
    const total = await prisma.userImages.count({ where: whereClause });

    // Fetch images with pagination
    const images = await prisma.userImages.findMany({
      where: whereClause,
      select: {
        id: true,
        src: true,
        caption: true,
        categoryId: true,
        category_name: true,
        width: true,
        height: true,
        format: true,
        isactive: true,
        createdAt: true,
        updatedAt: true,
        isblackwhite: true
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    });

    const pages = Math.ceil(total / limit);

    return {
      data: {
        images: JSON.parse(JSON.stringify(images)),
        total,
        pages
      },
      success: true
    };

  } catch (error) {
    console.error('Error fetching paginated images:', error);
    return {
      error: `Failed to fetch images: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false
    };
  }
}

// Enhanced category fetching with image counts
export async function fetchCategoriesWithCounts(): Promise<ApiResponse<Array<{ categoryId: string; category_name: string; imageCount: number }>>> {
  try {
    const categories = await prisma.userImages.groupBy({
      by: ['categoryId', 'category_name'],
      where: {
        isactive: true
      },
      _count: {
        id: true
      },
      orderBy: {
        category_name: 'asc'
      }
    });

    const formattedCategories = [
      { categoryId: "0", category_name: "All", imageCount: 0 },
      ...categories.map(cat => ({
        categoryId: cat.categoryId,
        category_name: cat.category_name || 'Uncategorized',
        imageCount: cat._count.id
      }))
    ];

    // Calculate total for "All" category
    const totalImages = categories.reduce((sum, cat) => sum + cat._count.id, 0);
    formattedCategories[0].imageCount = totalImages;

    return {
      data: formattedCategories,
      success: true
    };

  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    return {
      error: `Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false
    };
  }
}

// Enhanced image deletion with proper file cleanup
export async function deleteImageSafely(imageId: string): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    // First, get the image details
    const image = await prisma.userImages.findUnique({
      where: { id: imageId },
      select: { src: true, id: true }
    });

    if (!image) {
      return {
        error: 'Image not found',
        success: false
      };
    }

    // Delete from database first
    await prisma.userImages.delete({
      where: { id: imageId }
    });

    // Then attempt to delete the file
    try {
      const imagePath = path.join(process.cwd(), 'public', image.src);
      await fs.unlink(imagePath);
      console.log('File deleted successfully:', imagePath);
    } catch (fileError) {
      console.warn('File deletion failed (file may not exist):', fileError);
      // Don't fail the operation if file deletion fails
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/');

    return {
      data: { deleted: true },
      success: true,
      message: 'Image deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      error: `Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false
    };
  }
}

// Enhanced image visibility toggle with transaction
export async function toggleImageVisibility(
  imageId: string, 
  isVisible: boolean, 
  userEmail: string
): Promise<ApiResponse<{ updated: boolean }>> {
  try {
    await prisma.$transaction(async (tx) => {
      // Update the image visibility
      const updatedImage = await tx.userImages.update({
        where: { id: imageId },
        data: { isactive: isVisible },
        select: {
          id: true,
          categoryId: true,
          category_name: true,
          src: true,
          width: true,
          height: true,
          caption: true
        }
      });

      // If making visible and it's a featured category, update homepage
      if (isVisible && updatedImage) {
        // Check if this category should be featured on homepage
        const categoryExists = await tx.userImages.findFirst({
          where: {
            categoryId: updatedImage.categoryId,
            isactive: true,
            format: 'landscape'
          },
          orderBy: { createdAt: 'desc' }
        });

        if (categoryExists) {
          // Update or create homepage category entry
          await tx.userImages.upsert({
            where: { 
              // Use a unique constraint or composite key here
              id: updatedImage.id 
            },
            update: {
              isactive: true,
              updatedAt: new Date()
            },
            create: {
              userId: updatedImage.id, // This needs proper user ID
              categoryId: updatedImage.categoryId,
              category_name: updatedImage.category_name,
              src: updatedImage.src,
              width: updatedImage.width,
              height: updatedImage.height,
              format: 'landscape',
              isactive: true,
              caption: updatedImage.caption
            }
          });
        }
      }
    });

    revalidatePath('/admin/gallery');
    revalidatePath('/');

    return {
      data: { updated: true },
      success: true,
      message: `Image ${isVisible ? 'made visible' : 'hidden'} successfully`
    };

  } catch (error) {
    console.error('Error toggling image visibility:', error);
    return {
      error: `Failed to update image visibility: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false
    };
  }
}

// Search functionality
export async function searchImages(
  searchTerm: string,
  limit: number = 20
): Promise<ApiResponse<UserImage[]>> {
  try {
    noStore();

    const images = await prisma.userImages.findMany({
      where: {
        AND: [
          { isactive: true },
          {
            OR: [
              {
                caption: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                category_name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        src: true,
        caption: true,
        categoryId: true,
        category_name: true,
        width: true,
        height: true,
        format: true,
        isactive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return {
      data: JSON.parse(JSON.stringify(images)),
      success: true
    };

  } catch (error) {
    console.error('Error searching images:', error);
    return {
      error: `Failed to search images: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false
    };
  }
}
