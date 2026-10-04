import {useState} from "react";
import type {Plan} from "@/entities/plan";
import {Page, PageContent, PageHeader} from "@/shared/ui";
import {CreditCard} from "lucide-react";
import {ManagePlan} from "@/features/manage-plan";
import {PlansList} from "@/widgets/plans-list";


const PlansPage = () => {
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


    return (
        <Page>
            <PageHeader
                description="Создание, редактирование и управление тарифами подписки"
                icon={
                    <CreditCard className="size-5" />
                }
                title="Тарифы"
                actions={
                    <ManagePlan
                        formPlan={formPlan}
                        isFormOpen={isFormOpen}
                        onCloseForm={closeForm}
                        onOpenCreate={openCreate}
                    />
                }
            />

            <PageContent>
                <PlansList
                    onEdit={openEdit}
                />
            </PageContent>
        </Page>
    );
};

export default PlansPage;