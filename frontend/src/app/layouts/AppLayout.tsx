import {
    Outlet,
} from "react-router-dom";

import {
    Header,
} from "@/widgets/header";

import Sidebar
    from "@/widgets/sidebar/ui/Sidebar";


const AppLayout = () => {
    return (
        <div className="min-h-screen bg-slate-100">
            <Header />

            <Sidebar />

            <main
                className="
                    min-h-screen
                    pl-56 pt-14
                "
            >
                <Outlet />
            </main>
        </div>
    );
};


export default AppLayout;