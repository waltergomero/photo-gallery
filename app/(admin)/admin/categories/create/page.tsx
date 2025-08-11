import React from 'react'
import CategoryCreateForm from "@/components/admin/categories/category-create-form";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata= { title: "Categories" }


const CategoryCreatePage = async (props) => {
  await requireAdmin();

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
                                <CategoryCreateForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default CategoryCreatePage;