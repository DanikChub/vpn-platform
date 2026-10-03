import {
    Server,
} from "lucide-react";

import NodesList from "@/widgets/nodes";

import {
    Page,
    PageContent,
    PageHeader,
} from "@/shared/ui";
import CreateVpnNodeModal from "@/widgets/nodes/ui/CreateVpnNodeDialog.tsx";


const NodesPage = () => {

    return (
        <Page>

            <PageHeader
                description="Управление VPN-серверами и состоянием узлов"

                icon={
                    <Server className="size-5" />
                }

                title="Узлы"

                actions={
                    <CreateVpnNodeModal/>
                }
            />


            <PageContent>

                <NodesList/>

            </PageContent>


        </Page>
    );
};


export default NodesPage;