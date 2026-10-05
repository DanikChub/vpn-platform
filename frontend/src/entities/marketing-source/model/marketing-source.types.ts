export type MarketingSourceType =
    | "telegram"
    | "tiktok"
    | "blogger"
    | "friend"
    | "other";


export interface MarketingSource {

    id: number;

    name: string;

    code: string;

    type: MarketingSourceType;

    is_active: boolean;

    trial_days: number;

    telegram_link: string;

    users_count?: number;


    created_at: string;

    updated_at: string;
}


export interface CreateMarketingSourceDto {

    name: string;

    code: string;

    trial_days: number;

    type: MarketingSourceType;
}


export interface UpdateMarketingSourceDto {

    name?: string;

    code?: string;

    trial_days?: number;

    type?: MarketingSourceType;

    is_active?: boolean;
}


export interface MarketingSourceUser {
    id: number;

    telegramId: string;

    username: string | null;

    firstName: string | null;

    createdAt: string;

    has_paid: boolean;

    payments_count: number;

    revenue: number;
}


export interface MarketingSourceUsersResponse {

    source: {
        id: number;

        name: string;

        code: string;

        type: MarketingSourceType;
    };


    users: MarketingSourceUser[];
}

export interface MarketingSourceStats {
    users_count: number;

    paid_users_count: number;

    conversion_rate: number;

    payments_count: number;

    revenue: number;
}