import {
    Server,
} from "lucide-react";
import {
    useNavigate,
} from "react-router-dom";

import {
    useDeleteVpnNodeMutation,
    useGetVpnNodesQuery,
} from "@/entities/vpn-node";
import {
    getNodeDetailsPath,
} from "@/shared/config/routePaths.ts";
import {
    useDialog,
} from "@/shared/lib";
import {
    AsyncContent,
} from "@/shared/ui";
import NodesTable from "./NodesTable";


const NodesList = () => {
    const navigate = useNavigate();
    const { confirm } = useDialog();

    const {
        data: nodes = [],
        isLoading,
        error,
    } = useGetVpnNodesQuery();

    const [deleteVpnNode] =
        useDeleteVpnNodeMutation();


    const openNode = (
        nodeId: number
    ) => {
        navigate(
            getNodeDetailsPath(nodeId)
        );
    };


    const deleteNode = async (
        nodeId: number
    ) => {
        const node =
            nodes.find(
                (item) =>
                    item.id === nodeId
            );

        const nodeName =
            node?.display_name ??
            node?.name ??
            `#${nodeId}`;

        const confirmed =
            await confirm({
                title: "Удалить ноду?",
                description: `Нода «${nodeName}» будет удалена без возможности восстановления.`,
                confirmText: "Удалить",
                variant: "danger",
            });

        if (!confirmed) {
            return;
        }

        await deleteVpnNode(
            nodeId
        ).unwrap();
    };


    return (
        <AsyncContent
            emptyDescription="Добавьте первый VPN-сервер."
            emptyIcon={
                <Server className="size-6" />
            }
            emptyTitle="Серверы не найдены"
            errorMessage={
                error
                    ? "Не удалось загрузить ноды"
                    : null
            }
            isEmpty={nodes.length === 0}
            isLoading={isLoading}
        >
            <NodesTable
                nodes={nodes}
                onDeleteNode={(nodeId) => {
                    void deleteNode(nodeId);
                }}
                onOpenNode={openNode}
            />
        </AsyncContent>
    );
};


export default NodesList;
