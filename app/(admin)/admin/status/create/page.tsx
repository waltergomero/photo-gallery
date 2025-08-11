import React from 'react'
import StatusCreateForm from "@/components/admin/status/status-create-form";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { getAllStatus, deleteStatus } from '@/actions/status-actions';
import { requireAdmin } from '@/lib/auth-guard';


export const metadata= { title: "Status" }


const StatusCreatePage = async (props) => {
  await requireAdmin();

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="Status" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Create New Status</h4>
                            </div>
                            <div className="card-body">
                                <StatusCreateForm/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default StatusCreatePage;