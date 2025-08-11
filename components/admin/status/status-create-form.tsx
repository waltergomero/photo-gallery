'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { ZodErrors } from "@/components/common/zod-errors";
import { createStatus } from '@/actions/status-actions';
import { getArrayOfNumbers } from '@/lib/utils';

type StatusFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    message?: string;
    success?: boolean;
};

const StatusCreateForm = () => {
    const router = useRouter();
    const [state, setState] = useState<StatusFormState>({ loading: false, zodErrors: null });

    const typeid = getArrayOfNumbers();

    async function onSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });   
    try {
      const response = await createStatus(formData);
        console.log("Response from createStatus:", response);
        if (response.error === "validation") {
            setState(response as any);
            toast.error(response.message);
        } else if (response.error === "already_exists") {
            toast.error("Failed adding a status: " + response.message);
        } else if (response.success === false) {
            toast.error("Failed updating status: " + response.message);
        } else if (response.success) {
            toast.success("Status created successfully");
            router.push('/admin/status');
        } else {
            toast.error("test " + response.error);
        }  
    } catch (error) {
        toast.error('Failed to create status');
        setState({ loading: false, zodErrors: null });
    }
}
  return (
    <>
    <div className="card ">
        <div className="card-body">
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-6">
                    <label htmlFor="status_name" className="form-label">Status Name</label>
                    <input type="text" className="form-control" id="status_name" name='status_name'/>
                    <ZodErrors error={state?.zodErrors?.status_name} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="status_type" className="form-label">Type</label>
                    <select className="form-select" id="status_type" name='typeid'>
                        {typeid?.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                            ))}
                    </select>
                    <div className="invalid-feedback">
                        Please select your state.
                    </div>
                </div>
                <div className="col-md-12">
                    <label htmlFor="status_description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="status_description" name='description'/>
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

export default StatusCreateForm