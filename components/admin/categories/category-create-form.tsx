'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { ZodErrors } from "@/components/common/zod-errors";
import { createCategory } from '@/actions/category-actions';
import { getArrayOfNumbers } from '@/lib/utils';

const CategoryCreateForm = () => {
    const router = useRouter();
    const [state, setState] = useState(null);

    const typeid = getArrayOfNumbers();

    async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });   
    try {
      const response = await createCategory(formData);
        console.log("Response from createCategory:", response);
        if (response.error === "validation") {
            setState(response);
            toast.error(response.message);
        } else if (response.error === "already_exists") {
            toast.error("Failed adding a category: " + response.message);
        } else if (response.success === false) {
            toast.error("Failed updating category: " + response.message);
        } else if (response.success) {
            toast.success("Category created successfully");
            router.push('/admin/categories');
        } else {
            toast.error("test " + response.error);
        }  
    } catch (error) {
        toast.error('Failed to create category');
        setState({ loading: false, zodErrors: null });
    }
}
  return (
    <>
    <div className="card">
        <div className="card-body">
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-4">
                    <label htmlFor="category_name" className="form-label">Category Name</label>
                    <input type="text" className="form-control" id="category_name" name='category_name'/>
                    <ZodErrors error={state?.zodErrors?.category_name} />
                </div>
                <div className="col-md-8">
                    <label htmlFor="category_description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="category_description" name='description'/>
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

export default CategoryCreateForm