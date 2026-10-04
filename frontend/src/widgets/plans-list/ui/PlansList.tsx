
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
    useDialog,
} from "@/shared/lib";
import {
    AsyncContent,
} from "@/shared/ui";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/shared/api";


interface PlansListProps {
    onEdit: (
        plan: Plan
    ) => void;
}


export function PlansList({
                              onEdit,
                          }: PlansListProps) {



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

            try {
                await deletePlan(
                    plan.id
                ).unwrap();

                toast.success(
                    `Тариф «${plan.name}» удалён`
                );
            } catch (error) {
                toast.error(
                    getApiErrorMessage(error)
                );
            }
        };


    return (
        <div className="space-y-5">

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
                    onEdit={onEdit}
                    plans={plans}
                />
            </AsyncContent>
        </div>
    );
}
