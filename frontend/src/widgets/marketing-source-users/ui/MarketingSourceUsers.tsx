import {
    Link,
} from "lucide-react";

import {
    useGetMarketingSourceUsersQuery,
} from "@/entities/marketing-source";

import {
    AsyncContent,
} from "@/shared/ui";

import MarketingSourceUsersTable
    from "./MarketingSourceUsersTable";


interface Props {
    sourceId: number;
}


const MarketingSourceUsers = ({
                                  sourceId,
                              }: Props) => {

    const {
        data,
        isLoading,
        error,
    } =
        useGetMarketingSourceUsersQuery(
            sourceId
        );


    const users =
        data?.users ?? [];


    return (
        <AsyncContent
            isLoading={isLoading}
            isEmpty={
                users.length === 0
            }
            errorMessage={
                error
                    ? "Не удалось загрузить пользователей источника"
                    : null
            }
            emptyTitle="Пользователей пока нет"
            emptyDescription="По этому источнику ещё никто не зарегистрировался"
            emptyIcon={
                <Link className="size-6" />
            }
        >

            <MarketingSourceUsersTable
                users={users}
            />

        </AsyncContent>
    );
};


export default MarketingSourceUsers;