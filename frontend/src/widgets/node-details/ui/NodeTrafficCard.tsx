import {
    useGetNodeTrafficPeriodQuery,
} from "@/entities/vpn-node";

import {
    Card,
    CardContent,
} from "@/shared/ui";


interface NodeTrafficCardProps {
    nodeId: number;
}


const GIB =
    1024 ** 3;


const NodeTrafficCard = ({
                             nodeId,
                         }: NodeTrafficCardProps) => {

    const {
        data: period,
        isLoading,
        error,
    } =
        useGetNodeTrafficPeriodQuery(
            nodeId,
        );


    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <CardTitle>
                        Трафик
                    </CardTitle>

                    <div className="mt-5 text-sm text-slate-500">
                        Загрузка...
                    </div>
                </CardContent>
            </Card>
        );
    }


    if (error) {
        return (
            <Card>
                <CardContent>
                    <CardTitle>
                        Трафик
                    </CardTitle>

                    <div className="mt-5 text-sm text-red-600">
                        Не удалось загрузить статистику
                    </div>
                </CardContent>
            </Card>
        );
    }


    if (!period) {
        return (
            <Card>
                <CardContent>
                    <CardTitle>
                        Трафик
                    </CardTitle>

                    <div className="mt-5 text-sm text-slate-500">
                        Расчётный период не настроен
                    </div>
                </CardContent>
            </Card>
        );
    }


    const usedBytes =
        Number(
            period.usedBytes,
        );

    const limitBytes =
        period.limitBytes !== null
            ? Number(
                period.limitBytes,
            )
            : null;


    const usedGiB =
        usedBytes /
        GIB;


    const limitGiB =
        limitBytes !== null
            ? limitBytes / GIB
            : null;


    const percentage =
        limitBytes !== null &&
        limitBytes > 0
            ? Math.min(
                usedBytes /
                limitBytes *
                100,
                100,
            )
            : null;


    const remainingGiB =
        limitGiB !== null
            ? Math.max(
                limitGiB -
                usedGiB,
                0,
            )
            : null;


    return (
        <Card>
            <CardContent>

                <CardTitle>
                    Трафик
                </CardTitle>


                <div className="mt-5">

                    <div className="flex items-end justify-between gap-4">

                        <div>
                            <div className="text-2xl font-semibold text-slate-950">
                                {formatGiB(
                                    usedGiB,
                                )}

                                {limitGiB !== null && (
                                    <>
                                        {" / "}
                                        {formatGiB(
                                            limitGiB,
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mt-1 text-sm text-slate-500">
                                Использовано
                            </div>
                        </div>


                        {percentage !== null && (
                            <div className="text-sm font-medium text-slate-700">
                                {percentage.toFixed(
                                    1,
                                )}
                                %
                            </div>
                        )}

                    </div>


                    {percentage !== null && (
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                            <div
                                className="h-full rounded-full bg-slate-900 transition-all"
                                style={{
                                    width:
                                        `${percentage}%`,
                                }}
                            />

                        </div>
                    )}


                    <div className="mt-6 space-y-4">

                        <InfoRow
                            label="Осталось"
                            value={
                                remainingGiB !== null
                                    ? formatGiB(
                                        remainingGiB,
                                    )
                                    : "Без лимита"
                            }
                        />


                        <InfoRow
                            label="Начало периода"
                            value={
                                formatPeriodDate(
                                    period.startedAt,
                                )
                            }
                        />


                        <InfoRow
                            label="Конец периода"
                            value={
                                period.endsAt
                                    ? formatPeriodDate(
                                        period.endsAt,
                                    )
                                    : "Не ограничен"
                            }
                        />

                    </div>

                </div>

            </CardContent>
        </Card>
    );
};


function CardTitle({
                       children,
                   }: {
    children: React.ReactNode;
}) {
    return (
        <h2 className="text-lg font-semibold text-slate-950">
            {children}
        </h2>
    );
}


function InfoRow({
                     label,
                     value,
                 }: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">

            <span className="text-slate-500">
                {label}
            </span>

            <span className="font-medium text-slate-900">
                {value}
            </span>

        </div>
    );
}


function formatGiB(
    value: number,
): string {

    if (value >= 100) {
        return `${value.toFixed(0)} GB`;
    }

    if (value >= 10) {
        return `${value.toFixed(1)} GB`;
    }

    return `${value.toFixed(2)} GB`;
}


function formatPeriodDate(
    value: string,
): string {

    return new Intl.DateTimeFormat(
        "ru-RU",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",
        },
    ).format(
        new Date(
            value,
        ),
    );
}


export default NodeTrafficCard;