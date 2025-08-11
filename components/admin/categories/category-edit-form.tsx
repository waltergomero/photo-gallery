'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { ZodErrors } from "@/components/common/zod-errors";
import { updateCategory } from '@/actions/category-actions';
import { getArrayOfNumbers } from '@/lib/utils';
import CheckboxDefault from '@/components/ui/custom/checkboxDefault';

const CategoryEditForm = ({category}) => {
    const router = useRouter();
    const [state, setState] = useState(null);

    const typeid = getArrayOfNumbers();

    async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });   
    try {
      const response = await updateCategory(formData);
        console.log("Response from updateCategory:", response);
        if (response.error === "validation") {
            setState(response);
            toast.error(response.message);
        } else if (response.error === "already_exists") {
            toast.error("Failed adding a category: " + response.message);
        } else if (response.success === false) {
            toast.error("Failed updating category: " + response.message);
        } else if (response.success) {
            toast.success("Category updated successfully");
            router.push('/admin/categories');
        } else {
            toast.error("test " + response.error);
        }  
    } catch (error) {
        toast.error('Failed to update category');
        setState({ loading: false, zodErrors: null });
    }
}
  return (
    <>
    <div className="card">
        <div className="card-body">
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-4">
                    <input type="hidden" name='id' defaultValue={category?.id} />
                    <label htmlFor="category_name" className="form-label">Category Name</label>
                    <input type="text" className="form-control" id="category_name" name='category_name' defaultValue={category?.category_name} />
                    <ZodErrors error={state?.zodErrors?.category_name} />
                </div>
                <div className="col-md-8">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' defaultValue={category?.description} />
                </div>
                <div className="col-12">
                    <CheckboxDefault  title="Is active?" name="isactive" checked={category.isactive}  className="form-check-input"/>
                </div>
                <div className="col-12 justify-content-center d-flex">
                     <Button type='button' onClick={() => router.back()} className='btn btn-light'>Cancel</Button>
                        <span className="mx-2"></span>
                     <Button className="btn btn-primary" type="submit">Save</Button>
                </div>
            </form>
        </div> 
    </div> 
</>
                        
  )
}

export default CategoryEditForm