import React from 'react';
import Link from 'next/link';
import { DeleteCategoryBtn } from './buttons';
import { CategoryTableProps } from '@/types';

const CategoryTable = ({ categories }: CategoryTableProps) => {
  return (
     <table data-tables="basic" className="table table-striped dt-responsive align-middle mb-0">
        <thead className="thead-sm text-uppercase fs-xxs">
            <tr>
                <th>Id</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Is Active?</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {categories.data.map((category) => (
            <tr key={category.id}>
                <td>{category.id}</td>
                <td><Link className='link-secondary' href={`/admin/categories/${category.id}`}>{category.category_name}</Link></td>
                <td>{category.description}</td>
                <td>{category.isactive ? 'Yes' : 'No'}</td>
                <td>
                     <DeleteCategoryBtn id={category.id.toString()} />
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default CategoryTable