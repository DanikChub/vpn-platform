import { Link } from "lucide-react";
import { Page, PageContent, PageHeader } from "@/shared/ui";
import MarketingSourcesList, { CreateMarketingSourceDialog } from "@/widgets/marketing-sources";

const MarketingSourcesPage = () => (
    <Page>
        <PageHeader
            title="Источники"
            description="Управление рекламными ссылками и каналами привлечения"
            icon={<Link className="size-5" />}
            actions={<CreateMarketingSourceDialog />}
        />
        <PageContent>
            <MarketingSourcesList />
        </PageContent>
    </Page>
);

export default MarketingSourcesPage;
