import {
    useState,
} from "react";
import {
    CreditCard,
} from "lucide-react";

import {
    type Plan,
    PlansTable,
    useDeletePlanMutation,
    useGetPlansQuery,
} from "@/entities/plan";
import {
    ManagePlan,
} from "@/features/manage-plan";
import {
    useDialog,
} from "@/shared/lib";
import {
    AsyncContent,
} from "@/shared/ui";


export function PlansList() {
    const [
        formPlan,
        setFormPlan,
    ] = useState<Plan | null>(
        null
    );

    const [
        isFormOpen,
        setIsFormOpen,
    ] = useState(false);

    const { confirm } = useDialog();

    const {
        data,
        isLoading,
        error,
    } = useGetPlansQuery();

    const [
        deletePlan,
        deleteState,
    ] = useDeletePlanMutation();

    const plans =
        data?.plans ?? [];


    const openCreate = () => {
        setFormPlan(null);
        setIsFormOpen(true);
    };


    const openEdit = (
        plan: Plan
    ) => {
        setFormPlan(plan);
        setIsFormOpen(true);
    };


    const closeForm = () => {
        setIsFormOpen(false);
        setFormPlan(null);
    };


    const handleDelete =
        async (plan: Plan): Promise<void> => {
            const confirmed =
                await confirm({
                    title: "Удалить тариф?",
                    description: `Тариф «${plan.name}» будет удалён без возможности восстановления. Тариф с существующими заказами удалить нельзя.`,
                    confirmText: "Удалить тариф",
                    variant: "danger",
                });

            if (!confirmed) {
                return;
            }

            await deletePlan(
                plan.id
            ).unwrap();
        };


    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <ManagePlan
                    formPlan={formPlan}
                    isFormOpen={isFormOpen}
                    onCloseForm={closeForm}
                    onOpenCreate={openCreate}
                />
            </div>

            <AsyncContent
                emptyDescription="Создайте первый тариф, чтобы пользователи могли покупать подписку."
                emptyIcon={
                    <CreditCard className="size-6" />
                }
                emptyTitle="Тарифов пока нет"
                errorMessage={
                    error
                        ? "Не удалось загрузить тарифы"
                        : null
                }
                isEmpty={plans.length === 0}
                isLoading={isLoading}
            >
                <PlansTable
                    isMutating={deleteState.isLoading}
                    onDelete={(plan) => {
                        void handleDelete(plan);
                    }}
                    onEdit={openEdit}
                    plans={plans}
                />
            </AsyncContent>
        </div>
    );
}
