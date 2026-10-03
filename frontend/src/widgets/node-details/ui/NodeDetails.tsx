import { HardDrive } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetVpnNodeQuery } from "@/entities/vpn-node";
import { AsyncContent } from "@/shared/ui";
import NodeDetailsContent from "./NodeDetailsContent";

export function NodeDetails() {
    const { id } = useParams<{ id: string }>();
    const nodeId = Number(id);
    const isValidNodeId = Number.isInteger(nodeId) && nodeId > 0;

    if (!isValidNodeId) {
        return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">Некорректный ID ноды</div>;
    }

    return <NodeDetailsLoader nodeId={nodeId} />;
}

function NodeDetailsLoader({ nodeId }: { nodeId: number }) {
    const { data: node, isLoading, error } = useGetVpnNodeQuery(nodeId);

    return (
        <AsyncContent
            isLoading={isLoading}
            errorMessage={error ? "Не удалось загрузить ноду" : null}
            isEmpty={!node}
            emptyTitle="Нода не найдена"
            emptyDescription="Нода отсутствует или была удалена."
            emptyIcon={<HardDrive className="size-6" />}
        >
            {node ? <NodeDetailsContent node={node} /> : null}
        </AsyncContent>
    );
}
