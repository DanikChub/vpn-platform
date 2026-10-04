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



    const activeAction =
        extendState.isLoading ? "extend" :
        expireState.isLoading ? "expire" :
        blockState.isLoading ? "block" :
        unblockState.isLoading ? "unblock" :
        null;



    return {
        status: {
            activeAction,
            isLoading: activeAction !== null,
        },
        actions: {
            extendSubscription: (
                durationDays: number
            ) =>
                extendMutation({
                    userId,
                    payload: {
                        durationDays,
                    },
                }).unwrap(),

            expireSubscription: () =>
                expireMutation({
                    userId,
                }).unwrap(),

            blockSubscription: () =>
                blockMutation({
                    userId,
                }).unwrap(),

            unblockSubscription: () =>
                unblockMutation({
                    userId,
                }).unwrap(),
        },
    };
};

export default useManageUserSubscription;
