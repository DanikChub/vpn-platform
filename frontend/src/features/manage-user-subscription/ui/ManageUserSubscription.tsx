import {
    useState,
} from "react";
import {
    Ban,
    CalendarPlus,
    CircleCheck,
    CircleX,
    ShieldCheck,
} from "lucide-react";

import type {
    UserDetails,
} from "@/entities/user";
import {
    useDialog,
} from "@/shared/lib";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/ui";

import useManageUserSubscription from "../model";
import {
    ExtendSubscriptionModal,
} from "./ExtendSubscriptionModal";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/shared/api";


interface ManageUserSubscriptionProps {
    user: UserDetails;
}


export function ManageUserSubscription({
                                           user,
                                       }: ManageUserSubscriptionProps) {
    const [
        isExtendOpen,
        setIsExtendOpen,
    ] = useState(false);

    const { confirm } = useDialog();

    const {
        status,
        actions,
    } = useManageUserSubscription({
        userId: user.id,
    });

    const subscription =
        user.subscription;

    const isBlocked =
        subscription?.status ===
        "blocked";

    const [now] = useState(
        () => Date.now()
    );

    const isExpired =
        !subscription ||
        subscription.status ===
        "expired" ||
        new Date(
            subscription.expiresAt
        ).getTime() <= now;

    const hasActiveSubscription =
        Boolean(
            subscription &&
            subscription.status ===
            "active" &&
            !isExpired
        );


    const runConfirmedAction =
        async ({
                   title,
                   description,
                   confirmText,
                   successMessage,
                   action,
                   variant = "danger",
               }: {
            title: string;
            description: string;
            confirmText: string;
            successMessage: string;
            action: () => Promise<unknown>;
            variant?: "default" | "danger";
        }): Promise<void> => {
            const confirmed =
                await confirm({
                    title,
                    description,
                    confirmText,
                    variant,
                });

            if (!confirmed) {
                return;
            }

            try {
                await action();

                toast.success(
                    successMessage
                );
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error
                    )
                );
            }
        };



    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <CardTitle>
                                Управление подпиской
                            </CardTitle>

                            <CardDescription>
                                Ручное управление доступом пользователя к VPN
                            </CardDescription>
                        </div>

                        <SubscriptionStatusBadge
                            hasSubscription={Boolean(subscription)}
                            isActive={hasActiveSubscription}
                            isBlocked={isBlocked}
                        />
                    </div>
                </CardHeader>

                <CardContent>

                    <p className="text-sm leading-6 text-slate-600">
                        {!subscription
                            ? "У пользователя пока нет подписки. Вы можете выдать её вручную."
                            : isBlocked
                                ? "Подписка заблокирована администратором. Срок действия при этом сохраняется."
                                : hasActiveSubscription
                                    ? "Подписка активна. Её можно продлить, завершить или заблокировать."
                                    : "Срок подписки истёк. Вы можете возобновить её, добавив новый период."}
                    </p>
                </CardContent>

                <CardFooter className="flex-wrap">
                    <Button
                        disabled={status.isLoading}
                        leftIcon={
                            <CalendarPlus className="size-4" />
                        }
                        onClick={() => {
                            setIsExtendOpen(true);
                        }}
                    >
                        {!subscription
                            ? "Выдать подписку"
                            : isExpired
                                ? "Возобновить"
                                : "Продлить"}
                    </Button>

                    {hasActiveSubscription && (
                        <>
                            <Button
                                disabled={status.isLoading}
                                leftIcon={
                                    <Ban className="size-4" />
                                }
                                onClick={() => {
                                    void runConfirmedAction({
                                        title:
                                            "Заблокировать подписку?",
                                        description:
                                            "VPN-доступ будет отозван, но оставшийся срок подписки сохранится.",
                                        confirmText:
                                            "Заблокировать",
                                        successMessage:
                                            "Подписка заблокирована",
                                        action:
                                        actions.blockSubscription,
                                    });
                                }}
                                variant="outline"
                            >
                                Заблокировать
                            </Button>

                            <Button
                                disabled={status.isLoading}
                                leftIcon={
                                    <CircleX className="size-4" />
                                }
                                onClick={() => {
                                    void runConfirmedAction({
                                        title:
                                            "Завершить подписку?",
                                        description:
                                            "Подписка будет завершена немедленно, а VPN-доступ пользователя будет отозван.",
                                        confirmText:
                                            "Завершить подписку",
                                        successMessage:
                                            "Подписка завершена",
                                        action:
                                        actions.expireSubscription,
                                    });
                                }}
                                variant="danger"
                            >
                                Завершить
                            </Button>
                        </>
                    )}

                    {isBlocked && (
                        <>
                            <Button
                                disabled={status.isLoading}
                                leftIcon={
                                    <ShieldCheck className="size-4" />
                                }
                                onClick={() => {
                                    void runConfirmedAction({
                                        title:
                                            "Разблокировать подписку?",
                                        description:
                                            "Если срок подписки ещё действует, VPN-доступ пользователя будет восстановлен.",
                                        confirmText:
                                            "Разблокировать",
                                        successMessage:
                                            "Подписка разблокирована",
                                        action:
                                        actions.unblockSubscription,
                                        variant:
                                            "default",
                                    });
                                }}
                                variant="secondary"
                            >
                                Разблокировать
                            </Button>

                            <Button
                                disabled={status.isLoading}
                                leftIcon={
                                    <CircleX className="size-4" />
                                }
                                onClick={() => {
                                    void runConfirmedAction({
                                        title: "Завершить подписку?",
                                        description: "Подписка будет завершена немедленно и её нельзя будет восстановить разблокировкой.",
                                        confirmText: "Завершить подписку",
                                        action: actions.expireSubscription,
                                        successMessage:
                                            "Подписка завершена",
                                    });
                                }}
                                variant="danger"
                            >
                                Завершить
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            {isExtendOpen && (
                <ExtendSubscriptionModal
                    hasSubscription={
                        Boolean(subscription)
                    }
                    isLoading={
                        status.activeAction ===
                        "extend"
                    }
                    isOpen
                    onClose={() => {
                        if (!status.isLoading) {
                            setIsExtendOpen(false);
                        }
                    }}
                    onSubmit={
                        actions.extendSubscription
                    }
                />
            )}
        </>
    );
}


interface SubscriptionStatusBadgeProps {
    hasSubscription: boolean;
    isActive: boolean;
    isBlocked: boolean;
}


function SubscriptionStatusBadge({
                                     hasSubscription,
                                     isActive,
                                     isBlocked,
                                 }: SubscriptionStatusBadgeProps) {
    if (!hasSubscription) {
        return (
            <Badge variant="default">
                Нет подписки
            </Badge>
        );
    }

    if (isBlocked) {
        return (
            <Badge variant="danger">
                Заблокирована
            </Badge>
        );
    }

    if (isActive) {
        return (
            <Badge variant="success">
                <CircleCheck className="mr-1 size-3.5" />
                Активна
            </Badge>
        );
    }

    return (
        <Badge variant="warning">
            Истекла
        </Badge>
    );
}
