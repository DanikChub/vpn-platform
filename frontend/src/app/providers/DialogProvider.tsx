import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

import {
    ConfirmDialog,
} from "@/shared/ui";


export interface ConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "danger";
}


interface DialogContextValue {
    confirm: (
        options?: ConfirmOptions
    ) => Promise<boolean>;
}


interface PendingConfirm {
    options: ConfirmOptions;
    resolve: (confirmed: boolean) => void;
}


const DialogContext =
    createContext<DialogContextValue | null>(
        null
    );


export function DialogProvider({
                                   children,
                               }: PropsWithChildren) {
    const [
        pendingConfirm,
        setPendingConfirm,
    ] = useState<PendingConfirm | null>(
        null
    );

    const pendingConfirmRef =
        useRef<PendingConfirm | null>(
            null
        );


    const finishConfirm =
        useCallback(
            (confirmed: boolean) => {
                const current =
                    pendingConfirmRef.current;

                if (!current) {
                    return;
                }

                pendingConfirmRef.current =
                    null;

                setPendingConfirm(null);

                current.resolve(
                    confirmed
                );
            },
            []
        );


    const confirm =
        useCallback(
            (
                options: ConfirmOptions = {}
            ): Promise<boolean> => {
                if (
                    pendingConfirmRef.current
                ) {
                    return Promise.resolve(
                        false
                    );
                }

                return new Promise<boolean>(
                    (resolve) => {
                        const nextConfirm = {
                            options,
                            resolve,
                        };

                        pendingConfirmRef.current =
                            nextConfirm;

                        setPendingConfirm(
                            nextConfirm
                        );
                    }
                );
            },
            []
        );


    return (
        <DialogContext.Provider
            value={{
                confirm,
            }}
        >
            {children}

            <ConfirmDialog
                cancelText={
                    pendingConfirm
                        ?.options
                        .cancelText
                }
                confirmText={
                    pendingConfirm
                        ?.options
                        .confirmText
                }
                description={
                    pendingConfirm
                        ?.options
                        .description
                }
                isOpen={
                    pendingConfirm !==
                    null
                }
                onClose={() => {
                    finishConfirm(false);
                }}
                onConfirm={() => {
                    finishConfirm(true);
                }}
                title={
                    pendingConfirm
                        ?.options
                        .title
                }
                variant={
                    pendingConfirm
                        ?.options
                        .variant
                }
            />
        </DialogContext.Provider>
    );
}


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
