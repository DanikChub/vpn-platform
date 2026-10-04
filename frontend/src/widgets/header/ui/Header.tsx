import {
    LogOut,
    ShieldCheck,
} from "lucide-react";

import type {
    AdminRole,
} from "@/entities/admin";

import {
    useAuth,
} from "@/features/auth";


const ROLE_LABELS: Record<
    AdminRole,
    string
> = {
    superadmin:
        "Суперадминистратор",

    admin:
        "Администратор",

    support:
        "Поддержка",
};


export function Header() {
    const {
        admin,
        logout,
    } = useAuth();

    if (!admin) {
        return null;
    }

    return (
        <header
            className="
                fixed left-0 right-0 top-0
                z-30
                flex h-14
                items-center justify-between
                border-b border-slate-200
                bg-white px-4
            "
        >
            <div className="flex items-center gap-2.5">
                <div
                    className="
                        flex size-8
                        items-center justify-center
                        rounded-md
                        bg-slate-950
                        text-white
                    "
                >
                    <ShieldCheck
                        aria-hidden="true"
                        className="size-4"
                    />
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-950">
                        ВПН ИОРДАН
                    </p>

                    <p className="text-xs text-slate-500">
                        Панель управления
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5">
                <div className="min-w-0 text-right">
                    <p
                        className="
                            max-w-64 truncate
                            text-sm font-medium
                            text-slate-900
                        "
                    >
                        {admin.email}
                    </p>

                    <p className="text-xs text-slate-500">
                        {ROLE_LABELS[admin.role]}
                    </p>
                </div>

                <button
                    aria-label="Выйти"
                    className="
                        flex size-8
                        items-center justify-center
                        rounded-md
                        text-slate-500
                        transition-colors
                        hover:bg-slate-100
                        hover:text-slate-950
                    "
                    onClick={logout}
                    title="Выйти"
                    type="button"
                >
                    <LogOut className="size-4" />
                </button>
            </div>
        </header>
    );
}