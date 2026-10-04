import {
    useCreatePlanMutation,
    useUpdatePlanMutation,
    type CreatePlanPayload,
    type UpdatePlanPayload,
} from "@/entities/plan";

const useManagePlan = () => {
    const [createMutation, createState] = useCreatePlanMutation();
    const [updateMutation, updateState] = useUpdatePlanMutation();

    const createPlan = async (
        payload: CreatePlanPayload
    ): Promise<void> => {
        await createMutation(
            payload
        ).unwrap();
    };

    const updatePlan = async (
        planId: number,
        payload: UpdatePlanPayload
    ): Promise<void> => {
        await updateMutation({
            planId,
            payload,
        }).unwrap();
    };


    const activeAction =
        createState.isLoading ? "create" :
        updateState.isLoading ? "update" :
        null;

    const hasError = createState.isError || updateState.isError;

    return {
        status: {
            activeAction,
            errorMessage: hasError ? "Не удалось выполнить операцию с тарифом" : null,
            isLoading: activeAction !== null,
        },
        actions: {
            createPlan,
            updatePlan,
            clearError: () => {
                createState.reset();
                updateState.reset();
            },
        },
    };
};

export default useManagePlan;
