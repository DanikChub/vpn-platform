import {
    baseApi,
} from "@/shared/api";

import type {
    LoginCredentials,
    LoginResponse,
    MeResponse,
} from "../model/auth.types";


export const authApi =
    baseApi.injectEndpoints({
        endpoints: (builder) => ({
            login: builder.mutation<
                LoginResponse,
                LoginCredentials
            >({
                query: (credentials) => ({
                    url: "/admin/auth/login",
                    method: "POST",
                    data: credentials,
                }),
            }),

            getMe: builder.query<
                MeResponse,
                void
            >({
                query: () => ({
                    url: "/admin/auth/me",
                }),
            }),
        }),
    });


export const {
    useLoginMutation,
} = authApi;
