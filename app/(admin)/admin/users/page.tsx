import React from 'react'
import UserTable from "@/components/admin/users/user-table";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { getAllUsers } from '@/actions/user-actions';
import { requireAdmin } from '@/lib/auth-guard';
import { StatusPageProps } from '@/types/status';
import Link from 'next/link';
import {CreateUserBtn} from '@/components/admin/users/buttons';

export const metadata = { 
  title: "Status Management",
  description: "Manage status records in the photo gallery system"
}

const StatusPage = async ({ searchParams }: StatusPageProps) => {
  await requireAdmin();
  
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const searchText = params.query || '';

  const usersData = await getAllUsers({ 
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
                <CreateUserBtn />
              </div>
            </div>
            <div className="card-body">
              {usersData.data.length > 0 ? (
                <UserTable users={usersData} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No users found.</p>
                  <Link href="/admin/users/create" className="btn btn-outline-primary">
                    Create User
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