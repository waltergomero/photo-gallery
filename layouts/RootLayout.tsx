'use client'
import {Fragment, useEffect, useState} from "react";
import HomeLayout from "@/layouts/HomeLayout";
//import HorizontalLayout from "@/layouts/HorizontalLayout";
import {useLayoutContext} from "@/context/useLayoutContext";
import {ChildrenType} from "@/types";
import Loader from "@/components/Loader";

const MainLayout = ({children}: ChildrenType) => {

    const {orientation} = useLayoutContext();

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return <Loader height="100vh"/>;

    return (
        <Fragment>
         
            {orientation === 'vertical' && <HomeLayout>{children}</HomeLayout>}
            {/* {orientation === 'horizontal' && <HomeLayout>{children}</HomeLayout>} */}
        </Fragment>
    )
}

export default MainLayout