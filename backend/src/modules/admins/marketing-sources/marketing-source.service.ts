import {
    Op,
} from "sequelize";



import {
    CreateMarketingSourceDto,
    GetMarketingSourcesQuery,
    UpdateMarketingSourceDto,
} from "./marketing-source.types";
import MarketingSource from "../../marketing-sources/marketing-source.model";
import User from "../../users/user.model";
import Order from "../../orders/order.model";
import Payment from "../../payments/payment.model";


class MarketingSourceService {

    private getTelegramLink(
        code: string
    ): string {

        const botUsername =
            process.env.TELEGRAM_BOT_USERNAME
            ?? "vpn_iordan_bot";

        return (
            `https://t.me/${botUsername}` +
            `?start=m_${code}`
        );
    }


    private serialize(
        source: MarketingSource,
        usersCount?: number,
        paidUsersCount?: number
    ) {

        return {
            id: source.id,

            name: source.name,
            code: source.code,
            type: source.type,

            is_active: source.is_active,

            trial_days: source.trial_days,

            telegram_link:
                this.getTelegramLink(
                    source.code
                ),

            users_count:
            usersCount,

            paid_users_count:
            paidUsersCount,

            conversion_rate:
            usersCount
                ? Math.round(
                    ((paidUsersCount ?? 0) /
                        usersCount) *
                    10000
                ) / 100
                : 0,

            created_at:
            source.created_at,

            updated_at:
            source.updated_at,
        };
    }


    async getAll(
        query: GetMarketingSourcesQuery = {}
    ) {

        const where: any = {};


        if (
            query.is_active !== undefined
        ) {
            where.is_active =
                query.is_active;
        }


        if (query.type) {
            where.type =
                query.type;
        }


        if (query.search) {
            where[Op.or] = [
                {
                    name: {
                        [Op.iLike]:
                            `%${query.search}%`,
                    },
                },
                {
                    code: {
                        [Op.iLike]:
                            `%${query.search}%`,
                    },
                },
            ];
        }


        const sources =
            await MarketingSource.findAll({
                where,

                order: [
                    [
                        "created_at",
                        "DESC",
                    ],
                ],
            });


        const result =
            await Promise.all(
                sources.map(
                    async (source) => {

                        const usersCount =
                            await User.count({
                                where: {
                                    marketing_source_id:
                                    source.id,
                                },
                            });


                        const paidUsersCount =
                            await this.getPaidUserIds(
                                source.id
                            );

                        return this.serialize(
                            source,
                            usersCount,
                            paidUsersCount.size
                        );
                    }
                )
            );


        return result;
    }


    async getById(
        id: number
    ) {

        const source =
            await MarketingSource.findByPk(
                id
            );


        if (!source) {
            return null;
        }


        const usersCount =
            await User.count({
                where: {
                    marketing_source_id:
                    source.id,
                },
            });


        const paidUsersCount =
            await this.getPaidUserIds(
                source.id
            );

        return this.serialize(
            source,
            usersCount,
            paidUsersCount.size
        );
    }

    private validateTrialDays(
        trialDays: number
    ): void {
        if (
            !Number.isInteger(trialDays) ||
            trialDays < 0 ||
            trialDays > 365
        ) {
            throw new Error(
                "MARKETING_SOURCE_TRIAL_DAYS_INVALID"
            );
        }
    }

    async create(
        dto: CreateMarketingSourceDto
    ) {

        const code =
            this.normalizeCode(
                dto.code
            );


        this.validateCode(code);


        const exists =
            await MarketingSource.findOne({
                where: {
                    code,
                },
            });


        if (exists) {
            throw new Error(
                "MARKETING_SOURCE_CODE_EXISTS"
            );
        }

        const trialDays = dto.trial_days ?? 0;

        this.validateTrialDays(trialDays);


        const source =
            await MarketingSource.create({
                name: dto.name.trim(),
                code,
                type: dto.type,
                trial_days: trialDays,
            });


        return this.serialize(
            source,
            0
        );
    }


    async update(
        id: number,
        dto: UpdateMarketingSourceDto
    ) {

        const source =
            await MarketingSource.findByPk(
                id
            );


        if (!source) {
            return null;
        }


        if (
            dto.name !== undefined
        ) {
            source.name =
                dto.name.trim();
        }


        if (
            dto.type !== undefined
        ) {
            source.type =
                dto.type;
        }


        if (
            dto.is_active !== undefined
        ) {
            source.is_active =
                dto.is_active;
        }

        if (dto.trial_days !== undefined) {
            this.validateTrialDays(dto.trial_days);
            source.trial_days = dto.trial_days;
        }


        if (
            dto.code !== undefined
        ) {

            const code =
                this.normalizeCode(
                    dto.code
                );


            this.validateCode(code);


            const existing =
                await MarketingSource.findOne({
                    where: {
                        code,

                        id: {
                            [Op.ne]: id,
                        },
                    },
                });


            if (existing) {
                throw new Error(
                    "MARKETING_SOURCE_CODE_EXISTS"
                );
            }


            source.code = code;
        }


        await source.save();


        const usersCount =
            await User.count({
                where: {
                    marketing_source_id:
                    source.id,
                },
            });


        const paidUsersCount =
            await this.getPaidUserIds(
                source.id
            );

        return this.serialize(
            source,
            usersCount,
            paidUsersCount.size
        );
    }


    async archive(
        id: number
    ) {

        const source =
            await MarketingSource.findByPk(
                id
            );


        if (!source) {
            return null;
        }


        source.is_active = false;

        await source.save();


        const usersCount =
            await User.count({
                where: {
                    marketing_source_id:
                    source.id,
                },
            });


        const paidUsersCount =
            await this.getPaidUserIds(
                source.id
            );

        return this.serialize(
            source,
            usersCount,
            paidUsersCount.size
        );
    }


    async restore(
        id: number
    ) {

        const source =
            await MarketingSource.findByPk(
                id
            );


        if (!source) {
            return null;
        }


        source.is_active = true;

        await source.save();


        const usersCount =
            await User.count({
                where: {
                    marketing_source_id:
                    source.id,
                },
            });


        const paidUsersCount =
            await this.getPaidUserIds(
                source.id
            );

        return this.serialize(
            source,
            usersCount,
            paidUsersCount.size
        );
    }


    private normalizeCode(
        code: string
    ): string {

        return code
            .trim()
            .toLowerCase();
    }


    private validateCode(
        code: string
    ): void {

        if (!code) {
            throw new Error(
                "MARKETING_SOURCE_CODE_REQUIRED"
            );
        }


        /*
         * Telegram payload будет:
         *
         * m_${code}
         *
         * Поэтому ограничиваем код
         * безопасными символами.
         */
        if (
            !/^[a-z0-9_-]+$/.test(
                code
            )
        ) {
            throw new Error(
                "MARKETING_SOURCE_CODE_INVALID"
            );
        }


        /*
         * Оставляем место под m_
         */
        if (
            code.length > 60
        ) {
            throw new Error(
                "MARKETING_SOURCE_CODE_TOO_LONG"
            );
        }
    }

    async getUsers(
        id:number
    ) {

        const source =
            await MarketingSource.findByPk(
                id
            );


        if(!source){
            return null;
        }


        const users =
            await User.findAll({
                where:{
                    marketing_source_id:
                    id,
                },

                attributes:[
                    "id",
                    "telegramId",
                    "username",
                    "firstName",
                    "createdAt",
                ],

                order:[
                    [
                        "created_at",
                        "DESC",
                    ],
                ],
            });


        const paymentStats =
            await this.getUsersPaymentStats(
                id
            );

        return {
            source:{
                id:source.id,
                name:source.name,
                code:source.code,
                type:source.type,
            },

            users:
                users.map((user) => {

                    const stats =
                        paymentStats.usersStats.get(
                            user.id
                        );

                    return {
                        ...user.toJSON(),

                        has_paid:
                            paymentStats
                                .paidUserIds
                                .has(
                                    user.id
                                ),

                        payments_count:
                            stats?.payments_count
                            ?? 0,

                        revenue:
                            stats?.revenue
                            ?? 0,
                    };
                }),
        };
    }

    private async getPaidUserIds(
        marketingSourceId: number
    ): Promise<Set<number>> {
        const users =
            await User.findAll({
                where: {
                    marketing_source_id:
                        marketingSourceId,
                },
                attributes: [
                    "id",
                ],
            });

        const userIds =
            users.map(
                (user) => user.id
            );

        if (!userIds.length) {
            return new Set();
        }

        const orders =
            await Order.findAll({
                where: {
                    user_id: {
                        [Op.in]:
                            userIds,
                    },
                },
                attributes: [
                    "id",
                    "user_id",
                ],
            });

        if (!orders.length) {
            return new Set();
        }

        const orderIds =
            orders.map(
                (order) => order.id
            );

        const paidPayments =
            await Payment.findAll({
                where: {
                    status: "paid",
                    order_id: {
                        [Op.in]:
                            orderIds,
                    },
                },
                attributes: [
                    "order_id",
                ],
            });

        const paidOrderIds =
            new Set(
                paidPayments.map(
                    (payment) =>
                        payment.order_id
                )
            );

        return new Set(
            orders
                .filter((order) =>
                    paidOrderIds.has(
                        order.id
                    )
                )
                .map(
                    (order) =>
                        order.user_id
                )
        );
    }

    private async getUsersPaymentStats(
        marketingSourceId: number
    ) {
        const users =
            await User.findAll({
                where: {
                    marketing_source_id:
                    marketingSourceId,
                },

                attributes: [
                    "id",
                ],
            });

        const userIds =
            users.map(
                (user) => user.id
            );

        if (!userIds.length) {
            return {
                paidUserIds:
                    new Set<number>(),

                usersStats:
                    new Map<
                        number,
                        {
                            payments_count: number;
                            revenue: number;
                        }
                    >(),

                revenue: 0,

                paymentsCount: 0,
            };
        }

        const orders =
            await Order.findAll({
                where: {
                    user_id: {
                        [Op.in]:
                        userIds,
                    },
                },

                attributes: [
                    "id",
                    "user_id",
                ],
            });

        if (!orders.length) {
            return {
                paidUserIds:
                    new Set<number>(),

                usersStats:
                    new Map<
                        number,
                        {
                            payments_count: number;
                            revenue: number;
                        }
                    >(),

                revenue: 0,

                paymentsCount: 0,
            };
        }

        const orderIds =
            orders.map(
                (order) => order.id
            );

        const paidPayments =
            await Payment.findAll({
                where: {
                    status: "paid",

                    order_id: {
                        [Op.in]:
                        orderIds,
                    },
                },

                attributes: [
                    "order_id",
                    "amount",
                ],
            });

        const orderUserMap =
            new Map(
                orders.map(
                    (order) => [
                        order.id,
                        order.user_id,
                    ]
                )
            );

        const paidUserIds =
            new Set<number>();

        let revenue = 0;

        const usersStats =
            new Map<
                number,
                {
                    payments_count: number;
                    revenue: number;
                }
            >();

        for (
            const payment
            of paidPayments
            ) {
            revenue +=
                payment.amount;


            const userId =
                orderUserMap.get(
                    payment.order_id
                );


            if (userId === undefined) {
                continue;
            }


            paidUserIds.add(
                userId
            );


            const current =
                usersStats.get(
                    userId
                ) ?? {
                    payments_count: 0,
                    revenue: 0,
                };


            current.payments_count += 1;

            current.revenue +=
                payment.amount;


            usersStats.set(
                userId,
                current
            );
        }

        return {
            paidUserIds,
            usersStats,
            revenue,

            paymentsCount:
            paidPayments.length,
        };
    }

    async getStats(
        id: number
    ) {
        const source =
            await MarketingSource.findByPk(
                id
            );

        if (!source) {
            return null;
        }

        const usersCount =
            await User.count({
                where: {
                    marketing_source_id:
                    id,
                },
            });

        const paymentStats =
            await this.getUsersPaymentStats(
                id
            );

        const paidUsersCount =
            paymentStats.paidUserIds.size;

        return {
            users_count:
            usersCount,

            paid_users_count:
            paidUsersCount,

            conversion_rate:
                usersCount > 0
                    ? Math.round(
                    (
                        paidUsersCount /
                        usersCount
                    ) *
                    10000
                ) / 100
                    : 0,

            payments_count:
            paymentStats.paymentsCount,

            revenue:
            paymentStats.revenue,
        };
    }
}


export default
new MarketingSourceService();