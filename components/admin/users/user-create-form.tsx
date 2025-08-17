'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { toast  } from 'react-toastify';
import { redirect, useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { ZodErrors } from "@/components/common/zod-errors";
import { createNewUser } from '@/actions/user-actions';
import CheckboxDefault from '@/components/ui/custom/checkboxDefault';

type UserCreateFormState = {
    loading: boolean;
    zodErrors: any;
    error?: string;
    success?: boolean;
    message?: string;
};

const UserCreateForm = () => {
    const router = useRouter();
    const [state, setState] = useState<UserCreateFormState | null>(null);

    async function onSubmit(event:any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setState({ loading: true, zodErrors: null });  

        try {
        const response = await createNewUser(formData);
            console.log("Response from createNewUser:", response);
            if (response.error === "validation") {
                setState(response as any);
                toast.error(response.message);
            } else if (response.error === "already_exists") {
                toast.error("Failed adding a user: " + response.message);
            } else if (response.success === false) {
                toast.error("Failed updating user: " + response.message);
            } else if (response.success) {
                toast.success("User updated successfully");
                router.push('/admin/users');
            } else {
                toast.error("test " + response.error);
            }  
        } catch (error) {
            toast.error('Failed to update user');
            setState({ loading: false, zodErrors: null });
        }
}
  return (
    <>
    <div className="card">
        <div className="card-body">
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-6">
                    <label htmlFor="first_name" className="form-label">First Name:</label>
                    <input type="text" className="form-control" id="first_name" name='first_name'  />
                    <ZodErrors error={state?.zodErrors?.first_name} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">Last Name:</label>
                    <input type="text" className="form-control" id="last_name" name='last_name'  />
                    <ZodErrors error={state?.zodErrors?.last_name} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="text" className="form-control" id="email" name='email'  />
                    <ZodErrors error={state?.zodErrors?.email} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" className="form-control" id="password" name='password' />
                    <ZodErrors error={state?.zodErrors?.password} />
                </div>
                <div className="col-md-12">
                    <CheckboxDefault  title="Is admin?" name="isadmin" checked={false} />
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

export default UserCreateForm