import React from 'react'
import UserEditForm from "@/components/admin/users/user-edit-form";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { requireAdmin } from '@/lib/auth-guard';
import { notFound } from 'next/navigation';
import { getUserById } from '@/actions/user-actions';

export const metadata= { title: "User" }

const UserEditPage = async (props:any) => {
    await requireAdmin();
    const { id } = await props.params;
    const user = await getUserById(id);

     if (!user) notFound();

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="User" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Update User Information</h4>
                            </div>
                            <div className="card-body">
                                <UserEditForm user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default UserEditPage;