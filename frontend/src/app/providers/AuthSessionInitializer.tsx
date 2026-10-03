import {
    useEffect,
    type PropsWithChildren,
} from "react";
import {
    useDispatch,
} from "react-redux";

import type {
    AppDispatch,
} from "@/app/store";
import {
    authApi,
    sessionAuthenticated,
    sessionUnauthenticated,
} from "@/features/auth";
import {
    tokenStorage,
} from "@/shared/lib";


export function AuthSessionInitializer({
                                           children,
                                       }: PropsWithChildren) {
    const dispatch =
        useDispatch<AppDispatch>();


    useEffect(() => {
        const token =
            tokenStorage.getToken();

        if (!token) {
            dispatch(
                sessionUnauthenticated()
            );

            return;
        }

        const request =
            dispatch(
                authApi.endpoints.getMe.initiate()
            );

        void request
            .unwrap()
            .then((response) => {
                dispatch(
                    sessionAuthenticated(
                        response.admin
                    )
                );
            })
            .catch(() => {
                // 401 is handled centrally by baseQuery.
                // Other restore errors also end the startup check.
                dispatch(
                    sessionUnauthenticated()
                );
            });

        return () => {
            request.unsubscribe();
        };
    }, [
        dispatch,
    ]);


    return children;
}
