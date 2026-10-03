import {
    useCallback,
} from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import type {
    AppDispatch,
    RootState,
} from "@/app/store";
import {
    baseApi,
} from "@/shared/api";
import {
    tokenStorage,
} from "@/shared/lib";

import {
    authApi,
} from "../api/authApi";
import {
    sessionAuthenticated,
    sessionUnauthenticated,
} from "./auth.slice";
import type {
    LoginCredentials,
} from "./auth.types";


export function useAuth() {
    const dispatch =
        useDispatch<AppDispatch>();

    const {
        admin,
        status,
    } = useSelector(
        (state: RootState) =>
            state.auth
    );


    const login =
        useCallback(
            async (
                credentials: LoginCredentials
            ): Promise<void> => {
                const response =
                    await dispatch(
                        authApi.endpoints.login.initiate(
                            credentials
                        )
                    ).unwrap();

                tokenStorage.setToken(
                    response.accessToken
                );

                dispatch(
                    sessionAuthenticated(
                        response.admin
                    )
                );
            },
            [
                dispatch,
            ]
        );


    const logout =
        useCallback(
            (): void => {
                tokenStorage.removeToken();

                dispatch(
                    sessionUnauthenticated()
                );

                dispatch(
                    baseApi.util.resetApiState()
                );
            },
            [
                dispatch,
            ]
        );


    return {
        admin,
        status,

        isAuthenticated:
            status === "authenticated",

        isInitializing:
            status === "initializing",

        login,
        logout,
    };
}
