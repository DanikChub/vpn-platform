import {
    useCreatePlanMutation,
    useDeletePlanMutation,
    useUpdatePlanMutation,
    type CreatePlanPayload,
    type UpdatePlanPayload,
} from "@/entities/plan";

const useManagePlan = () => {
    const [createMutation, createState] = useCreatePlanMutation();
    const [updateMutation, updateState] = useUpdatePlanMutation();
    const [deleteMutation, deleteState] = useDeletePlanMutation();

    const createPlan = async (payload: CreatePlanPayload): Promise<boolean> => {
        try {
            await createMutation(payload).unwrap();
            return true;
        } catch {
            return false;
        }
    };

    const updatePlan = async (planId: number, payload: UpdatePlanPayload): Promise<boolean> => {
        try {
            await updateMutation({ planId, payload }).unwrap();
            return true;
        } catch {
            return false;
        }
    };

    const deletePlan = async (planId: number): Promise<boolean> => {
        try {
            await deleteMutation(planId).unwrap();
            return true;
        } catch {
            return false;
        }
    };

    const activeAction =
        createState.isLoading ? "create" :
        updateState.isLoading ? "update" :
        deleteState.isLoading ? "delete" :
        null;

    const hasError = createState.isError || updateState.isError || deleteState.isError;

    return {
        status: {
            activeAction,
            errorMessage: hasError ? "Не удалось выполнить операцию с тарифом" : null,
            isLoading: activeAction !== null,
        },
        actions: {
            createPlan,
            updatePlan,
            deletePlan,
            clearError: () => {
                createState.reset();
                updateState.reset();
                deleteState.reset();
            },
        },
    };
};

export default useManagePlan;
