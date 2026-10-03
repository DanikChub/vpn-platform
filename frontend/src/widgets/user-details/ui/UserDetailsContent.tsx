import type { UserDetails as UserDetailsType } from "@/entities/user";
import { ManageUserSubscription } from "@/features/manage-user-subscription";
import { formatDate, formatMoney } from "@/shared/lib";
import { Card, CardContent, DetailsRow } from "@/shared/ui";

interface UserDetailsContentProps {
    user: UserDetailsType;
}

const UserDetailsContent = ({ user }: UserDetailsContentProps) => (
    <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-2">
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-slate-950">Основная информация</h2>
                    <div className="mt-5 space-y-4">
                        <DetailsRow label="ID" value={String(user.id)} />
                        <DetailsRow label="Имя" value={user.firstName || "Не указано"} />
                        <DetailsRow label="Username" value={user.username ? `@${user.username}` : "Не указан"} />
                        <DetailsRow label="Telegram ID" value={user.telegramId} monospace />
                        <DetailsRow label="Баланс" value={formatMoney(user.balanceAmount)} />
                        <DetailsRow label="Дата регистрации" value={formatDate(user.createdAt)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-slate-950">Подписка</h2>
                    <div className="mt-5 space-y-4">
                        <DetailsRow label="Статус" value={getSubscriptionStatusLabel(user)} />
                        <DetailsRow label="Действует до" value={formatDate(user.subscription?.expiresAt)} />
                        <DetailsRow label="Создана" value={formatDate(user.subscription?.createdAt)} />
                        <DetailsRow label="Обновлена" value={formatDate(user.subscription?.updatedAt)} />
                    </div>
                </CardContent>
            </Card>
        </div>

        <ManageUserSubscription user={user} />
    </div>
);

function getSubscriptionStatusLabel(user: UserDetailsType): string {
    if (!user.subscription) return "Нет подписки";

    switch (user.subscription.status) {
        case "active": return "Активна";
        case "blocked": return "Заблокирована";
        case "expired": return "Истекла";
        default: return "Неизвестно";
    }
}

export default UserDetailsContent;
