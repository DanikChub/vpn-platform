import {
    Percent,
    Users,
    WalletCards,
} from "lucide-react";

import {
    useGetMarketingSourceStatsQuery,
} from "@/entities/marketing-source";

import {
    formatMoney,
} from "@/shared/lib";

import {
    AsyncContent,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/ui";


interface Props {
    sourceId: number;
}


const MarketingSourceStats = ({
                                  sourceId,
                              }: Props) => {

    const {
        data: stats,
        isLoading,
        error,
    } =
        useGetMarketingSourceStatsQuery(
            sourceId
        );


    return (
        <AsyncContent
            isLoading={isLoading}
            isEmpty={!stats}
            errorMessage={
                error
                    ? "Не удалось загрузить статистику источника"
                    : null
            }
        >

            {stats && (
                <div className="grid gap-4">

                    <StatCard
                        icon={Users}
                        title="Регистрации"
                        value={
                            String(
                                stats.users_count
                            )
                        }
                        description={
                            `${stats.paid_users_count} оплатили`
                        }
                    />


                    <StatCard
                        icon={Percent}
                        title="Конверсия"
                        value={
                            `${stats.conversion_rate}%`
                        }
                        description="Из регистрации в оплату"
                    />


                    <StatCard
                        icon={WalletCards}
                        title="Выручка"
                        value={
                            formatMoney(
                                stats.revenue
                            )
                        }
                        description={
                            `${stats.payments_count} платежей`
                        }
                    />

                </div>
            )}

        </AsyncContent>
    );
};


interface StatCardProps {
    title: string;
    value: string;
    description?: string;

    icon: React.ComponentType<{
        className?: string;
    }>;
}


const StatCard = ({
                      title,
                      value,
                      description,
                      icon: Icon,
                  }: StatCardProps) => {

    return (
        <Card>

            <CardHeader className="flex items-center gap-2">

                <CardTitle className="text-sm">
                    {title}
                </CardTitle>

                <Icon className="size-4 text-slate-500" />

            </CardHeader>


            <CardContent>

                <div className="text-2xl font-semibold text-slate-950">
                    {value}
                </div>

                {description && (
                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>
                )}

            </CardContent>

        </Card>
    );
};


export default MarketingSourceStats;