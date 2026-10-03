import type { MarketingSourceUsersResponse } from "@/entities/marketing-source";
import { Card, CardContent } from "@/shared/ui";
import MarketingSourceUsersTable from "./MarketingSourceUsersTable";

interface Props {
    data: MarketingSourceUsersResponse;
}

const MarketingSourceDetailsContent = ({ data }: Props) => (
    <div className="space-y-6">
        <Card>
            <CardContent className="space-y-3">
                <div>
                    <p className="text-sm text-muted-foreground">Название</p>
                    <p className="font-medium">{data.source.name}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Код</p>
                    <p>{data.source.code}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Тип</p>
                    <p>{data.source.type}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Пользователей</p>
                    <p>{data.users.length}</p>
                </div>
            </CardContent>
        </Card>

        <MarketingSourceUsersTable users={data.users} />
    </div>
);

export default MarketingSourceDetailsContent;
