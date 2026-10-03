import type {
    ReactNode,
} from "react";

import {
    Card,
    CardContent,
    EmptyState,
    Spinner,
} from "@/shared/ui";


interface AsyncContentProps {
    isLoading: boolean;
    errorMessage?: string | null;

    isEmpty?: boolean;

    emptyTitle?: string;
    emptyDescription?: string;
    emptyIcon?: ReactNode;

    children: ReactNode;
}


const AsyncContent = ({
                          isLoading,
                          errorMessage,

                          isEmpty = false,

                          emptyTitle = "Ничего не найдено",
                          emptyDescription,
                          emptyIcon,

                          children,
                      }: AsyncContentProps) => {

    if (errorMessage) {
        return (
            <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
            >
                {errorMessage}
            </div>
        );
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex min-h-72 items-center justify-center">
                    <Spinner size="lg" />
                </CardContent>
            </Card>
        );
    }

    if (isEmpty) {
        return (
            <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                icon={emptyIcon}
            />
        );
    }

    return children;
};


export default AsyncContent;