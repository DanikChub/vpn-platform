import {
    type PropsWithChildren,
    useCallback,
    useRef,
    useState,
} from "react";

import {
    DialogContext,
    type ConfirmOptions,
} from "@/shared/lib";

import {
    ConfirmDialog,
} from "@/shared/ui";


interface PendingConfirm {
    options: ConfirmOptions;
    resolve: (confirmed: boolean) => void;
}


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
                cancelText={pendingConfirm?.options.cancelText}
                confirmText={pendingConfirm?.options.confirmText}
                description={pendingConfirm?.options.description}
                isOpen={pendingConfirm !== null}
                onClose={() => finishConfirm(false)}
                onConfirm={() => finishConfirm(true)}
                title={pendingConfirm?.options.title}
                variant={pendingConfirm?.options.variant}
            />
        </DialogContext.Provider>
    );
}
