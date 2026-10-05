import {
    Op,
    type WhereOptions,
} from "sequelize";

import paymentService
    from "../../payments/payment.service";

import paymentMethodService
    from "../../payments/payment-method.service";

import orderService
    from "../../orders/order.service";

import userService
    from "../../users/user.service";

import type Payment
    from "../../payments/payment.model";

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
            Object.assign(
                where,
                {
                    status:
                    query.status,
                }
            );
        }


        if (
            query.from ||
            query.to
        ) {

            const createdAt: {
                [Op.gte]?: Date;
                [Op.lte]?: Date;
            } = {};


            if (query.from) {
                createdAt[Op.gte] =
                    query.from;
            }


            if (query.to) {
                createdAt[Op.lte] =
                    query.to;
            }


            Object.assign(
                where,
                {
                    created_at:
                    createdAt,
                }
            );
        }


        if (query.search) {

            const paymentIds =
                await this.findPaymentIdsBySearch(
                    query.search
                );


            Object.assign(
                where,
                {
                    id: {
                        [Op.in]:
                        paymentIds,
                    },
                }
            );
        }


        const offset =
            (
                query.page - 1
            ) * query.limit;


        const {
            rows,
            count,
        } =
            await paymentService.findAll({
                where,

                limit:
                query.limit,

                offset,
            });


        const payments =
            await this.serializeMany(
                rows
            );


        return {
            payments,

            pagination: {
                page:
                query.page,

                limit:
                query.limit,

                total:
                count,

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

        const now =
            new Date();


        const monthStart =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );


        const [
            allPaid,
            monthPaid,
        ] =
            await Promise.all([
                paymentService.findPaid(),
                paymentService.findPaid(
                    monthStart
                ),
            ]);


        const orderIds =
            [
                ...new Set(
                    allPaid.map(
                        (payment) =>
                            payment.order_id
                    )
                ),
            ];


        const orders =
            await orderService.findByIds(
                orderIds
            );


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
                (
                    sum,
                    payment
                ) =>
                    sum +
                    Number(
                        payment.amount
                    ),
                0
            );


        const currentMonthRevenue =
            monthPaid.reduce(
                (
                    sum,
                    payment
                ) =>
                    sum +
                    Number(
                        payment.amount
                    ),
                0
            );


        const uniquePayingUsers =
            this.countUniqueUsers(
                allPaid,
                orderUserMap
            );


        const currentMonthUniquePayingUsers =
            this.countUniqueUsers(
                monthPaid,
                orderUserMap
            );


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

        const users =
            await userService.findBySearch(
                search
            );


        const userIds =
            users.map(
                (user) =>
                    user.id
            );


        const orders =
            await orderService.findByUserIds(
                userIds
            );


        const orderIds =
            new Set(
                orders.map(
                    (order) =>
                        order.id
                )
            );


        /*
         * PaymentService пока умеет
         * фильтровать через WhereOptions.
         *
         * Это всё ещё нормально:
         * Sequelize остаётся внутри
         * payment-модуля.
         */
        const conditions: WhereOptions[] = [
            {
                provider_payment_id: {
                    [Op.iLike]:
                        `%${search}%`,
                },
            },
        ];


        if (orderIds.size) {
            conditions.push({
                order_id: {
                    [Op.in]:
                        [...orderIds],
                },
            });
        }


        if (/^\d+$/.test(search)) {
            conditions.push({
                id:
                    Number(search),
            });
        }


        const result =
            await paymentService.findAll({
                where: {
                    [Op.or]:
                    conditions,
                },

                /*
                 * Для MVP этого более
                 * чем достаточно.
                 *
                 * Позже можно вынести
                 * отдельный findIds().
                 */
                limit:
                    1000,

                offset:
                    0,
            });


        return result.rows.map(
            (payment) =>
                payment.id
        );
    }


    private async serializeMany(
        payments: Payment[]
    ): Promise<AdminPaymentDto[]> {

        if (!payments.length) {
            return [];
        }


        const orderIds =
            [
                ...new Set(
                    payments.map(
                        (payment) =>
                            payment.order_id
                    )
                ),
            ];


        const paymentMethodIds =
            [
                ...new Set(
                    payments.map(
                        (payment) =>
                            payment.payment_method_id
                    )
                ),
            ];


        const [
            orders,
            paymentMethods,
        ] =
            await Promise.all([
                orderService.findByIds(
                    orderIds
                ),

                paymentMethodService.findByIds(
                    paymentMethodIds
                ),
            ]);


        const userIds =
            [
                ...new Set(
                    orders.map(
                        (order) =>
                            order.user_id
                    )
                ),
            ];


        const users =
            await userService.findByIds(
                userIds
            );


        const orderMap =
            new Map(
                orders.map(
                    (order) => [
                        order.id,
                        order,
                    ]
                )
            );


        const userMap =
            new Map(
                users.map(
                    (user) => [
                        user.id,
                        user,
                    ]
                )
            );


        const paymentMethodMap =
            new Map(
                paymentMethods.map(
                    (method) => [
                        method.id,
                        method,
                    ]
                )
            );


        return payments.map(
            (payment) => {

                const order =
                    orderMap.get(
                        payment.order_id
                    );


                if (!order) {
                    throw new Error(
                        `Order ${payment.order_id} not found for payment ${payment.id}`
                    );
                }


                const user =
                    userMap.get(
                        order.user_id
                    );


                if (!user) {
                    throw new Error(
                        `User ${order.user_id} not found for payment ${payment.id}`
                    );
                }


                const paymentMethod =
                    paymentMethodMap.get(
                        payment.payment_method_id
                    );


                return {
                    id:
                    payment.id,

                    providerPaymentId:
                    payment.provider_payment_id,

                    amount:
                        Number(
                            payment.amount
                        ),

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
                        id:
                        order.id,

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
                        id:
                        user.id,

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
        );
    }


    private countUniqueUsers(
        payments: Payment[],
        orderUserMap: Map<
            number,
            number
        >
    ): number {

        return new Set(
            payments
                .map(
                    (payment) =>
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
    }
}


export default new AdminPaymentsService();