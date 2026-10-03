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

export function AppProviders({
                                 children,
                             }: PropsWithChildren) {
    return (
        <Provider store={store}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </Provider>
    );
}