import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    type SortDirection,
    type UsersSortBy,
    type UserSubscriptionFilter,
    useGetUsersQuery,
    UsersTable,
} from "@/entities/user";
import UsersFilters from "@/features/filter-users";
import UsersPagination from "@/features/paginate-users";
import { getUserDetailsPath } from "@/shared/config/routePaths";
import { AsyncContent } from "@/shared/ui";

const USERS_LIMIT = 20;
const SEARCH_DEBOUNCE_DELAY = 400;

export function UsersList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [subscriptionStatus, setSubscriptionStatus] = useState<UserSubscriptionFilter>("all");
    const [sortBy, setSortBy] = useState<UsersSortBy>("createdAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, SEARCH_DEBOUNCE_DELAY);
        return () => window.clearTimeout(timeoutId);
    }, [search]);

    const { data, isLoading, isFetching, error } = useGetUsersQuery({
        page,
        limit: USERS_LIMIT,
        search: debouncedSearch || undefined,
        subscriptionStatus,
        sortBy,
        sortDirection,
    });

    const users = data?.users ?? [];
    const pagination = data?.pagination;

    const changeSort = (nextSortBy: UsersSortBy) => {
        setPage(1);
        if (nextSortBy === sortBy) {
            setSortDirection((current) => current === "asc" ? "desc" : "asc");
            return;
        }
        setSortBy(nextSortBy);
        setSortDirection("asc");
    };

    return (
        <div className="space-y-5">
            <UsersFilters
                search={search}
                subscriptionStatus={subscriptionStatus}
                onSearchChange={setSearch}
                onSubscriptionStatusChange={(value) => {
                    setSubscriptionStatus(value);
                    setPage(1);
                }}
            />

            <AsyncContent
                isLoading={isLoading}
                errorMessage={error ? "Не удалось загрузить пользователей" : null}
                isEmpty={users.length === 0}
                emptyTitle="Пользователи не найдены"
                emptyDescription="Попробуйте изменить поисковый запрос или выбранный фильтр."
                emptyIcon={<Users className="size-6" />}
            >
                <UsersTable
                    users={users}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortChange={changeSort}
                    onOpenUser={(userId) => navigate(getUserDetailsPath(userId))}
                />
            </AsyncContent>

            {pagination && (
                <UsersPagination
                    pagination={pagination}
                    isLoading={isFetching}
                    onNextPage={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                    onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
                />
            )}
        </div>
    );
}
