import {
    Plus,
} from "lucide-react";

import type {
    CreatePlanPayload,
    Plan,
} from "@/entities/plan";
import {
    useDialog,
} from "@/shared/lib";
import {
    Button,
} from "@/shared/ui";

import useManagePlan from "../model";
import {
    PlanFormModal,
} from "./PlanFormModal";


interface ManagePlanProps {
    formPlan: Plan | null;
    isFormOpen: boolean;
    onOpenCreate: () => void;
    onCloseForm: () => void;
    planToDelete: Plan | null;
    onDeleteFinished: () => void;
}


export function ManagePlan({
                               formPlan,
                               isFormOpen,
                               onOpenCreate,
                               onCloseForm,
                               planToDelete,
                               onDeleteFinished,
                           }: ManagePlanProps) {
    const { confirm } = useDialog();

    const {
        status,
        actions,
    } = useManagePlan();


    const submitPlan = (
        payload: CreatePlanPayload
    ): Promise<boolean> => {
        if (formPlan) {
            return actions.updatePlan(
                formPlan.id,
                payload
            );
        }

        return actions.createPlan(
            payload
        );
    };


    const confirmDelete =
        async (plan: Plan): Promise<void> => {
            const confirmed =
                await confirm({
                    title: "Удалить тариф?",
                    description: `Тариф «${plan.name}» будет удалён без возможности восстановления. Тариф с существующими заказами удалить нельзя.`,
                    confirmText: "Удалить тариф",
                    variant: "danger",
                });

            if (!confirmed) {
                onDeleteFinished();
                return;
            }

            await actions.deletePlan(
                plan.id
            );

            onDeleteFinished();
        };


    if (planToDelete) {
        void confirmDelete(
            planToDelete
        );
    }


    return (
        <>
            <Button
                disabled={status.isLoading}
                leftIcon={
                    <Plus className="size-4" />
                }
                onClick={() => {
                    actions.clearError();
                    onOpenCreate();
                }}
            >
                Добавить тариф
            </Button>

            {status.errorMessage && (
                <div
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                >
                    {status.errorMessage}
                </div>
            )}

            <PlanFormModal
                isLoading={
                    status.activeAction ===
                    "create" ||
                    status.activeAction ===
                    "update"
                }
                isOpen={isFormOpen}
                onClose={onCloseForm}
                onSubmit={submitPlan}
                plan={formPlan}
            />
        </>
    );
}
