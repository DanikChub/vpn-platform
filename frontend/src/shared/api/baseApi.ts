import {
    createApi,
} from "@reduxjs/toolkit/query/react";
import type {
    BaseQueryFn,
} from "@reduxjs/toolkit/query";

import type {
    AxiosRequestConfig,
} from "axios";

import type {
    ApiError,
} from "./api.types";

import {
    normalizeApiError,
} from "./normalizeApiError";

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



const axiosBaseQuery:
BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    ApiError
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
            const apiError =
                normalizeApiError(error);

            if (apiError.status === 401) {
                tokenStorage.removeToken();

                api.dispatch(
                    sessionUnauthorized()
                );

                api.dispatch(
                    baseApi.util.resetApiState()
                );
            }

            return {
                error: apiError,
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
            "Payment"
        ],
        endpoints: () => ({}),
    });
