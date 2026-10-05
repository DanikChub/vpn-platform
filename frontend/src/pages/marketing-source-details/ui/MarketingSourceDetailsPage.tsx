import {
    Link,
} from "lucide-react";

import {
    useParams,
} from "react-router-dom";

import {
    MarketingSourceStats,
} from "@/widgets/marketing-source-stats";

import {
    MarketingSourceUsers,
} from "@/widgets/marketing-source-users";

import {
    Page,
    PageContent,
    PageHeader,
} from "@/shared/ui";
import {MarketingSourceInfo} from "@/widgets/marketing-source-info";


const MarketingSourceDetailsPage = () => {

    const {
        id,
    } = useParams();


    const sourceId =
        Number(id);


    const isValidId =
        Number.isInteger(
            sourceId
        ) &&
        sourceId > 0;


    return (
        <Page>

            <PageHeader
                title="Источник"
                description="Статистика и пользователи рекламного источника"
                icon={
                    <Link className="size-5" />
                }
            />


            <PageContent>

                {!isValidId ? (

                    <div
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        role="alert"
                    >
                        Некорректный ID источника
                    </div>

                ) : (

                    <div className="space-y-5">

                        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">

                            <MarketingSourceInfo
                                sourceId={sourceId}
                            />

                            <MarketingSourceStats
                                sourceId={sourceId}
                            />

                        </div>


                        <MarketingSourceUsers
                            sourceId={sourceId}
                        />

                    </div>

                )}

            </PageContent>

        </Page>
    );
};


export default MarketingSourceDetailsPage;