export type PaymentStatus =
    | "pending"
    | "paid"
    | "failed"
    | "cancelled"
    | "expired";


export interface Payment {
    id: number;

    providerPaymentId:
        string | null;

    amount: number;
    currency: string;
    status: PaymentStatus;

    paymentUrl:
        string | null;

    expiresAt:
        string | null;

    createdAt: string;
    updatedAt: string;

    paymentMethod: {
        id: number;
        code: string;
        name: string;
    } | null;

    order: {
        id: number;
        planId: number;
        planName: string;
        durationDays: number;
        status: string;
    };

    user: {
        id: number;
        telegramId: string;

        username:
            string | null;

        firstName:
            string | null;

        marketingSourceId:
            number | null;
    };
}


export interface PaymentsStats {
    totalRevenue: number;
    totalPaidPayments: number;
    uniquePayingUsers: number;
    averageCheck: number;

    currentMonthRevenue: number;
    currentMonthPaidPayments: number;
    currentMonthUniquePayingUsers: number;
}


export interface GetPaymentsParams {
    page?: number;
    limit?: number;

    status?:
        PaymentStatus;

    search?: string;

    from?: string;
    to?: string;
}


export interface GetPaymentsResponse {
    payments: Payment[];

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


export interface GetPaymentsStatsResponse {
    stats: PaymentsStats;
}