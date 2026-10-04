import {
    type HTMLAttributes,
} from "react";

import {
    cn,
} from "@/shared/lib";

export function Page({
                         className,
                         ...props
                     }: HTMLAttributes<HTMLElement>) {
    return (
        <section
            className={cn(
                "mx-auto w-full p-5 lg:p-6",
                className
            )}
            {...props}
        />
    );
}

export function PageContent({
                                className,
                                ...props
                            }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "mt-4",
                className
            )}
            {...props}
        />
    );
}