import User from "./user.model";
import MarketingSource from "../marketing-sources/marketing-source.model";
import subscriptionService from "../subscriptions/subscription.service";

import {
    Op,
} from "sequelize";


interface FindOrCrateTelegramUserPayload {
    telegramId: string;
    username: string | null;
    firstName: string | null;
    startPayload?:string;
}

class UserService {
    async findOrCreateTelegramUser(
        payload: FindOrCrateTelegramUserPayload,
    ) {
        let marketingSource:
            MarketingSource | null = null;

        const organicSource =
            await MarketingSource.findOne({
                where: {
                    code: "organic",
                },
            });

        marketingSource = organicSource;

        if (
            payload.startPayload &&
            payload.startPayload.startsWith("m_")
        ) {
            const code =
                payload.startPayload.replace(
                    "m_",
                    ""
                );

            const source =
                await MarketingSource.findOne({
                    where: {
                        code,
                        is_active: true,
                    },
                });

            if (source) {
                marketingSource = source;
            }
        }

        const [user, created] =
            await User.findOrCreate({
                where: {
                    telegramId:
                    payload.telegramId,
                },
                defaults: {
                    telegramId:
                    payload.telegramId,
                    username:
                    payload.username,
                    firstName:
                    payload.firstName,
                    marketing_source_id:
                        marketingSource?.id ?? null,
                }
            });

        if (
            !created &&
            !user.marketing_source_id &&
            marketingSource
        ) {
            user.marketing_source_id =
                marketingSource.id;

            await user.save();
        }

        if (
            created &&
            marketingSource &&
            marketingSource.trial_days > 0
        ) {
            await subscriptionService.extend(
                user.id,
                marketingSource.trial_days
            );
        }

        return user;
    }

    async findByIds(
        ids: number[]
    ): Promise<User[]> {

        if (!ids.length) {
            return [];
        }

        return User.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
        });
    }


    async findBySearch(
        search: string
    ): Promise<User[]> {

        const conditions = [
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
        ];


        if (/^\d+$/.test(search)) {
            conditions.push(
                {
                    id:
                        Number(search),
                } as any,
                {
                    telegramId:
                    search,
                } as any
            );
        }


        return User.findAll({
            where: {
                [Op.or]:
                conditions,
            },
        });
    }
}

export default new UserService();