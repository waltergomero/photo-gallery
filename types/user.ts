export interface User {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  isadmin: boolean;
  isactive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserTableProps {
  users: {
    data: User[];
    totalPages: number;
  };
}

export interface UsersPageSearchParams {
  page?: string;
  query?: string;
}

export interface UsersPageProps {
  searchParams: Promise<UsersPageSearchParams>;
}
