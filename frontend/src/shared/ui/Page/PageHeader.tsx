import {
    type ReactNode,
} from "react";

import {
    cn,
} from "@/shared/lib";

interface PageHeaderProps {
    title: string;
    description?: string;

    icon?: ReactNode;
    actions?: ReactNode;

    className?: string;
}

export function PageHeader({
                               title,
                               description,
                               icon,
                               actions,
                               className,
                           }: PageHeaderProps) {
    return (
        <header
            className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                className
            )}
        >
            <div className="flex min-w-0 items-center gap-3">
                {icon && (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
                        {icon}
                    </div>
                )}

                <div className="min-w-0">
                    <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-0.5 text-sm leading-5 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </header>
    );
}