import { UserRoundX } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "@/entities/user";
import { AsyncContent } from "@/shared/ui";
import UserDetailsContent from "./UserDetailsContent";

export function UserDetails() {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const isValidUserId = Number.isInteger(userId) && userId > 0;

    if (!isValidUserId) {
        return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">Некорректный ID пользователя</div>;
    }

    return <UserDetailsLoader userId={userId} />;
}

function UserDetailsLoader({ userId }: { userId: number }) {
    const { data, isLoading, error } = useGetUserQuery(userId);
    const user = data?.user;

    return (
        <AsyncContent
            isLoading={isLoading}
            errorMessage={error ? "Не удалось загрузить пользователя" : null}
            isEmpty={!user}
            emptyTitle="Пользователь не найден"
            emptyDescription="Пользователь отсутствует или был удалён."
            emptyIcon={<UserRoundX className="size-6" />}
        >
            {user ? <UserDetailsContent user={user} /> : null}
        </AsyncContent>
    );
}
