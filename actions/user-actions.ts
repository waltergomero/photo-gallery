'use server';

import {
  signInFormSchema,
  signUpFormSchema,
  updateUserFormSchema
} from '@/schemas/validation-schemas';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcryptjs from "bcryptjs";
import  prisma  from '@/prisma/prisma';
import { formatError } from '@/lib/utils';
import { z } from 'zod';
import { PAGE_SIZE } from '@/lib/constants';



// Sign in the user with credentials
export async function signInWithCredentials(  prevState,  formData) {
  try {
    // Validate form data against the sign-in schema
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    //search for the user in the database
    const dbUser = await prisma.User.findUnique({
      where: { email: user.email },
    });
    console.log('DB User:', dbUser);

    if (!dbUser) {
      return { success: false, message: `User with email: ${user.email} not found ` };
    }
    else{
      const isPasswordValid = await bcryptjs.compare(user.password, dbUser.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password. Please try again.' };
      }
    }

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Invalid email or password' };
  }
}

// Sign user out
export async function signOutUser() {
  console.log('Signing out user');
  await signOut();
  console.log('User signed out successfully');
}

// Sign up user
export async function signUpUser(prevState, formData) {
  try {
    console.log('Signing up user with form data:', formData);
    const user = signUpFormSchema.parse({
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });
    console.log('Parsed user data:', user);
    // Check if user already exists
    const existingUser = await prisma.User.findUnique({
      where: { email: user.email },
    });

    console.log('Existing user:', existingUser);
    if (existingUser) {
      return { success: false, message: `User with email ${user.email} already exists` };
    }
    else{
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(user.password, salt);

        await prisma.user.create({
          data: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: hashedPassword,
          },
        });

        await signIn('credentials', {
          email: user.email,
          password: user.password,
        });

        return { success: true, message: 'User registered successfully' };
      }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Get user by the ID
export async function getUserById(userId) {
  const user = await prisma.User.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Get all the users
export async function getAllUsers({  limit = PAGE_SIZE,  page,  query,}) {
  const queryFilter =
    query && query !== 'all'
      ? {
          last_name: {
            contains: query,
            mode: 'insensitive',
          } ,
        }
      : {};

  const data = await prisma.User.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.User.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id) {
  try {
    await prisma.User.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(formData) {
  try {
      const first_name = formData.get("first_name");
      const last_name = formData.get("last_name");
      const name = `${first_name}  ${last_name}`;
      const email = formData.get("email");
      const isadmin = Boolean(formData.get("isadmin"));
      const isactive = Boolean(formData.get("isactive"));
      const userId = formData.get("userid");

        const validatedFields = updateUserFormSchema.safeParse({
          first_name,
          last_name,
          email,
          isactive,
          isadmin
        });

        if (!validatedFields.success) {
          return {
            error: "validation",
            zodErrors: validatedFields.error.flatten().fieldErrors,
            strapiErrors: null,
            message: "Missing information on key fields.",
          };
        }
    const user = await prisma.User.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    // Update the user data
    const updatedUser = {
      first_name,
      last_name,
      name:  name,
      isadmin,
      isactive,
    };

    await prisma.User.update({
      where: { id: user.id },
      data: updatedUser,
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
