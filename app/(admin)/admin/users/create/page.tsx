import React from 'react'
import UserCreateForm from "@/components/admin/users/user-create-form";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata= { title: "User" }

const UserCreatePage = async () => {
  await requireAdmin();

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="User" subtitle="create" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Create New User</h4>
                            </div>
                            <div className="card-body">
                                <UserCreateForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default UserCreatePage;