import { baseApi } from "@/shared/api";
import type {
    CreatePlanPayload,
    CreatePlanResponse,
    GetPlanByIdResponse,
    GetPlansResponse,
    UpdatePlanPayload,
    UpdatePlanResponse,
} from "../model";

interface UpdatePlanArgs {
    planId: number;
    payload: UpdatePlanPayload;
}

export const planApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlans: builder.query<GetPlansResponse, void>({
            query: () => ({ url: "/admin/plans" }),
            providesTags: (result) => [
                { type: "Plan", id: "LIST" },
                ...(result?.plans.map(({ id }) => ({ type: "Plan" as const, id })) ?? []),
            ],
        }),
        getPlan: builder.query<GetPlanByIdResponse, number>({
            query: (planId) => ({ url: `/admin/plans/${planId}` }),
            providesTags: (_result, _error, planId) => [{ type: "Plan", id: planId }],
        }),
        createPlan: builder.mutation<CreatePlanResponse, CreatePlanPayload>({
            query: (data) => ({ url: "/admin/plans", method: "POST", data }),
            invalidatesTags: [{ type: "Plan", id: "LIST" }],
        }),
        updatePlan: builder.mutation<UpdatePlanResponse, UpdatePlanArgs>({
            query: ({ planId, payload }) => ({ url: `/admin/plans/${planId}`, method: "PATCH", data: payload }),
            invalidatesTags: (_result, _error, { planId }) => [{ type: "Plan", id: planId }, { type: "Plan", id: "LIST" }],
        }),
        deletePlan: builder.mutation<void, number>({
            query: (planId) => ({ url: `/admin/plans/${planId}`, method: "DELETE" }),
            invalidatesTags: (_result, _error, planId) => [{ type: "Plan", id: planId }, { type: "Plan", id: "LIST" }],
        }),
    }),
});

export const {
    useGetPlansQuery,
    useGetPlanQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    useDeletePlanMutation,
} = planApi;
