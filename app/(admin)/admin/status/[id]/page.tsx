import React from 'react'
import StatusEditForm from "@/components/admin/status/status-edit-form";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { getStatusById } from '@/actions/status-actions';
import { requireAdmin } from '@/lib/auth-guard';
import { notFound } from 'next/navigation';

export const metadata= { title: "Status" }

const StatusEditPage = async (props:any) => {
    await requireAdmin();
    const { id } = await props.params;
    const status = await getStatusById(id);

     if (!status) notFound();

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="Status" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Update Status Information</h4>
                            </div>
                            <div className="card-body">
                                <StatusEditForm status={status} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default StatusEditPage;