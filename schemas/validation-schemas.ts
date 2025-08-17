import { z } from 'zod';

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for signing up a user
export const signUpFormSchema = z.object({
    first_name: z.string().min(3, 'First name must be at least 3 characters'),
    last_name: z.string().min(3, 'Last name must be at least 3 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

export const createNewUserFormSchema = z.object({
    first_name: z.string().min(3, 'First name must be at least 3 characters'),
    last_name: z.string().min(3, 'Last name must be at least 3 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    isadmin: z.boolean(),
  });

// Schema for signing up a user
export const updateUserFormSchema = z.object({
    first_name: z.string().min(3, 'First name must be at least 3 characters'),
    last_name: z.string().min(3, 'Last name must be at least 3 characters'),
    email: z.email('Invalid email address'),
    isactive: z.boolean().optional(),
    isadmin: z.boolean().optional(),
  });

  export const categorySchema = z.object({
  category_name: z.string().min(2, { message: 'Category name must be at least 2 characters long' }),
});

  export const statusSchema = z.object({
  status_name: z.string().min(2, { message: 'Status name must be at least 2 characters long' }),
});
