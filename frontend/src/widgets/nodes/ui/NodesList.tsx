import {
    useDeleteVpnNodeMutation,
    useGetVpnNodesQuery,
} from "@/entities/vpn-node";
import {getNodeDetailsPath} from "@/shared/config/routePaths.ts";
import {useNavigate} from "react-router-dom";
import AsyncContent from "@/shared/ui/AsyncContent/AsyncContent.tsx";
import {Server} from "lucide-react";
import NodesTable from "@/widgets/nodes/ui/NodesTable.tsx";



const NodesList = () => {
    const navigate = useNavigate();

    const {
        data: nodes = [],
        isLoading,
        error,
    } = useGetVpnNodesQuery();

    const [deleteVpnNode] =
        useDeleteVpnNodeMutation();

    const openNode = (
        nodeId: number,
    ) => {
        navigate(
            getNodeDetailsPath(nodeId),
        );
    };

    const deleteNode = async (
        nodeId: number,
    ) => {
        const node =
            nodes.find(
                (item) =>
                    item.id === nodeId,
            );

        const nodeName =
            node?.display_name ??
            node?.name ??
            `#${nodeId}`;

        const confirmed =
            window.confirm(
                `Удалить ноду "${nodeName}"?\n\nЭто действие нельзя отменить.`,
            );

        if (!confirmed) {
            return;
        }

        await deleteVpnNode(
            nodeId,
        ).unwrap();
    };

    return (
        <AsyncContent
            isLoading={isLoading}
            errorMessage={
                error
                    ? "Не удалось загрузить ноды"
                    : null
            }
            isEmpty={nodes.length === 0}
            emptyTitle="Серверы не найдены"
            emptyDescription="Добавьте первый VPN-сервер."
            emptyIcon={
                <Server className="size-6" />
            }
        >
            <NodesTable
                nodes={nodes}
                onOpenNode={openNode}
                onDeleteNode={deleteNode}
            />
        </AsyncContent>
    );
};


export default NodesList;