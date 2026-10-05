import {
    Op,
    type WhereOptions,
} from "sequelize";

import Order from "../../orders/order.model";
import Payment from "../../payments/payment.model";
import PaymentMethod from "../../payments/payment-method.model";
import User from "../../users/user.model";

import type {
    AdminPaymentDto,
    AdminPaymentsStatsDto,
    GetAdminPaymentsQuery,
} from "./admin-payments.types";

class AdminPaymentsService {
    async getAll(
        query: GetAdminPaymentsQuery
    ) {
        const where: WhereOptions = {};

        if (query.status) {
            Object.assign(where, {
                status: query.status,
            });
        }

        if (query.from || query.to) {
            const createdAt: Record<symbol, Date> = {};

            if (query.from) {
                createdAt[Op.gte] = query.from;
            }

            if (query.to) {
                createdAt[Op.lte] = query.to;
            }

            Object.assign(where, {
                created_at: createdAt,
            });
        }

        if (query.search) {
            const paymentIds =
                await this.findPaymentIdsBySearch(
                    query.search
                );

            Object.assign(where, {
                id: {
                    [Op.in]: paymentIds,
                },
            });
        }

        const offset =
            (query.page - 1) *
            query.limit;

        const {
            rows,
            count,
        } = await Payment.findAndCountAll({
            where,
            include: [
                {
                    model: PaymentMethod,
                    as: "payment_method",
                    required: false,
                },
                {
                    model: Order,
                    required: true,
                    include: [
                        {
                            model: User,
                            required: true,
                        },
                    ],
                },
            ],
            order: [
                [
                    "created_at",
                    "DESC",
                ],
            ],
            limit: query.limit,
            offset,
            distinct: true,
        });

        return {
            payments:
                rows.map((payment) =>
                    this.serialize(payment)
                ),
            pagination: {
                page: query.page,
                limit: query.limit,
                total: count,
                totalPages:
                    Math.ceil(
                        count /
                        query.limit
                    ),
            },
        };
    }

    async getStats(): Promise<
        AdminPaymentsStatsDto
    > {
        const now = new Date();

        const monthStart =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

        const [
            allPaid,
            monthPaid,
        ] = await Promise.all([
            Payment.findAll({
                where: {
                    status: "paid",
                },
                attributes: [
                    "amount",
                    "order_id",
                ],
            }),
            Payment.findAll({
                where: {
                    status: "paid",
                    created_at: {
                        [Op.gte]:
                            monthStart,
                    },
                },
                attributes: [
                    "amount",
                    "order_id",
                ],
            }),
        ]);

        const allOrderIds =
            [
                ...new Set(
                    allPaid.map(
                        (payment) =>
                            payment.order_id
                    )
                ),
            ];

        const monthOrderIds =
            [
                ...new Set(
                    monthPaid.map(
                        (payment) =>
                            payment.order_id
                    )
                ),
            ];

        const orders =
            allOrderIds.length
                ? await Order.findAll({
                    where: {
                        id: {
                            [Op.in]:
                                allOrderIds,
                        },
                    },
                    attributes: [
                        "id",
                        "user_id",
                    ],
                })
                : [];

        const orderUserMap =
            new Map(
                orders.map(
                    (order) => [
                        order.id,
                        order.user_id,
                    ]
                )
            );

        const totalRevenue =
            allPaid.reduce(
                (sum, payment) =>
                    sum +
                    Number(
                        payment.amount
                    ),
                0
            );

        const currentMonthRevenue =
            monthPaid.reduce(
                (sum, payment) =>
                    sum +
                    Number(
                        payment.amount
                    ),
                0
            );

        const uniquePayingUsers =
            new Set(
                allPaid
                    .map((payment) =>
                        orderUserMap.get(
                            payment.order_id
                        )
                    )
                    .filter(
                        (
                            userId
                        ): userId is number =>
                            userId !==
                            undefined
                    )
            ).size;

        const currentMonthUniquePayingUsers =
            new Set(
                monthOrderIds
                    .map((orderId) =>
                        orderUserMap.get(
                            orderId
                        )
                    )
                    .filter(
                        (
                            userId
                        ): userId is number =>
                            userId !==
                            undefined
                    )
            ).size;

        return {
            totalRevenue,
            totalPaidPayments:
                allPaid.length,
            uniquePayingUsers,
            averageCheck:
                allPaid.length
                    ? Math.round(
                        totalRevenue /
                        allPaid.length
                    )
                    : 0,
            currentMonthRevenue,
            currentMonthPaidPayments:
                monthPaid.length,
            currentMonthUniquePayingUsers,
        };
    }

    private async findPaymentIdsBySearch(
        search: string
    ): Promise<number[]> {
        const numericSearch =
            /^\d+$/.test(search)
                ? Number(search)
                : null;

        const users =
            await User.findAll({
                where: {
                    [Op.or]: [
                        {
                            username: {
                                [Op.iLike]:
                                    `%${search}%`,
                            },
                        },
                        {
                            firstName: {
                                [Op.iLike]:
                                    `%${search}%`,
                            },
                        },
                        ...(numericSearch !== null
                            ? [
                                {
                                    id:
                                        numericSearch,
                                },
                                {
                                    telegramId:
                                        search,
                                },
                            ]
                            : []),
                    ],
                },
                attributes: [
                    "id",
                ],
            });

        const userIds =
            users.map(
                (user) => user.id
            );

        const orders =
            userIds.length
                ? await Order.findAll({
                    where: {
                        user_id: {
                            [Op.in]:
                                userIds,
                        },
                    },
                    attributes: [
                        "id",
                    ],
                })
                : [];

        const orderIds =
            orders.map(
                (order) => order.id
            );

        const payments =
            await Payment.findAll({
                where: {
                    [Op.or]: [
                        ...(numericSearch !== null
                            ? [
                                {
                                    id:
                                        numericSearch,
                                },
                            ]
                            : []),
                        {
                            provider_payment_id: {
                                [Op.iLike]:
                                    `%${search}%`,
                            },
                        },
                        ...(orderIds.length
                            ? [
                                {
                                    order_id: {
                                        [Op.in]:
                                            orderIds,
                                    },
                                },
                            ]
                            : []),
                    ],
                },
                attributes: [
                    "id",
                ],
            });

        return payments.map(
            (payment) => payment.id
        );
    }

    private serialize(
        payment: Payment
    ): AdminPaymentDto {
        const paymentWithRelations =
            payment as Payment & {
                payment_method?:
                    PaymentMethod | null;
                Order?: Order & {
                    User?: User;
                };
            };

        const order =
            paymentWithRelations.Order;

        const user =
            order?.User;

        if (!order || !user) {
            throw new Error(
                "Payment relations are missing"
            );
        }

        const paymentMethod =
            paymentWithRelations
                .payment_method;

        return {
            id: payment.id,
            providerPaymentId:
                payment.provider_payment_id,
            amount:
                Number(payment.amount),
            currency:
                payment.currency,
            status:
                payment.status,
            paymentUrl:
                payment.payment_url,
            expiresAt:
                payment.expires_at,
            createdAt:
                payment.created_at,
            updatedAt:
                payment.updated_at,
            paymentMethod:
                paymentMethod
                    ? {
                        id:
                            paymentMethod.id,
                        code:
                            paymentMethod.code,
                        name:
                            paymentMethod.name,
                    }
                    : null,
            order: {
                id: order.id,
                planId:
                    order.plan_id,
                planName:
                    order.plan_name,
                durationDays:
                    order.duration_days,
                status:
                    order.status,
            },
            user: {
                id: user.id,
                telegramId:
                    user.telegramId,
                username:
                    user.username,
                firstName:
                    user.firstName,
                marketingSourceId:
                    user.marketing_source_id,
            },
        };
    }
}

export default new AdminPaymentsService();
