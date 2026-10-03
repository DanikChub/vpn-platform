import { baseApi } from "@/shared/api";
import type {
    ExtendUserSubscriptionPayload,
    GetUsersParams,
    GetUsersResponse,
    GetUserByIdResponse,
    UserSubscriptionMutationResponse,
} from "../model";

interface SubscriptionMutationArgs {
    userId: number;
}

interface ExtendSubscriptionArgs extends SubscriptionMutationArgs {
    payload: ExtendUserSubscriptionPayload;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<GetUsersResponse, GetUsersParams>({
            query: (params) => ({ url: "/admin/users", params }),
            providesTags: (result) => [
                { type: "User", id: "LIST" },
                ...(result?.users.map(({ id }) => ({ type: "User" as const, id })) ?? []),
            ],
        }),
        getUser: builder.query<GetUserByIdResponse, number>({
            query: (userId) => ({ url: `/admin/users/${userId}` }),
            providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
        }),
        extendUserSubscription: builder.mutation<UserSubscriptionMutationResponse, ExtendSubscriptionArgs>({
            query: ({ userId, payload }) => ({
                url: `/admin/users/${userId}/subscription/extend`,
                method: "POST",
                data: payload,
            }),
            invalidatesTags: (_result, _error, { userId }) => [
                { type: "User", id: userId },
                { type: "User", id: "LIST" },
            ],
        }),
        expireUserSubscription: builder.mutation<UserSubscriptionMutationResponse, SubscriptionMutationArgs>({
            query: ({ userId }) => ({ url: `/admin/users/${userId}/subscription/expire`, method: "POST" }),
            invalidatesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }, { type: "User", id: "LIST" }],
        }),
        blockUserSubscription: builder.mutation<UserSubscriptionMutationResponse, SubscriptionMutationArgs>({
            query: ({ userId }) => ({ url: `/admin/users/${userId}/subscription/block`, method: "POST" }),
            invalidatesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }, { type: "User", id: "LIST" }],
        }),
        unblockUserSubscription: builder.mutation<UserSubscriptionMutationResponse, SubscriptionMutationArgs>({
            query: ({ userId }) => ({ url: `/admin/users/${userId}/subscription/unblock`, method: "POST" }),
            invalidatesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }, { type: "User", id: "LIST" }],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useExtendUserSubscriptionMutation,
    useExpireUserSubscriptionMutation,
    useBlockUserSubscriptionMutation,
    useUnblockUserSubscriptionMutation,
} = userApi;
