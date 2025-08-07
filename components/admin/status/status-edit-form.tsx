'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { ZodErrors } from "@/components/common/zod-errors";
import { updateStatus } from '@/actions/status-actions';
import { getArrayOfNumbers } from '@/lib/utils';
import CheckboxDefault from '@/components/ui/custom/checkboxDefault';

type StatusEditFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const StatusEditForm = ({status}:any) => {
    const router = useRouter();
    const [state, setState] = useState<StatusEditFormState | null>(null);

    const typeid = getArrayOfNumbers();

    async function onSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });   
    try {
      const response = await updateStatus(formData);
        console.log("Response from updateStatus:", response);
        if (response.error === "validation") {
            setState(response as any);
            toast.error(response.message);
        } else if (response.error === "already_exists") {
            toast.error("Failed adding a status: " + response.message);
        } else if (response.success === false) {
            toast.error("Failed updating status: " + response.message);
        } else if (response.success) {
            toast.success("Status updated successfully");
            router.push('/admin/status');
        } else {
            toast.error("test " + response.error);
        }  
    } catch (error) {
        toast.error('Failed to update status');
        setState({ loading: false, zodErrors: null });
    }
}
  return (
    <>
    <div className="card">
        <div className="card-body">
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-3">
                    <input type="hidden" name='id' defaultValue={status?.id} />
                    <label htmlFor="status_name" className="form-label">Status Name</label>
                    <input type="text" className="form-control" id="status_name" name='status_name' defaultValue={status?.status_name} />
                    <ZodErrors error={state?.zodErrors?.status_name} />
                </div>
                <div className="col-md-3">
                    <label htmlFor="status_type" className="form-label">Type</label>
                    <select className="form-select" id="status_type" 
                    name='typeid' defaultValue={status?.typeid}>
                        {typeid?.map((id) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                            ))}
                    </select>
                    <div className="invalid-feedback">
                        Please select a status type.
                    </div>
                </div>
                <div className="col-md-6">
                    <label htmlFor="status_description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="status_description" name='description' defaultValue={status?.description} />
                </div>
                <div className="col-12">
                    <CheckboxDefault  title="Is active?" name="isactive" checked={status.isactive}  className="form-check-input"/>
                </div>
                <div className="col-12 justify-content-center d-flex">
                     <Button type='button' onClick={() => router.back()} className='btn btn-light'>Cancel</Button>
                        <span className="mx-2"></span>
                     <Button className="btn btn-secondary" type="submit">Save</Button>
                </div>
            </form>
        </div> 
    </div> 
</>
                        
  )
}

export default StatusEditForm