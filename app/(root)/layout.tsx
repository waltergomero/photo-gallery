import {ChildrenType} from "@/types";
import RootLayout from "@/layouts/RootLayout";

const Layout = ({children}: ChildrenType) => {
    return (
        <RootLayout>
            {children}
        </RootLayout>
    )
}

export default Layout