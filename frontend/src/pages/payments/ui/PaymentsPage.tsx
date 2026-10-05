import {
    CreditCard,
} from "lucide-react";

import {
    PaymentsList,
} from "@/widgets/payments-list";

import {
    PaymentsStats,
} from "@/widgets/payments-stats";

import {
    Page,
    PageContent,
    PageHeader,
} from "@/shared/ui";


const PaymentsPage = () => {
    return (
        <Page>
            <PageHeader
                description="Просмотр доходов и истории платежей пользователей"
                icon={
                    <CreditCard className="size-5" />
                }
                title="Платежи"
            />

            <PageContent>
                <div className="space-y-5">
                    <PaymentsStats />

                    <PaymentsList />
                </div>
            </PageContent>
        </Page>
    );
};


export default PaymentsPage;