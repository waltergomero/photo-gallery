'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { statusSchema} from "@/schemas/validation-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import  prisma  from '@/prisma/prisma';
import { PAGE_SIZE } from '@/lib/constants';

// Function to generate an array of numbers from 0 to 10
export async function getNumbersArray() {
  return await Array.from({ length: 11 }, (_, i) => i);
}

// Get all the statuses with improved error handling
export async function getAllStatus({ 
  limit = PAGE_SIZE, 
  page = 1, 
  query 
}: {
  limit?: number;
  page?: number;
  query?: string;
}) {
  try {
    const queryFilter =
      query && query !== 'all' && query.trim() !== ''
        ? {
            OR: [
              {
                status_name: {
                  contains: query.trim(),
                  mode: 'insensitive' as const,
                },
              },
              {
                description: {
                  contains: query.trim(),
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {};

    const [data, dataCount] = await Promise.all([
      prisma.Status.findMany({
        where: queryFilter,
        orderBy: { status_name: 'asc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.Status.count({
        where: queryFilter,
      }),
    ]);

    return {
      data,
      totalPages: Math.ceil(dataCount / limit),
      totalCount: dataCount,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw new Error('Failed to fetch status records');
  }
}

// fetch all statuses
export const fetchAllStatuses = async () => {
    try {
        const _statuses = await prisma.Status.findMany({
        orderBy: { status_name: 'asc' },
        });
        const statuses = JSON.parse(JSON.stringify(_statuses));
        return statuses;
    } catch (err) {
        return({error: err + "Failed to fetch statuses!"});
    }
}

  //get status data by ID
  export const getStatusById = async (id: string) => {
    try {
      const _status = await prisma.Status.findUnique({
        where: {id: id},
        });
      const status = JSON.parse(JSON.stringify(_status));
      return status
    } catch (err) {
      return({error: err + "Failed to fetch status!"});
    }
  };


export async function createStatus(formData: FormData) {
  noStore();
  try {
    console.log("Form data received in createStatus:", formData);
    const status_name = formData.get("status_name");
    const description = formData.get("description");
    const typeid = Number(formData.get("typeid"));

    const validatedFields = statusSchema.safeParse({
      status_name,
    });

    if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if status name, with same type id but with different status name already exists
    const existingStatus = await prisma.Status.findFirst({
      where: { 
        status_name: status_name,
        typeid: typeid,
      },
    });
    if (existingStatus) {
      return {
        error: "already_exists",
        message: `Status name "${status_name}" already exists for type "${typeid}"`,
      };
    }
    
    const newStatus = {
      status_name: status_name,
      description: description,
      typeid: typeid,
    };
    //create new status
    console.log("Status data to be created:", newStatus);
    await prisma.Status.create({ data: newStatus });

    return {
      success: true,
      message: 'Status created successfully',
    };


  } catch (error) {
    console.error('Error creating status:', error);
    throw error;
  }
}

//update status action
export async function updateStatus(formData: FormData) {
  noStore();
  try {
    const id = formData.get("id");
    const status_name = formData.get("status_name");
    const isactive = Boolean(formData.get("isactive"));
    const description = formData.get("description");
    const typeid = Number(formData.get("typeid"));

    const validatedFields = statusSchema.safeParse({status_name});

    if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    //check if status already exists
    const existingStatus = await prisma.Status.findFirst({
      where: { status_name: status_name, typeid: typeid },
    });

    if (existingStatus) {
      if (existingStatus.id != id) {
        return  {error: "already_exists",
                 message: `Status "${status_name}" with type ID "${typeid}" already exists`}; 
      }
    }
   const data = {
      status_name: status_name,
      isactive: isactive,
      description: description,
      typeid: typeid,
    };
    console.log("Status data to be updated:", data);
    await prisma.Status.update({
      where: { id: id },
      data: data,
    });

    return {
      success: true,
      message: 'Status updated successfully',
    };

  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}

//delete status action
export async function deleteStatus(id: string) {
  noStore();

  try {
    await prisma.Status.delete({ where: { id: id } });
    revalidatePath('/admin/status');
    redirect('/admin/status');
  } catch (error) {
    console.error('Error deleting status:', error);
    throw error;
  }
}