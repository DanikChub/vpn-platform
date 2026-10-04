import {
    useGetNodeTrafficPeriodQuery,
    useSetNodeTrafficPeriodMutation,
} from "@/entities/vpn-node";

import {
    Button,
    Card,
    CardContent,
    Input,
    Modal,
} from "@/shared/ui";

import {
    useState,
} from "react";


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

    const [
        isOpen,
        setIsOpen,
    ] =
        useState(false);


    if (isLoading) {
        return (
            <TrafficCard>
                <div className="text-sm text-slate-500">
                    Загрузка...
                </div>
            </TrafficCard>
        );
    }


    if (error) {
        return (
            <TrafficCard>
                <div className="text-sm text-red-600">
                    Не удалось загрузить статистику
                </div>
            </TrafficCard>
        );
    }


    if (!period) {
        return (
            <>
                <button
                    className="w-full text-left"
                    onClick={() => {
                        setIsOpen(true);
                    }}
                    type="button"
                >
                    <TrafficCard>
                        <div className="text-sm text-slate-500">
                            Расчётный период не настроен
                        </div>

                        <div className="mt-3 text-sm font-medium text-slate-900">
                            Настроить →
                        </div>
                    </TrafficCard>
                </button>

                <CreateTrafficPeriodModal
                    isOpen={
                        isOpen
                    }
                    nodeId={
                        nodeId
                    }
                    onClose={() => {
                        setIsOpen(false);
                    }}
                />
            </>
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
        <TrafficCard>

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

        </TrafficCard>
    );
};


interface CreateTrafficPeriodModalProps {
    nodeId: number;
    isOpen: boolean;
    onClose: () => void;
}


function CreateTrafficPeriodModal({
                                      nodeId,
                                      isOpen,
                                      onClose,
                                  }: CreateTrafficPeriodModalProps) {

    const [
        limitGb,
        setLimitGb,
    ] =
        useState("");


    const [
        startedAt,
        setStartedAt,
    ] =
        useState(
            getTodayInputValue(),
        );


    const [
        endsAt,
        setEndsAt,
    ] =
        useState("");


    const [
        formError,
        setFormError,
    ] =
        useState<string | null>(
            null,
        );


    const [
        setTrafficPeriod,
        {
            isLoading:
                isSaving,
        },
    ] =
        useSetNodeTrafficPeriodMutation();


    const handleSave =
        async () => {

            setFormError(
                null,
            );


            const parsedLimit =
                Number(
                    limitGb,
                );


            if (
                !Number.isFinite(
                    parsedLimit,
                ) ||
                parsedLimit <= 0
            ) {
                setFormError(
                    "Укажи лимит трафика больше 0 GB",
                );

                return;
            }


            if (!startedAt) {
                setFormError(
                    "Укажи начало периода",
                );

                return;
            }


            if (
                endsAt &&
                endsAt <= startedAt
            ) {
                setFormError(
                    "Конец периода должен быть позже начала",
                );

                return;
            }


            /*
             * На backend BIGINT передаём строкой.
             *
             * Здесь используем GiB:
             * 1 GB в интерфейсе =
             * 1024^3 байт.
             */
            const limitBytes =
                BigInt(
                    Math.round(
                        parsedLimit *
                        GIB,
                    ),
                ).toString();


            try {

                await setTrafficPeriod({
                    nodeId,

                    data: {
                        startedAt:
                            localDateToIso(
                                startedAt,
                            ),

                        endsAt:
                            endsAt
                                ? localDateToIso(
                                    endsAt,
                                )
                                : null,

                        limitBytes,
                    },
                }).unwrap();


                onClose();

            } catch {
                setFormError(
                    "Не удалось сохранить расчётный период",
                );
            }
        };


    return (
        <Modal
            isOpen={
                isOpen
            }
            onClose={() => {
                if (!isSaving) {
                    onClose();
                }
            }}
            title="Настройка трафика"
        >

            <div className="space-y-5">

                <Input
                    label="Лимит трафика, GB"
                    min="0"
                    step="1"
                    type="number"
                    value={
                        limitGb
                    }
                    onChange={(
                        event
                    ) => {
                        setLimitGb(
                            event.target.value,
                        );
                    }}
                    placeholder="512"
                />


                <Input
                    label="Начало периода"
                    type="date"
                    value={
                        startedAt
                    }
                    onChange={(
                        event
                    ) => {
                        setStartedAt(
                            event.target.value,
                        );
                    }}
                />


                <Input
                    label="Конец периода"
                    type="date"
                    value={
                        endsAt
                    }
                    onChange={(
                        event
                    ) => {
                        setEndsAt(
                            event.target.value,
                        );
                    }}
                />


                <div className="text-xs text-slate-500">
                    Если дата окончания неизвестна,
                    оставь поле пустым.
                </div>


                {formError && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >
                        {formError}
                    </div>
                )}


                <div className="flex justify-end gap-3">

                    <Button
                        disabled={
                            isSaving
                        }
                        onClick={
                            onClose
                        }
                        variant="ghost"
                    >
                        Отмена
                    </Button>


                    <Button
                        disabled={
                            isSaving
                        }
                        onClick={
                            handleSave
                        }
                    >
                        {isSaving
                            ? "Сохранение..."
                            : "Сохранить"}
                    </Button>

                </div>

            </div>

        </Modal>
    );
}


function TrafficCard({
                         children,
                     }: {
    children:
        React.ReactNode;
}) {
    return (
        <Card>
            <CardContent>

                <CardTitle>
                    Трафик
                </CardTitle>

                <div className="mt-5">
                    {children}
                </div>

            </CardContent>
        </Card>
    );
}


function CardTitle({
                       children,
                   }: {
    children:
        React.ReactNode;
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


function getTodayInputValue():
    string {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1,
        ).padStart(
            2,
            "0",
        );

    const day =
        String(
            now.getDate(),
        ).padStart(
            2,
            "0",
        );

    return `${year}-${month}-${day}`;
}


function localDateToIso(
    value: string,
): string {

    /*
     * Не используем:
     *
     * new Date("2026-10-05")
     *
     * потому что такая строка трактуется
     * как UTC.
     *
     * Создаём локальную полночь явно.
     */

    const [
        year,
        month,
        day,
    ] =
        value
            .split("-")
            .map(Number);


    return new Date(
        year,
        month - 1,
        day,
        0,
        0,
        0,
        0,
    ).toISOString();
}


export default NodeTrafficCard;