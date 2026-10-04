import type {
    CreateVpnNodeDto,
    EditableNodeField,
    NodeTrafficPeriod,
    SetNodeTrafficPeriodDto,
    VpnNode,
} from "../model";
import { baseApi } from "@/shared/api";

interface UpdateVpnNodeFieldArgs {
    nodeId: number;
    field: EditableNodeField;
    value: unknown;
}

interface InstallVpnNodeAgentArgs {
    nodeId: number;
    sshPassword: string;
}

interface SetNodeTrafficPeriodArgs {
    nodeId: number;
    data: SetNodeTrafficPeriodDto;
}

export const vpnNodeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVpnNodes: builder.query<VpnNode[], void>({
            query: () => ({ url: "/admin/nodes" }),
            providesTags: (result) => [
                { type: "VpnNode", id: "LIST" },
                ...(result?.map(({ id }) => ({ type: "VpnNode" as const, id })) ?? []),
            ],
        }),
        getVpnNode: builder.query<VpnNode, number>({
            query: (nodeId) => ({ url: `/admin/nodes/${nodeId}/details` }),
            providesTags: (_result, _error, nodeId) => [{ type: "VpnNode", id: nodeId }],
        }),
        createVpnNode: builder.mutation<VpnNode, CreateVpnNodeDto>({
            query: (data) => ({ url: "/admin/nodes", method: "POST", data }),
            invalidatesTags: [{ type: "VpnNode", id: "LIST" }],
        }),
        updateVpnNodeField: builder.mutation<VpnNode, UpdateVpnNodeFieldArgs>({
            query: ({ nodeId, field, value }) => ({
                url: `/admin/nodes/${nodeId}`,
                method: "PATCH",
                data: { field, value },
            }),
            invalidatesTags: (_result, _error, { nodeId }) => [
                { type: "VpnNode", id: nodeId },
                { type: "VpnNode", id: "LIST" },
            ],
        }),
        installVpnNodeAgent: builder.mutation<void, InstallVpnNodeAgentArgs>({
            query: ({ nodeId, sshPassword }) => ({
                url: `/admin/nodes/${nodeId}/install-agent`,
                method: "POST",
                data: { sshPassword },
            }),
            invalidatesTags: (_result, _error, { nodeId }) => [{ type: "VpnNode", id: nodeId }],
        }),
        deleteVpnNode: builder.mutation<void, number>({
            query: (nodeId) => ({ url: `/admin/nodes/${nodeId}`, method: "DELETE" }),
            invalidatesTags: (_result, _error, nodeId) => [
                { type: "VpnNode", id: nodeId },
                { type: "VpnNode", id: "LIST" },
            ],
        }),
        getNodeTrafficPeriod:
            builder.query<
                NodeTrafficPeriod | null,
                number
            >({
                query: (nodeId) => ({
                    url:
                        `/admin/nodes/${nodeId}/traffic-period`,
                }),

                providesTags: (
                    _result,
                    _error,
                    nodeId,
                ) => [
                    {
                        type:
                            "VpnNode",
                        id:
                            `TRAFFIC-${nodeId}`,
                    },
                ],
            }),
        setNodeTrafficPeriod:
            builder.mutation<
                NodeTrafficPeriod,
                SetNodeTrafficPeriodArgs
            >({
                query: ({
                            nodeId,
                            data,
                        }) => ({
                    url:
                        `/admin/nodes/${nodeId}/traffic-period`,

                    method:
                        "POST",

                    data,
                }),

                invalidatesTags: (
                    _result,
                    _error,
                    {
                        nodeId,
                    },
                ) => [
                    {
                        type:
                            "VpnNode",
                        id:
                            `TRAFFIC-${nodeId}`,
                    },
                ],
            }),
    }),
});

export const {
    useGetVpnNodesQuery,
    useGetVpnNodeQuery,
    useCreateVpnNodeMutation,
    useUpdateVpnNodeFieldMutation,
    useInstallVpnNodeAgentMutation,
    useDeleteVpnNodeMutation,

    useGetNodeTrafficPeriodQuery,
    useSetNodeTrafficPeriodMutation,
} = vpnNodeApi;
