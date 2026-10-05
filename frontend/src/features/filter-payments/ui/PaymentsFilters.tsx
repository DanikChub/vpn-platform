import type {
    PaymentStatus,
} from "@/entities/payment";

import {
    Input,
} from "@/shared/ui";


export type PaymentStatusFilter =
    | "all"
    | PaymentStatus;


interface PaymentsFiltersProps {
    search: string;
    status: PaymentStatusFilter;

    onSearchChange: (
        value: string
    ) => void;

    onStatusChange: (
        value: PaymentStatusFilter
    ) => void;
}


export function PaymentsFilters({
                                    search,
                                    status,
                                    onSearchChange,
                                    onStatusChange,
                                }: PaymentsFiltersProps) {

    return (
        <div className="flex flex-col gap-3 sm:flex-row">

            <Input
                className="sm:max-w-sm"
                onChange={(event) => {
                    onSearchChange(
                        event.target.value
                    );
                }}
                placeholder="ID, пользователь, Telegram..."
                value={search}
            />


            <select
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                onChange={(event) => {
                    onStatusChange(
                        event.target.value as PaymentStatusFilter
                    );
                }}
                value={status}
            >
                <option value="all">
                    Все статусы
                </option>

                <option value="paid">
                    Оплаченные
                </option>

                <option value="pending">
                    Ожидают оплаты
                </option>

                <option value="failed">
                    Ошибка
                </option>

                <option value="cancelled">
                    Отменённые
                </option>

                <option value="expired">
                    Истёкшие
                </option>
            </select>

        </div>
    );
}