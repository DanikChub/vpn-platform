import {
    useBlockUserSubscriptionMutation,
    useExpireUserSubscriptionMutation,
    useExtendUserSubscriptionMutation,
    useUnblockUserSubscriptionMutation,
} from "@/entities/user";

const useManageUserSubscription = ({ userId }: { userId: number }) => {
    const [extendMutation, extendState] = useExtendUserSubscriptionMutation();
    const [expireMutation, expireState] = useExpireUserSubscriptionMutation();
    const [blockMutation, blockState] = useBlockUserSubscriptionMutation();
    const [unblockMutation, unblockState] = useUnblockUserSubscriptionMutation();

    const execute = async (action: () => Promise<unknown>): Promise<boolean> => {
        try {
            await action();
            return true;
        } catch {
            return false;
        }
    };

    const activeAction =
        extendState.isLoading ? "extend" :
        expireState.isLoading ? "expire" :
        blockState.isLoading ? "block" :
        unblockState.isLoading ? "unblock" :
        null;

    const hasError =
        extendState.isError || expireState.isError ||
        blockState.isError || unblockState.isError;

    return {
        status: {
            activeAction,
            errorMessage: hasError ? "Не удалось изменить подписку" : null,
            isLoading: activeAction !== null,
        },
        actions: {
            extendSubscription: (durationDays: number) =>
                execute(() => extendMutation({ userId, payload: { durationDays } }).unwrap()),
            expireSubscription: () =>
                execute(() => expireMutation({ userId }).unwrap()),
            blockSubscription: () =>
                execute(() => blockMutation({ userId }).unwrap()),
            unblockSubscription: () =>
                execute(() => unblockMutation({ userId }).unwrap()),
            clearError: () => {
                extendState.reset();
                expireState.reset();
                blockState.reset();
                unblockState.reset();
            },
        },
    };
};

export default useManageUserSubscription;
