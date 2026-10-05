import {
    Copy,
    ExternalLink,
    Link,
} from "lucide-react";

import {
    useGetMarketingSourceQuery,
} from "@/entities/marketing-source";

import {
    formatDate,
} from "@/shared/lib";

import {
    AsyncContent,
    Badge,
    Button,
    Card,
    CardContent,
    DetailsRow,
} from "@/shared/ui";
import {toast} from "sonner";


interface Props {
    sourceId: number;
}


const MarketingSourceInfo = ({
                                 sourceId,
                             }: Props) => {

    const {
        data: source,
        isLoading,
        error,
    } =
        useGetMarketingSourceQuery(
            sourceId
        );


    return (
        <AsyncContent
            isLoading={isLoading}
            isEmpty={!source}
            errorMessage={
                error
                    ? "Не удалось загрузить источник"
                    : null
            }
            emptyTitle="Источник не найден"
            emptyDescription=""
            emptyIcon={
                <Link className="size-6" />
            }
        >

            {source && (
                <Card className="h-full">

                    <CardContent>

                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">
                                    {source.name}
                                </h2>

                                <div className="mt-2 flex items-center gap-2">

                                    <Badge>
                                        {source.type}
                                    </Badge>

                                    <Badge
                                        variant={
                                            source.is_active
                                                ? "success"
                                                : "danger"
                                        }
                                    >
                                        {source.is_active
                                            ? "Активен"
                                            : "Отключён"}
                                    </Badge>

                                </div>
                            </div>

                        </div>


                        <div className="mt-6 space-y-4">

                            <DetailsRow
                                label="Код"
                                value={
                                    source.code
                                }
                                monospace
                            />

                            <DetailsRow
                                label="Тестовый период"
                                value={
                                    source.trial_days > 0
                                        ? `${source.trial_days} дн.`
                                        : "Нет"
                                }
                            />

                            <DetailsRow
                                label="Создан"
                                value={
                                    formatDate(
                                        source.created_at
                                    )
                                }
                            />

                            <DetailsRow
                                label="Изменён"
                                value={
                                    formatDate(
                                        source.updated_at
                                    )
                                }
                            />

                        </div>


                        <div className="mt-6 border-t border-slate-200 pt-5">

                            <div className="mb-2 text-sm text-slate-500">
                                Реферальная ссылка
                            </div>


                            <div className="flex items-center gap-2">

                                <div className="min-w-0 flex-1">

                                    <div className="truncate font-mono text-sm text-slate-950">
                                        {source.telegram_link}
                                    </div>

                                </div>


                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(
                                            source.telegram_link
                                        );

                                        toast.success(
                                            "Ссылка скопирована"
                                        );
                                    }}
                                >
                                    <Copy className="size-4" />
                                </Button>


                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                        window.open(
                                            source.telegram_link,
                                            "_blank"
                                        );
                                    }}
                                >
                                    <ExternalLink className="size-4" />
                                </Button>

                            </div>

                        </div>

                    </CardContent>

                </Card>
            )}

        </AsyncContent>
    );
};


export default MarketingSourceInfo;