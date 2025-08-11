export interface Status {
  id: string;
  status_name: string;
  description?: string;
  isactive?: boolean;
  typeid: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface StatusTableProps {
  status: {
    data: Status[];
    totalPages: number;
  };
}

export interface StatusPageSearchParams {
  page?: string;
  query?: string;
}

export interface StatusPageProps {
  searchParams: Promise<StatusPageSearchParams>;
}
