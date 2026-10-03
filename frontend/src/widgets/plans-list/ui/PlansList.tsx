import { useState } from "react";
import { CreditCard } from "lucide-react";
import { type Plan, PlansTable, useGetPlansQuery } from "@/entities/plan";
import { ManagePlan } from "@/features/manage-plan";
import { AsyncContent } from "@/shared/ui";

export function PlansList() {
    const [formPlan, setFormPlan] = useState<Plan | null>(null);
    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { data, isLoading, error } = useGetPlansQuery();
    const plans = data?.plans ?? [];

    const openCreate = () => {
        setFormPlan(null);
        setIsFormOpen(true);
    };

    const openEdit = (plan: Plan) => {
        setFormPlan(plan);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setFormPlan(null);
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <ManagePlan
                    deletingPlan={deletingPlan}
                    formPlan={formPlan}
                    isFormOpen={isFormOpen}
                    onCloseDelete={() => setDeletingPlan(null)}
                    onCloseForm={closeForm}
                    onOpenCreate={openCreate}
                />
            </div>

            <AsyncContent
                isLoading={isLoading}
                errorMessage={error ? "Не удалось загрузить тарифы" : null}
                isEmpty={plans.length === 0}
                emptyTitle="Тарифов пока нет"
                emptyDescription="Создайте первый тариф, чтобы пользователи могли покупать подписку."
                emptyIcon={<CreditCard className="size-6" />}
            >
                <PlansTable
                    isMutating={false}
                    onDelete={setDeletingPlan}
                    onEdit={openEdit}
                    plans={plans}
                />
            </AsyncContent>
        </div>
    );
}
