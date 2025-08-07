import React from 'react';
import Link from 'next/link';
import DeleteDialog from '@/components/shared/delete-dialog';
import { DeleteStatusBtn } from './buttons';

const StatusTable = ({ status }:any) => {
  return (
     <table data-tables="basic" className="table table-striped dt-responsive align-middle mb-0">
        <thead className="thead-sm text-uppercase fs-xxs">
            <tr>
                <th>Id</th>
                <th>Status Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Is Active?</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {status.data.map((status:any) => (
            <tr key={status.id}>
                <td>{status.id}</td>
                <td><Link className='link-secondary' href={`/status/${status.id}`}>{status.status_name}</Link></td>
                <td>{status.description}</td>
                <td>{status.typeid}</td>
                <td>{status.isactive ? 'Yes' : 'No'}</td>
                <td>
                     <DeleteStatusBtn id={status.id} />
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default StatusTable