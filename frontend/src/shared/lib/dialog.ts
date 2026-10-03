import {
    createContext,
    useContext,
} from "react";


export interface ConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
}


export interface DialogContextValue {
    confirm: (
        options?: ConfirmOptions
    ) => Promise<boolean>;
}


export const DialogContext =
    createContext<DialogContextValue | null>(
        null
    );


export function useDialog(): DialogContextValue {
    const context =
        useContext(DialogContext);

    if (!context) {
        throw new Error(
            "useDialog must be used within DialogProvider"
        );
    }

    return context;
}
