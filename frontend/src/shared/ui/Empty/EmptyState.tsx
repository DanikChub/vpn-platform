import {
    type ReactNode,
} from "react";

import {
    cn,
} from "@/shared/lib";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
                               title,
                               description,
                               icon,
                               action,
                               className,
                           }: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center",
                className
            )}
        >
            {icon && (
                <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                    {icon}
                </div>
            )}

            <h2 className="text-base font-semibold text-slate-950">
                {title}
            </h2>

            {description && (
                <p className="mt-1 max-w-md text-sm leading-5 text-slate-500">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}