import React from 'react'
import CategoryTable from "@/components/admin/categories/category-table";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { getAllCategories, } from '@/actions/category-actions';
import { requireAdmin } from '@/lib/auth-guard';
import { CategoryPageProps } from '@/types';
import Link from 'next/link';

export const metadata = { title: "Categories" }

const CategoryPage = async (props: CategoryPageProps) => {
  await requireAdmin();
  
  const { page = '1', query: searchText } = await props.searchParams;
  
  try {
    const categories = await getAllCategories({ 
      page: Number(page), 
      query: searchText 
    });

    return (
        <div className="container-fluid">
            <PageBreadcrumb title="Categories" subtitle="table" />
             <div className="row justify-content-center">
                <div className="col-xxl-10">
                    <div className="card">
                        <div className="card-header d-flex align-items-center">
                            <h4 className="card-title mb-0">Categories Table</h4>
                            <div className="ms-auto">
                                <Link 
                                    href="/admin/categories/create" 
                                    className="btn btn-primary"
                                    aria-label="Create new category"
                                >
                                    Create Category
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            {categories.data.length > 0 ? (
                                <CategoryTable categories={categories}/>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No categories found.</p>
                                    <Link 
                                        href="/admin/categories/create" 
                                        className="btn btn-primary"
                                    >
                                        Create Your First Category
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    return (
        <div className="container-fluid">
            <PageBreadcrumb title="Categories" subtitle="table" />
            <div className="row justify-content-center">
                <div className="col-xxl-10">
                    <div className="card">
                        <div className="card-body text-center py-4">
                            <p className="text-danger">Failed to load categories. Please try again later.</p>
                            <Link href="/admin/categories" className="btn btn-primary">
                                Retry
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}
export default CategoryPage;