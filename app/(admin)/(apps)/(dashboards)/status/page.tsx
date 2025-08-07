import React from 'react'
import StatusTable from "@/components/admin/status/status-table";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { getAllStatus, deleteStatus } from '@/actions/status-actions';
import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';


export const metadata= { title: "Status" }


const StatusPage = async (props:any) => {
  await requireAdmin();
  const { page = '1', query: searchText } = await props.searchParams;
  const status = await getAllStatus({ page: Number(page), query: searchText });

    return (
            <div className="container-fluid">
                <PageBreadcrumb title="Status" subtitle="table" />
                 <div className="row justify-content-center">
                    <div className="col-xxl-10">
                        <div className="card">
                            <div className="card-header d-flex align-items-center">
                                <h4 className="card-title mb-0">Status Table</h4>
                                <div className="ms-auto">
                                    <Link href="/status/create" className="btn btn-secondary">Create Status</Link>
                                </div>
                            </div>
                            <div className="card-body">
                                <StatusTable status={status}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
)
}
export default StatusPage;