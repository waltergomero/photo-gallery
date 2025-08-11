import React from 'react'
import SignIn from "@/components/auth/signin";
import { redirect } from 'next/navigation';
export const metadata= { title: "Sign In" }



const SignInPage = async (props: any) => {
    const { callbackUrl } = await props.searchParams;

  
    return (
        <div className="auth-box overflow-hidden align-items-center d-flex" style={{ minHeight: '100vh' }}>
            <SignIn />
        </div>
    )
}

export default SignInPage