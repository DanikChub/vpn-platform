import { createApi } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { apiClient } from "./apiClient";

interface AxiosBaseQueryArgs {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
}

const axiosBaseQuery = () => async ({
    url,
    method = "GET",
    data,
    params,
}: AxiosBaseQueryArgs) => {
    try {
        const response = await apiClient({ url, method, data, params });
        return { data: response.data };
    } catch (error) {
        const axiosError = error as AxiosError;
        return {
            error: {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
            },
        };
    }
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["VpnNode", "User", "Plan", "MarketingSource"],
    endpoints: () => ({}),
});
