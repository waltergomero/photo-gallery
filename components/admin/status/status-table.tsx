import React from 'react';
import Link from 'next/link';
import { DeleteStatusBtn, UpdateStatusBtn } from './buttons';
import { StatusTableProps, Status } from '@/types/status';

const StatusTable = ({ status }: StatusTableProps) => {
  return (
    <div className="table-responsive">
      <table 
        data-tables="basic" 
        className="table table-striped dt-responsive align-middle mb-0"
        role="table"
        aria-label="Status records table"
      >
        <thead className="thead-sm text-uppercase fs-xxs">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Status Name</th>
            <th scope="col">Description</th>
            <th scope="col">Type ID</th>
            <th scope="col">Is Active?</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {status.data.map((statusItem: Status) => (
            <tr key={statusItem.id}>
              <td>
                <span className="text-muted small">
                  {statusItem.id.slice(0, 8)}...
                </span>
              </td>
              <td>
                <Link 
                  className="link-secondary fw-medium" 
                  href={`/admin/status/${statusItem.id}`}
                  title={`View details for ${statusItem.status_name}`}
                >
                  {statusItem.status_name}
                </Link>
              </td>
              <td>
                <span className="text-muted">
                  {statusItem.description || 'No description'}
                </span>
              </td>
              <td>
                  {statusItem.typeid}
              </td>
              <td>
                  {statusItem.isactive ? 'Yes' : 'No'}
              </td>
              <td>
                <div className="d-flex gap-2 align-items-center">
                  <UpdateStatusBtn id={statusItem.id} />
                  <DeleteStatusBtn id={statusItem.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {status.totalPages > 1 && (
        <div className="mt-3 d-flex justify-content-center">
          <nav aria-label="Status table pagination">
            <p className="text-muted small mb-0">
              Showing {status.data.length} records across {status.totalPages} pages
            </p>
          </nav>
        </div>
      )}
    </div>
  );
};

export default StatusTable