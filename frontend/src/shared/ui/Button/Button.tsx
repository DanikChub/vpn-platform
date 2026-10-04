import {
    forwardRef,
    type ButtonHTMLAttributes,
    type ReactNode,
} from "react";

import {
    cn,
} from "@/shared/lib";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

export type ButtonSize =
    | "sm"
    | "md"
    | "lg"
    | "icon";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;

    leftIcon?: ReactNode;
    rightIcon?: ReactNode;

    isLoading?: boolean;
}

const variantClasses: Record<
    ButtonVariant,
    string
> = {
    primary:
        "bg-slate-950 text-white hover:bg-slate-800",

    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200",

    outline:
        "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",

    ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",

    danger:
        "bg-red-600 text-white hover:bg-red-500",
};

const sizeClasses: Record<
    ButtonSize,
    string
> = {
    sm:
        "h-8 px-2.5 text-xs",

    md:
        "h-9 px-3 text-sm",

    lg:
        "h-10 px-4 text-sm",

    icon:
        "size-9 p-0",
};
export const Button =
    forwardRef<
        HTMLButtonElement,
        ButtonProps
    >(
        (
            {
                children,
                className,

                variant = "primary",
                size = "md",

                leftIcon,
                rightIcon,

                isLoading = false,
                disabled,

                type = "button",

                ...props
            },
            ref
        ) => {
            const isDisabled =
                disabled || isLoading;

            return (
                <button
                    ref={ref}
                    className={cn(
                        "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-slate-900/15",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        variantClasses[variant],
                        sizeClasses[size],
                        className
                    )}
                    disabled={isDisabled}
                    type={type}
                    {...props}
                >
                    {isLoading ? (
                        <span
                            aria-hidden="true"
                            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                        />
                    ) : (
                        leftIcon
                    )}

                    {children && (
                        <span>
                            {children}
                        </span>
                    )}

                    {!isLoading &&
                        rightIcon}
                </button>
            );
        }
    );

Button.displayName = "Button";