import { Link } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetMarketingSourceUsersQuery } from "@/entities/marketing-source";
import { AsyncContent } from "@/shared/ui";
import MarketingSourceDetailsContent from "./MarketingSourceDetailsContent";

const MarketingSourceDetails = () => {
    const { id } = useParams();
    const sourceId = Number(id);
    const isValidId = Number.isInteger(sourceId) && sourceId > 0;

    if (!isValidId) {
        return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">Некорректный ID источника</div>;
    }

    return <MarketingSourceDetailsLoader sourceId={sourceId} />;
};

function MarketingSourceDetailsLoader({ sourceId }: { sourceId: number }) {
    const { data, isLoading, error } = useGetMarketingSourceUsersQuery(sourceId);

    return (
        <AsyncContent
            isLoading={isLoading}
            errorMessage={error ? "Не удалось загрузить источник" : null}
            isEmpty={!data}
            emptyTitle="Источник не найден"
            emptyDescription=""
            emptyIcon={<Link className="size-6" />}
        >
            {data ? <MarketingSourceDetailsContent data={data} /> : null}
        </AsyncContent>
    );
}

export default MarketingSourceDetails;
