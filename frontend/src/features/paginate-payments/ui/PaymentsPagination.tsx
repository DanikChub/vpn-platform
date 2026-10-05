import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    Button,
} from "@/shared/ui";


interface PaymentsPaginationProps {

    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    isLoading: boolean;

    onPreviousPage: () => void;
    onNextPage: () => void;
}


export function PaymentsPagination({
                                       pagination,
                                       isLoading,
                                       onPreviousPage,
                                       onNextPage,
                                   }: PaymentsPaginationProps) {

    return (
        <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
                Всего платежей:{" "}
                <span className="font-medium text-slate-700">
                    {pagination.total}
                </span>
            </p>


            <div className="flex items-center gap-3">

                <span className="text-sm text-slate-500">
                    {pagination.page}
                    {" / "}
                    {Math.max(
                        pagination.totalPages,
                        1
                    )}
                </span>


                <Button
                    disabled={
                        isLoading ||
                        pagination.page <= 1
                    }
                    onClick={
                        onPreviousPage
                    }
                    size="icon"
                    variant="outline"
                >
                    <ChevronLeft className="size-4" />
                </Button>


                <Button
                    disabled={
                        isLoading ||
                        pagination.page >=
                        pagination.totalPages
                    }
                    onClick={
                        onNextPage
                    }
                    size="icon"
                    variant="outline"
                >
                    <ChevronRight className="size-4" />
                </Button>

            </div>

        </div>
    );
}