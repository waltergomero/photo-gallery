import React from 'react'
import SignUp from "@/components/auth/signup";
import { redirect } from 'next/navigation';
export const metadata= { title: "Sign Up" }
import { auth } from '@/auth';


const SignUpPage = async (props: any) => {
    const { callbackUrl } = await props.searchParams;

    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }
    return (
        <div className="auth-box overflow-hidden align-items-center d-flex" style={{ minHeight: '100vh' }}>
            <SignUp />
        </div>
    )
}

export default SignUpPage