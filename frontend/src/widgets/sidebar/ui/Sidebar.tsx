import React from "react";
import { NavLink } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

import { sidebarLinks } from "@/widgets/sidebar/config/sidebarLinks";

const Sidebar: React.FC = () => {
    return (
        <aside
            className="
                fixed bottom-0 left-0 top-14
                z-20
                flex w-56 flex-col
                border-r border-slate-200
                bg-white
                p-3
            "
        >

            <nav className="flex-1">
                {sidebarLinks.map(
                    ({
                         label,
                         path,
                         icon,
                     }) => (
                        <SidebarLink
                            key={path}
                            icon={icon}
                            label={label}
                            path={path}
                        />
                    )
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;

type SidebarLinkProps = {
    path: string;
    label: string;
    icon: LucideIcon;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({
                                                     path,
                                                     label,
                                                     icon: Icon,
                                                 }) => {
    return (
        <NavLink
            className={({ isActive }) =>
                [
                    "flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm font-medium transition-colors",
                    isActive
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                ].join(" ")
            }
            to={path}
        >
            <Icon
                aria-hidden="true"
                className="size-4 shrink-0"
            />

            <span className="truncate">
                {label}
            </span>
        </NavLink>
    );
};