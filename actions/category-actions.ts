'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { categorySchema} from "@/lib/schema-validators";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';
import { PAGE_SIZE } from '@/lib/constants';

// Get all the categories
export async function getAllCategories({  limit = PAGE_SIZE,  page,  query,}) {
  const queryFilter =
    query && query !== 'all'
      ? {
          category_name: {
            contains: query,
            mode: 'insensitive',
          } ,
        }
      : {};

  const data = await prisma.Category.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { category_name: 'asc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.Category.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// fetch all categories
export const fetchCategories = async () => { 
    try {
        const _categories = await prisma.Category.findMany({
        orderBy: { category_name: 'asc' },
        select: {
            id: true,
            category_name: true,
        },
        });
        const categories = JSON.parse(JSON.stringify(_categories));
        return categories;
    } catch (err) {
        return({error: err + "Failed to fetch categories!"});
    }
}

// fetch all categories
export const fetchAllCategories = async () => { 
    try {
        const _categories = await prisma.Category.findMany({
        orderBy: { category_name: 'asc' },
        });
        const categories = JSON.parse(JSON.stringify(_categories));
        return categories;
    } catch (err) {
        return({error: err + "Failed to fetch categories!"});
    }
}

  //get category data by ID
  export const fetchCategoryById = async (id) => {
    try {
      const _category = await prisma.Category.findUnique({
        where: {id: id},
        });
      const category = JSON.parse(JSON.stringify(_category));
      return category
    } catch (err) {
      return({error: err + "Failed to fetch category!"});
    }
  };


export async function createCategory(formData) {
  noStore();
  try {
    console.log("Form data received in createCategory:", formData);
    const category_name = formData.get("category_name");
    const description = formData.get("description");

    const validatedFields = categorySchema.safeParse({
      category_name
    });

    if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if category already exists
    const existingCategory = await prisma.Category.findFirst({
      where: { category_name: category_name },
    });

    if (existingCategory) {
      return {
        error: "already_exists",
        message: `Category ${category_name} already exists.`,
      };
    };
    const newCategory = {
      category_name: category_name,
      description: description,
    };
    //create new category
    console.log("Category data to be created:", newCategory);
    await prisma.Category.create({ data: newCategory });

    return {
      success: true,
      message: 'Category created successfully',
    };


  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

//update category action
export async function updateCategory(formData) {
  noStore();
  try {
    const id = formData.get("id");
    const category_name = formData.get("category_name");
    const isactive = Boolean(formData.get("isactive"));
    const description = formData.get("description");

    const validatedFields = categorySchema.safeParse({category_name});

        if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if category already exists
    const existingCategory = await prisma.Category.findFirst({
      where: { category_name: category_name },
    });

    if (existingCategory) {
      if (existingCategory.id != id) {
        return  {error: "already_exists",
                 message: `Category name "${category_name}"  already exists`};
      }
    }
   const data = {
      category_name: formData.category_name,
      isactive: isactive,
      description: description,
    };
    console.log("Category data to be updated:", data);
    await prisma.Category.update({
      where: { id: id },
      data: data,
    });

    return {
      success: true,
      message: 'Category updated successfully',
    };

  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

//delete category action
export async function deleteCategory(id) {
  noStore();

  try {
    await prisma.Category.delete({ where: { id: id } });
    revalidatePath('/admin/categories');
    redirect('/admin/categories');
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}