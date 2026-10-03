import {
    createApi,
} from "@reduxjs/toolkit/query/react";
import type {
    BaseQueryFn,
} from "@reduxjs/toolkit/query";
import type {
    AxiosError,
    AxiosRequestConfig,
} from "axios";

import {
    sessionUnauthorized,
    tokenStorage,
} from "@/shared/lib";

import {
    apiClient,
} from "./apiClient";


interface AxiosBaseQueryArgs {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
}


interface AxiosBaseQueryError {
    status?: number;
    data?: unknown;
}


const axiosBaseQuery:
BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError
> =
    async (
        {
            url,
            method = "GET",
            data,
            params,
        },
        api
    ) => {
        try {
            const response =
                await apiClient({
                    url,
                    method,
                    data,
                    params,
                });

            return {
                data: response.data,
            };
        } catch (error) {
            const axiosError =
                error as AxiosError;

            const status =
                axiosError.response
                    ?.status;

            if (status === 401) {
                tokenStorage.removeToken();

                api.dispatch(
                    sessionUnauthorized()
                );

                api.dispatch(
                    baseApi.util.resetApiState()
                );
            }

            return {
                error: {
                    status,
                    data:
                        axiosError.response
                            ?.data,
                },
            };
        }
    };


export const baseApi =
    createApi({
        reducerPath: "api",
        baseQuery: axiosBaseQuery,
        tagTypes: [
            "VpnNode",
            "User",
            "Plan",
            "MarketingSource",
        ],
        endpoints: () => ({}),
    });
