import {
    useEffect,
    useState,
} from "react";

import {
    Receipt,
} from "lucide-react";

import {
    PaymentsTable,
    useGetPaymentsQuery,
} from "@/entities/payment";

import {
    PaymentsFilters,
    type PaymentStatusFilter,
} from "@/features/filter-payments";

import {
    PaymentsPagination,
} from "@/features/paginate-payments";

import {
    AsyncContent,
} from "@/shared/ui";


const PAYMENTS_LIMIT = 10;

const SEARCH_DEBOUNCE_DELAY =
    400;


export function PaymentsList() {

    const [
        page,
        setPage,
    ] =
        useState(1);


    const [
        search,
        setSearch,
    ] =
        useState("");


    const [
        debouncedSearch,
        setDebouncedSearch,
    ] =
        useState("");


    const [
        status,
        setStatus,
    ] =
        useState<PaymentStatusFilter>(
            "all"
        );


    useEffect(() => {

        const timeoutId =
            window.setTimeout(
                () => {
                    setDebouncedSearch(
                        search.trim()
                    );

                    setPage(1);
                },
                SEARCH_DEBOUNCE_DELAY
            );


        return () =>
            window.clearTimeout(
                timeoutId
            );

    }, [search]);


    const {
        data,
        isLoading,
        isFetching,
        error,
    } =
        useGetPaymentsQuery({
            page,
            limit:
            PAYMENTS_LIMIT,

            search:
                debouncedSearch ||
                undefined,

            status:
                status === "all"
                    ? undefined
                    : status,
        });


    const payments =
        data?.payments ?? [];


    const pagination =
        data?.pagination;


    return (
        <div className="space-y-5">

            <PaymentsFilters
                search={search}
                status={status}
                onSearchChange={
                    setSearch
                }
                onStatusChange={
                    (value) => {
                        setStatus(
                            value
                        );

                        setPage(1);
                    }
                }
            />


            <AsyncContent
                emptyDescription="Попробуйте изменить поисковый запрос или выбранный статус."
                emptyIcon={
                    <Receipt className="size-6" />
                }
                emptyTitle="Платежи не найдены"
                errorMessage={
                    error
                        ? "Не удалось загрузить платежи"
                        : null
                }
                isEmpty={
                    payments.length ===
                    0
                }
                isLoading={
                    isLoading
                }
            >

                <PaymentsTable
                    payments={
                        payments
                    }
                />

            </AsyncContent>


            {pagination && (
                <PaymentsPagination
                    isLoading={
                        isFetching
                    }
                    pagination={
                        pagination
                    }
                    onNextPage={() => {
                        setPage(
                            (current) =>
                                Math.min(
                                    pagination.totalPages,
                                    current + 1
                                )
                        );
                    }}
                    onPreviousPage={() => {
                        setPage(
                            (current) =>
                                Math.max(
                                    1,
                                    current - 1
                                )
                        );
                    }}
                />
            )}

        </div>
    );
}