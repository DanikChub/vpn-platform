import type { PaymentStatus } from "../../payments/payment.model";
import type { GetAdminPaymentsQuery } from "./admin-payments.types";

const PAYMENT_STATUSES: PaymentStatus[] = [
    "pending",
    "paid",
    "failed",
    "cancelled",
    "expired",
];

function parsePositiveInt(
    value: unknown,
    fallback: number,
    max?: number
): number {
    if (value === undefined) {
        return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new Error("Invalid pagination parameter");
    }

    return max
        ? Math.min(parsed, max)
        : parsed;
}

function parseDate(
    value: unknown,
    field: string
): Date | undefined {
    if (value === undefined) {
        return undefined;
    }

    if (typeof value !== "string") {
        throw new Error(`Invalid ${field} date`);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid ${field} date`);
    }

    return date;
}

export function parseGetAdminPaymentsQuery(
    query: Record<string, unknown>
): GetAdminPaymentsQuery {
    const page = parsePositiveInt(
        query.page,
        1
    );

    const limit = parsePositiveInt(
        query.limit,
        25,
        100
    );

    let status: PaymentStatus | undefined;

    if (query.status !== undefined) {
        if (
            typeof query.status !== "string" ||
            !PAYMENT_STATUSES.includes(
                query.status as PaymentStatus
            )
        ) {
            throw new Error(
                "Invalid payment status"
            );
        }

        status =
            query.status as PaymentStatus;
    }

    const search =
        typeof query.search === "string" &&
        query.search.trim()
            ? query.search.trim()
            : undefined;

    const from = parseDate(
        query.from,
        "from"
    );

    const to = parseDate(
        query.to,
        "to"
    );

    if (
        from &&
        to &&
        from.getTime() > to.getTime()
    ) {
        throw new Error(
            "from must be earlier than to"
        );
    }

    return {
        page,
        limit,
        status,
        search,
        from,
        to,
    };
}
