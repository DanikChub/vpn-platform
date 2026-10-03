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
    AuthProvider,
} from "@/features/auth";

import {
    DialogProvider,
} from "./DialogProvider";


export function AppProviders({
                                 children,
                             }: PropsWithChildren) {
    return (
        <Provider store={store}>
            <DialogProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </DialogProvider>
        </Provider>
    );
}
