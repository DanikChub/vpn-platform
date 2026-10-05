import type { PaymentStatus } from "../../payments/payment.model";

export interface GetAdminPaymentsQuery {
    page: number;
    limit: number;
    status?: PaymentStatus;
    search?: string;
    from?: Date;
    to?: Date;
}

export interface AdminPaymentDto {
    id: number;
    providerPaymentId: string | null;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentUrl: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
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
        username: string | null;
        firstName: string | null;
        marketingSourceId: number | null;
    };
}

export interface AdminPaymentsStatsDto {
    totalRevenue: number;
    totalPaidPayments: number;
    uniquePayingUsers: number;
    averageCheck: number;
    currentMonthRevenue: number;
    currentMonthPaidPayments: number;
    currentMonthUniquePayingUsers: number;
}
