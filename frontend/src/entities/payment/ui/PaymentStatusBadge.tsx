import type {
    PaymentStatus,
} from "@/entities/payment";

import {
    Badge,
    type BadgeVariant,
} from "@/shared/ui";


interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}


const statusConfig: Record<
    PaymentStatus,
    {
        label: string;
        variant: BadgeVariant;
    }
> = {

    paid: {
        label: "Оплачен",
        variant: "success",
    },

    pending: {
        label: "Ожидает",
        variant: "warning",
    },

    failed: {
        label: "Ошибка",
        variant: "danger",
    },

    cancelled: {
        label: "Отменён",
        variant: "default",
    },

    expired: {
        label: "Истёк",
        variant: "default",
    },
};


export function PaymentStatusBadge({
                                       status,
                                   }: PaymentStatusBadgeProps) {

    const config =
        statusConfig[status];

    return (
        <Badge
            variant={
                config.variant
            }
        >
            {config.label}
        </Badge>
    );
}