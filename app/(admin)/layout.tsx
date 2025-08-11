import {ChildrenType} from "@/types";
import MainLayout from "@/layouts/MainLayout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from "next-auth/react";

const Layout = ({children}: ChildrenType) => {
    return (
         <SessionProvider>
            <MainLayout>
                {children}
                <ToastContainer 
                theme="colored"
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                toastClassName="text-md"
                pauseOnFocusLoss
                pauseOnHover/>  
            </MainLayout>
        </SessionProvider>
    )
}

export default Layout