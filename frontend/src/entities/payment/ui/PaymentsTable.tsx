import type {
    Payment,
} from "@/entities/payment";

import {
    PaymentStatusBadge,
} from "@/entities/payment";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui";

import {
    formatDate,
    formatMoney,
} from "@/shared/lib";


interface PaymentsTableProps {
    payments: Payment[];
}


export function PaymentsTable({
                                  payments,
                              }: PaymentsTableProps) {

    return (
        <TableContainer>
            <Table>

                <TableHeader>
                    <TableRow>

                        <TableHead>
                            ID
                        </TableHead>

                        <TableHead>
                            Пользователь
                        </TableHead>

                        <TableHead>
                            Тариф
                        </TableHead>

                        <TableHead>
                            Сумма
                        </TableHead>

                        <TableHead>
                            Метод
                        </TableHead>

                        <TableHead>
                            Статус
                        </TableHead>

                        <TableHead>
                            Дата
                        </TableHead>

                    </TableRow>
                </TableHeader>


                <TableBody>

                    {payments.map(
                        (payment) => (

                            <TableRow
                                key={
                                    payment.id
                                }
                            >

                                <TableCell>
                                    {payment.id}
                                </TableCell>


                                <TableCell>
                                    <div>

                                        <p className="font-medium text-slate-950">
                                            {
                                                payment.user.firstName ||
                                                "Без имени"
                                            }
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {
                                                payment.user.username
                                                    ? `@${payment.user.username}`
                                                    : payment.user.telegramId
                                            }
                                        </p>

                                    </div>
                                </TableCell>


                                <TableCell>
                                    <div>

                                        <p className="font-medium text-slate-950">
                                            {
                                                payment.order.planName
                                            }
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {
                                                payment.order.durationDays
                                            } дн.
                                        </p>

                                    </div>
                                </TableCell>


                                <TableCell>
                                    {formatMoney(
                                        payment.amount
                                    )}
                                </TableCell>


                                <TableCell>
                                    {
                                        payment.paymentMethod?.name ??
                                        "—"
                                    }
                                </TableCell>


                                <TableCell>
                                    <PaymentStatusBadge
                                        status={
                                            payment.status
                                        }
                                    />
                                </TableCell>


                                <TableCell>
                                    {formatDate(
                                        payment.createdAt
                                    )}
                                </TableCell>

                            </TableRow>

                        )
                    )}

                </TableBody>

            </Table>
        </TableContainer>
    );
}