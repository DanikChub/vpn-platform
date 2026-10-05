import { baseApi } from "@/shared/api";
import type {
    CreateMarketingSourceDto,
    MarketingSource, MarketingSourceStats,
    MarketingSourceUsersResponse,
    UpdateMarketingSourceDto,
} from "../model";

export interface GetMarketingSourcesParams {
    is_active?: boolean;
    type?: string;
    search?: string;
}

interface UpdateMarketingSourceArgs {
    id: number;
    data: UpdateMarketingSourceDto;
}

export const marketingSourceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMarketingSources: builder.query<MarketingSource[], GetMarketingSourcesParams | void>({
            query: (params) => ({ url: "/admin/marketing-sources", params: params || undefined }),
            providesTags: (result) => [
                { type: "MarketingSource", id: "LIST" },
                ...(result?.map(({ id }) => ({ type: "MarketingSource" as const, id })) ?? []),
            ],
        }),
        getMarketingSource: builder.query<MarketingSource, number>({
            query: (id) => ({ url: `/admin/marketing-sources/${id}` }),
            providesTags: (_result, _error, id) => [{ type: "MarketingSource", id }],
        }),
        getMarketingSourceStats:
            builder.query<
                MarketingSourceStats,
                number
            >({
                query: (id) => ({
                    url:
                        `/admin/marketing-sources/${id}/stats`,
                }),

                providesTags:
                    (_result, _error, id) => [
                        {
                            type: "MarketingSource",
                            id,
                        },
                    ],
            }),
        getMarketingSourceUsers: builder.query<MarketingSourceUsersResponse, number>({
            query: (id) => ({ url: `/admin/marketing-sources/${id}/users` }),
            providesTags: (_result, _error, id) => [{ type: "MarketingSource", id }],
        }),
        createMarketingSource: builder.mutation<MarketingSource, CreateMarketingSourceDto>({
            query: (data) => ({ url: "/admin/marketing-sources", method: "POST", data }),
            invalidatesTags: [{ type: "MarketingSource", id: "LIST" }],
        }),
        updateMarketingSource: builder.mutation<MarketingSource, UpdateMarketingSourceArgs>({
            query: ({ id, data }) => ({ url: `/admin/marketing-sources/${id}`, method: "PATCH", data }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "MarketingSource", id }, { type: "MarketingSource", id: "LIST" }],
        }),
        deleteMarketingSource: builder.mutation<MarketingSource, number>({
            query: (id) => ({ url: `/admin/marketing-sources/${id}`, method: "DELETE" }),
            invalidatesTags: (_result, _error, id) => [{ type: "MarketingSource", id }, { type: "MarketingSource", id: "LIST" }],
        }),
        restoreMarketingSource: builder.mutation<MarketingSource, number>({
            query: (id) => ({ url: `/admin/marketing-sources/${id}/restore`, method: "POST" }),
            invalidatesTags: (_result, _error, id) => [{ type: "MarketingSource", id }, { type: "MarketingSource", id: "LIST" }],
        }),
    }),
});

export const {
    useGetMarketingSourcesQuery,
    useGetMarketingSourceQuery,
    useGetMarketingSourceStatsQuery,
    useGetMarketingSourceUsersQuery,
    useCreateMarketingSourceMutation,
    useUpdateMarketingSourceMutation,
    useDeleteMarketingSourceMutation,
    useRestoreMarketingSourceMutation,
} = marketingSourceApi;
