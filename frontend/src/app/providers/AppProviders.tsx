import type {
    PropsWithChildren,
} from "react";

import {
    Provider,
} from "react-redux";

import {
    store,
} from "@/app/store";

import {
    AuthSessionInitializer,
} from "./AuthSessionInitializer";
import {
    DialogProvider,
} from "./DialogProvider";

import {
    Toaster,
} from "sonner";


export function AppProviders({
                                 children,
                             }: PropsWithChildren) {
    return (
        <Provider store={store}>
            <AuthSessionInitializer>
                <DialogProvider>
                    {children}

                    <Toaster
                        position="bottom-right"
                        richColors
                    />
                </DialogProvider>
            </AuthSessionInitializer>
        </Provider>
    );
}
