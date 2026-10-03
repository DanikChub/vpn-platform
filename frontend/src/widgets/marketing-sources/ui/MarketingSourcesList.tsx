import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMarketingSourcesQuery } from "@/entities/marketing-source";
import { AsyncContent } from "@/shared/ui";
import MarketingSourcesTable from "./MarketingSourcesTable";

const MarketingSourcesList = () => {
    const navigate = useNavigate();
    const { data: sources = [], isLoading, error } = useGetMarketingSourcesQuery();

    return (
        <AsyncContent
            isLoading={isLoading}
            errorMessage={error ? "Не удалось загрузить источники" : null}
            isEmpty={sources.length === 0}
            emptyTitle="Источники не найдены"
            emptyDescription="Создайте первый рекламный источник"
            emptyIcon={<Link className="size-6" />}
        >
            <MarketingSourcesTable
                sources={sources}
                onOpen={(id) => navigate(`/marketing-sources/${id}`)}
            />
        </AsyncContent>
    );
};

export default MarketingSourcesList;
