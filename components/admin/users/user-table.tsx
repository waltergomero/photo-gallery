import React from 'react';
import Link from 'next/link';
import { DeleteUserBtn, UpdateUserBtn } from './buttons';
import { UserTableProps, User } from '@/types/user';

const UserTable = ({ users }: UserTableProps) => {
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
            <th scope="col">Last Name</th>
            <th scope="col">First Name</th>
            <th scope="col">Email</th>
            <th scope="col">Is Active?</th>
            <th scope="col">Is Admin?</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((userItem: User) => (
            <tr key={userItem.id}>
              <td>
                <span className="text-muted small">
                  {userItem.id.slice(0, 8)}...
                </span>
              </td>
              <td>
                <Link 
                  className="link-secondary fw-medium" 
                  href={`/admin/users/${userItem.id}`}
                  title={`View details for ${userItem.first_name}`}
                >
                  {userItem.first_name}
                </Link>
              </td>
              <td>
                  {userItem.last_name}
              </td>
              <td>
                  {userItem.email}
              </td>
              <td>
                  {userItem.isactive ? 'Yes' : 'No'}
              </td>
              <td>
                  {userItem.isadmin ? 'Yes' : 'No'}
              </td>
              <td>
                <div className="d-flex gap-2 align-items-center">
                  <UpdateUserBtn id={userItem.id} />
                  <DeleteUserBtn id={userItem.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.totalPages > 1 && (
        <div className="mt-3 d-flex justify-content-center">
          <nav aria-label="Status table pagination">
            <p className="text-muted small mb-0">
              Showing {users.data.length} records across {users.totalPages} pages
            </p>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserTable;