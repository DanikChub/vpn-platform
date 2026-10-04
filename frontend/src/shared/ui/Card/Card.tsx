import {
    type HTMLAttributes,
} from "react";

import {
    cn,
} from "@/shared/lib";

export function Card({
                         className,
                         ...props
                     }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-sm border border-slate-200 bg-white",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({
                               className,
                               ...props
                           }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "border-b border-slate-200 px-4 py-3",
                className
            )}
            {...props}
        />
    );
}

export function CardContent({
                                className,
                                ...props
                            }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "p-4",
                className
            )}
            {...props}
        />
    );
}

export function CardFooter({
                               className,
                               ...props
                           }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3",
                className
            )}
            {...props}
        />
    );
}

export function CardTitle({
                              className,
                              ...props
                          }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "text-lg font-semibold text-slate-950",
                className
            )}
            {...props}
        />
    );
}

export function CardDescription({
                                    className,
                                    ...props
                                }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "mt-1 text-sm text-slate-500",
                className
            )}
            {...props}
        />
    );
}