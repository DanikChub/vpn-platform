import {
    Button,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui";

import {
    VpnNodeStatusBadge,
    type VpnNode,
} from "@/entities/vpn-node";
import {DeleteIcon, Eye} from "lucide-react";


interface Props {
    nodes: VpnNode[];
    onOpenNode: (
        nodeId: number
    ) => void;
    onDeleteNode: (
        nodeId: number
    ) => void;
}


const NodesTable = ({
                        nodes,
                        onOpenNode,
                        onDeleteNode
                    }: Props) => {


    return (
        <TableContainer>
            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>
                            ID
                        </TableHead>

                        <TableHead>
                            Сервер
                        </TableHead>

                        <TableHead>
                            Адрес
                        </TableHead>

                        <TableHead>
                            Статус
                        </TableHead>

                        <TableHead>
                            CPU
                        </TableHead>

                        <TableHead>
                            RAM
                        </TableHead>

                        <TableHead>
                            Uptime
                        </TableHead>

                        <TableHead>
                            Трафик
                        </TableHead>

                        <TableHead className="w-16 text-center">
                            Действия
                        </TableHead>

                    </TableRow>

                </TableHeader>


                <TableBody>

                    {nodes.map((node) => (

                        <TableRow
                            key={node.id}
                        >

                            <TableCell>
                                {node.id}
                            </TableCell>


                            <TableCell>

                                <p className="font-medium">
                                    {node.name}
                                </p>

                            </TableCell>


                            <TableCell>

                                {node.host}:{node.port}

                            </TableCell>


                            <TableCell>

                                <VpnNodeStatusBadge
                                    node={node}
                                />

                            </TableCell>


                            <TableCell>

                                {node.cpu_count ?? "-"}
                                {" "}
                                {node.cpu_model}

                            </TableCell>


                            <TableCell>

                                {node.memory_used
                                    ? `${Math.round(
                                        node.memory_used /
                                        1024 /
                                        1024 /
                                        1024
                                    )} GB`
                                    : "-"
                                }

                            </TableCell>


                            <TableCell>

                                {node.uptime_seconds
                                    ? `${Math.floor(
                                        node.uptime_seconds / 3600
                                    )} ч`
                                    : "-"
                                }

                            </TableCell>

                            <TableCell>
                                <NodeTrafficProgress
                                    period={node.trafficPeriod}
                                />
                            </TableCell>


                            <TableCell className="text-right">
                                <div className="flex space-x-2">
                                    <Button
                                        aria-label="Открыть узел"
                                        onClick={() => {
                                            onOpenNode(node.id);
                                        }}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                    <Button
                                        aria-label="Удалить узел"
                                        onClick={() => {
                                            onDeleteNode(node.id);
                                        }}
                                        size="icon"
                                        variant="danger"
                                    >
                                        <DeleteIcon className="size-4" />
                                    </Button>
                                </div>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>


            </Table>
        </TableContainer>
    );
};

function NodeTrafficProgress({
                                 period,
                             }: {
    period: VpnNode["trafficPeriod"];
}) {
    if (!period) {
        return (
            <span className="text-sm text-slate-400">
                Не настроен
            </span>
        );
    }


    const usedBytes =
        Number(period.usedBytes);

    const limitBytes =
        period.limitBytes
            ? Number(period.limitBytes)
            : null;

    const usedGb =
        usedBytes / 1024 ** 3;


    if (!limitBytes) {
        return (
            <span className="text-sm font-medium text-slate-700">
                {formatTrafficGb(usedGb)}
            </span>
        );
    }


    const limitGb =
        limitBytes / 1024 ** 3;

    const percentage =
        Math.min(
            usedBytes /
            limitBytes *
            100,
            100,
        );


    const colorClass =
        percentage >= 90
            ? "bg-red-500"
            : percentage >= 50
                ? "bg-yellow-400"
                : "bg-green-500";


    const textColorClass =
        percentage >= 90
            ? "text-red-700"
            : percentage >= 50
                ? "text-yellow-700"
                : "text-green-700";


    return (
        <div className="min-w-40">

            <div className="mb-1.5 flex items-center justify-between gap-3">

                <span
                    className={`text-sm font-medium ${textColorClass}`}
                >
                    {formatTrafficGb(usedGb)}
                    {" / "}
                    {formatTrafficGb(limitGb)}
                </span>

                <span
                    className={`text-xs font-medium ${textColorClass}`}
                >
                    {percentage.toFixed(1)}%
                </span>

            </div>


            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                    className={`h-full rounded-full transition-all ${colorClass}`}
                    style={{
                        width:
                            `${percentage}%`,
                    }}
                />

            </div>

        </div>
    );
}


function formatTrafficGb(
    value: number,
): string {
    if (value >= 100) {
        return `${value.toFixed(0)} GB`;
    }

    if (value >= 10) {
        return `${value.toFixed(1)} GB`;
    }

    return `${value.toFixed(2)} GB`;
}


export default NodesTable;