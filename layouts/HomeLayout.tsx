import {Fragment} from "react";
import Header from "@/layouts/components/header";
import Footer from "@/layouts/components/footer";
import Customizer from "@/layouts/components/customizer";

import {ChildrenType} from "@/types";

const HomeLayout = ({children}: ChildrenType) => {

    return (
        <Fragment>
            <div className="wrapper bg-white">
                <Header/>
                <div>
                    {children}
                </div>
                <Footer/>
            </div>
            <Customizer/>
        </Fragment>
    )
}

export default HomeLayout