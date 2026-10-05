import {
    baseApi,
} from "@/shared/api";

import type {
    GetPaymentsParams,
    GetPaymentsResponse,
    GetPaymentsStatsResponse,
} from "../model";


export const paymentApi =
    baseApi.injectEndpoints({

        endpoints:
            (builder) => ({

                getPayments:
                    builder.query<
                        GetPaymentsResponse,
                        GetPaymentsParams | void
                    >({

                        query:
                            (params) => ({
                                url:
                                    "/admin/payments",

                                params:
                                    params ?? undefined,
                            }),

                        providesTags: [
                            {
                                type:
                                    "Payment",
                                id:
                                    "LIST",
                            },
                        ],
                    }),


                getPaymentStats:
                    builder.query<
                        GetPaymentsStatsResponse,
                        void
                    >({

                        query:
                            () => ({
                                url:
                                    "/admin/payments/stats",
                            }),

                        providesTags: [
                            {
                                type:
                                    "Payment",
                                id:
                                    "STATS",
                            },
                        ],
                    }),

            }),
    });


export const {
    useGetPaymentsQuery,
    useGetPaymentStatsQuery,
} = paymentApi;