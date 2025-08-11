import React from 'react'
import CategoryEditForm from "@/components/admin/categories/category-edit-form";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { fetchCategoryById } from '@/actions/category-actions';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata= { title: "Categories" }

const CategoryEditPage = async (props) => {
    await requireAdmin();
    const { id } = await props.params;
    const category = await fetchCategoryById(id);

     if (!category) notFound();

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="Categories" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Categories Table</h4>
                            </div>
                            <div className="card-body">
                                <CategoryEditForm category={category} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default CategoryEditPage;