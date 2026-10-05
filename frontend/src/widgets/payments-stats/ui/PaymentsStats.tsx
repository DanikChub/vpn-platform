import {
    CreditCard,
    Receipt,
    Users,
    WalletCards,
} from "lucide-react";

import {
    useGetPaymentStatsQuery,
} from "@/entities/payment";

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


export function PaymentsStats() {

    const {
        data,
        isLoading,
        error,
    } =
        useGetPaymentStatsQuery();


    const stats =
        data?.stats;


    return (
        <AsyncContent
            errorMessage={
                error
                    ? "Не удалось загрузить статистику платежей"
                    : null
            }
            isEmpty={!stats}
            isLoading={isLoading}
        >

            {stats && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        icon={WalletCards}
                        title="Доход"
                        value={
                            formatMoney(
                                stats.totalRevenue
                            )
                        }
                        description={
                            `${stats.totalPaidPayments} платежей`
                        }
                    />


                    <StatCard
                        icon={Receipt}
                        title="За месяц"
                        value={
                            formatMoney(
                                stats.currentMonthRevenue
                            )
                        }
                        description={
                            `${stats.currentMonthPaidPayments} платежей`
                        }
                    />


                    <StatCard
                        icon={Users}
                        title="Платящие"
                        value={
                            String(
                                stats.uniquePayingUsers
                            )
                        }
                        description={
                            `${stats.currentMonthUniquePayingUsers} за месяц`
                        }
                    />


                    <StatCard
                        icon={CreditCard}
                        title="Средний чек"
                        value={
                            formatMoney(
                                stats.averageCheck
                            )
                        }
                    />

                </div>
            )}

        </AsyncContent>
    );
}


interface StatCardProps {
    title: string;
    value: string;
    description?: string;

    icon: React.ComponentType<{
        className?: string;
    }>;
}


function StatCard({
                      title,
                      value,
                      description,
                      icon: Icon,
                  }: StatCardProps) {

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
}