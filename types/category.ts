export interface Category {
  id: number;
  category_name: string;
  description: string | null;
  isactive: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryTableProps {
  categories: {
    data: Category[];
    totalPages: number;
  };
}

export interface CategoryPageSearchParams {
  page?: string;
  query?: string;
}

export interface CategoryPageProps {
  searchParams: Promise<CategoryPageSearchParams>;
}

export interface GetAllCategoriesParams {
  limit?: number;
  page: number;
  query?: string;
}
