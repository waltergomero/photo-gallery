import React from 'react'
import StatusTable from "@/components/admin/status/status-table";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { getAllStatus } from '@/actions/status-actions';
import { requireAdmin } from '@/lib/auth-guard';
import { StatusPageProps } from '@/types/status';
import Link from 'next/link';
import {CreateStatusBtn} from '@/components/admin/status/buttons';

export const metadata = { 
  title: "Status Management",
  description: "Manage status records in the photo gallery system"
}

const StatusPage = async ({ searchParams }: StatusPageProps) => {
  await requireAdmin();
  
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const searchText = params.query || '';
  
  const statusData = await getAllStatus({ 
    page, 
    query: searchText 
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Status Management" subtitle="table" />
      <div className="row justify-content-center">
        <div className="col-xxl-9">
          <div className="card">
            <div className="card-header d-flex align-items-center">
              <h4 className="card-title mb-0">Status Records</h4>
              <div className="ms-auto">
                <CreateStatusBtn />
              </div>
            </div>
            <div className="card-body">
              {statusData.data.length > 0 ? (
                <StatusTable status={statusData} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No status records found.</p>
                  <Link href="/admin/status/create" className="btn btn-outline-primary">
                    Create First Status
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StatusPage;