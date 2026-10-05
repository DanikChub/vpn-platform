import {
    randomBytes,
} from "node:crypto";

import type {
    SyncUsersMode,
} from "@vpn/common";

import VpnNode
    from "../../vpn-nodes/vpn-node.model";

import {
    EditableNodeField,
    mapNodeToAdminResponse,
} from "./admin-nodes.types";

import type {
    CreateNodeDto,
    SyncNodeUsersResponse,
} from "./admin-nodes.types";

import nodeProvisioningService
    from "../../../provisioning/provisioning.service";

import type {
    NodeSyncService,
} from "../../vpn/node-sync.service";

import {
    Op,
} from "sequelize";

import VpnNodeTrafficPeriod
    from "../../traffic/vpn-node-traffic-period.model";

import type {
    SetNodeTrafficPeriodDto,
    NodeTrafficPeriodResponse,
} from "./admin-nodes.types";


class AdminNodesService {

    public constructor(
        private readonly nodeSyncService:
            NodeSyncService,
    ) {}


    public async getAll() {
        const nodes =
            await VpnNode.findAll({
                order: [
                    ["id", "ASC"],
                ],
            });


        return Promise.all(
            nodes.map(
                async (node) => {
                    const trafficPeriod =
                        await this.getCurrentTrafficPeriod(
                            node.id,
                        );


                    return mapNodeToAdminResponse(
                        node,
                        trafficPeriod,
                    );
                },
            ),
        );
    }


    public async getById(
        nodeId: number,
    ) {
        const node =
            await VpnNode.findByPk(
                nodeId,
            );

        if (!node) {
            return null;
        }

        return mapNodeToAdminResponse(
            node,
        );
    }


    public async create(
        dto: CreateNodeDto,
    ) {
        const existingNode =
            await VpnNode.findOne({
                where: {
                    host: dto.host,
                },
            });

        if (existingNode) {
            throw new Error(
                `Node with host ${dto.host} already exists`,
            );
        }

        const node =
            await VpnNode.create({
                name:
                dto.name,

                host:
                dto.host,

                // Xray — потом заполняем вручную
                port:
                    443,

                inbound_tag:
                    "vless-reality-in",

                reality_public_key:
                    "",

                reality_server_name:
                    "",

                reality_short_id:
                    "",

                // Нужны для установки агента
                ssh_port:
                    dto.sshPort ?? 22,

                ssh_user:
                    dto.sshUser ?? "root",

                agent_token:
                    randomBytes(32)
                        .toString("hex"),

                is_active:
                    false,

                status:
                    "offline",

                install_status:
                    "pending",
            });

        return mapNodeToAdminResponse(
            node,
        );
    }


    public async syncUsers(
        nodeId: number,
        mode: SyncUsersMode,
    ): Promise<SyncNodeUsersResponse | null> {
        const node =
            await VpnNode.findByPk(
                nodeId,
            );

        if (!node) {
            return null;
        }

        if (
            node.status !==
            "online"
        ) {
            throw new Error(
                "Node agent is offline",
            );
        }

        await this.nodeSyncService.syncNode(
            node,
            mode,
        );

        return {
            nodeId:
            node.id,

            mode,

            synchronized:
                true,
        };
    }

    public async updateField(
        nodeId: number,
        field: EditableNodeField,
        value: unknown,
    ) {
        const node =
            await VpnNode.findByPk(
                nodeId,
            );

        if (!node) {
            return null;
        }

        const normalizedValue =
            this.normalizeEditableField(
                field,
                value,
            );

        await node.update({
            [field]:
            normalizedValue,
        });

        return mapNodeToAdminResponse(
            node,
        );
    }

    private normalizeEditableField(
        field: EditableNodeField,
        value: unknown,
    ) {
        switch (field) {

            case "name":
            case "display_name":
            case "ssh_user":
            case "inbound_tag":
            case "reality_public_key":
            case "reality_server_name":
            case "reality_short_id": {
                if (
                    value !== null &&
                    typeof value !== "string"
                ) {
                    throw new Error(
                        `Invalid value for ${field}`,
                    );
                }

                return value;
            }


            case "host": {
                if (
                    typeof value !== "string" ||
                    !value.trim()
                ) {
                    throw new Error(
                        "Invalid host",
                    );
                }

                return value.trim();
            }


            case "port":
            case "ssh_port": {
                if (
                    typeof value !== "number" ||
                    !Number.isInteger(value) ||
                    value < 1 ||
                    value > 65535
                ) {
                    throw new Error(
                        `Invalid ${field}`,
                    );
                }

                return value;
            }


            case "country_code": {
                if (value === null) {
                    return null;
                }

                if (
                    typeof value !== "string" ||
                    !/^[A-Za-z]{2}$/.test(value)
                ) {
                    throw new Error(
                        "Invalid country_code",
                    );
                }

                return value.toUpperCase();
            }


            case "sort_order": {
                if (
                    typeof value !== "number" ||
                    !Number.isInteger(value)
                ) {
                    throw new Error(
                        "Invalid sort_order",
                    );
                }

                return value;
            }


            case "is_active": {
                if (
                    typeof value !== "boolean"
                ) {
                    throw new Error(
                        "Invalid is_active",
                    );
                }

                return value;
            }


            default:
                throw new Error(
                    `Field "${field}" is not editable`,
                );
        }
    }

    public async installAgent(
        nodeId: number,
        sshPassword: string,
    ): Promise<void> {

        const node =
            await VpnNode.findByPk(
                nodeId,
            );

        console.log()

        if (!node) {
            throw new Error(
                "VPN node not found",
            );
        }


        if (!node.agent_token) {
            throw new Error(
                "Node agent token is missing",
            );
        }


        const controlServerUrl =
            process.env
                .AGENT_CONTROL_SERVER_URL;


        if (!controlServerUrl) {
            throw new Error(
                "AGENT_CONTROL_SERVER_URL is not configured",
            );
        }


        await node.update({
            install_status:
                "installing",
        });


        try {

            await nodeProvisioningService
                .installAgent({
                    nodeId:
                    node.id,

                    host:
                    node.host,

                    sshPort:
                    node.ssh_port,

                    sshUser:
                    node.ssh_user,

                    sshPassword,

                    token:
                    node.agent_token,

                    controlServerUrl,
                });


            /*
             * Тут НЕ ставим ready.
             *
             * Лучше дождаться HELLO от агента:
             * твой markReady() сам переведёт
             * ноду в ready/online.
             */
            await node.update({
                install_status:
                    "waiting_agent",
            });

        } catch (error) {

            await node.update({
                install_status:
                    "failed",
            });


            throw error;
        }
    }

    public async getDetails(
        nodeId: number,
    ) {
        const node =
            await VpnNode.findByPk(
                nodeId,
                {
                    attributes: {
                        exclude: [
                            "agent_token",
                        ],
                    },
                },
            );

        if (!node) {
            return null;
        }

        return node.toJSON();
    }

    public async getCurrentTrafficPeriod(
        nodeId: number,
    ): Promise<NodeTrafficPeriodResponse | null> {

        const now =
            new Date();


        const period =
            await VpnNodeTrafficPeriod
                .findOne({
                    where: {
                        node_id:
                        nodeId,

                        started_at: {
                            [Op.lte]:
                            now,
                        },

                        [Op.or]: [
                            {
                                ends_at: {
                                    [Op.gt]:
                                    now,
                                },
                            },

                            {
                                ends_at:
                                    null,
                            },
                        ],
                    },

                    order: [
                        [
                            "started_at",
                            "DESC",
                        ],
                    ],
                });


        if (!period) {
            return null;
        }


        return this.mapTrafficPeriod(
            period,
        );
    }


    public async setTrafficPeriod(
        nodeId: number,
        dto: SetNodeTrafficPeriodDto,
    ): Promise<NodeTrafficPeriodResponse | null> {

        const node =
            await VpnNode.findByPk(
                nodeId,
            );


        if (!node) {
            return null;
        }


        const startedAt =
            new Date(
                dto.startedAt,
            );


        if (
            Number.isNaN(
                startedAt.getTime(),
            )
        ) {
            throw new Error(
                "Invalid startedAt",
            );
        }


        let endsAt:
            Date | null =
            null;


        if (dto.endsAt !== null) {

            endsAt =
                new Date(
                    dto.endsAt,
                );


            if (
                Number.isNaN(
                    endsAt.getTime(),
                )
            ) {
                throw new Error(
                    "Invalid endsAt",
                );
            }


            if (
                endsAt <=
                startedAt
            ) {
                throw new Error(
                    "endsAt must be after startedAt",
                );
            }
        }


        let limitBytes:
            string | null =
            null;


        if (
            dto.limitBytes !==
            null
        ) {

            if (
                typeof dto.limitBytes !==
                "string" ||
                !/^\d+$/.test(
                    dto.limitBytes,
                )
            ) {
                throw new Error(
                    "Invalid limitBytes",
                );
            }


            const parsedLimit =
                BigInt(
                    dto.limitBytes,
                );


            if (
                parsedLimit <= 0n
            ) {
                throw new Error(
                    "limitBytes must be greater than zero",
                );
            }


            limitBytes =
                parsedLimit
                    .toString();
        }


        /*
         * Пока запрещаем пересекающиеся периоды.
         *
         * Иначе TrafficService мог бы выбрать
         * один из двух активных периодов,
         * и статистика стала бы неоднозначной.
         */
        const overlappingPeriod =
            await VpnNodeTrafficPeriod
                .findOne({
                    where: {
                        node_id:
                        nodeId,

                        started_at: {
                            [Op.lt]:
                                endsAt ??
                                new Date(
                                    "9999-12-31T23:59:59.999Z",
                                ),
                        },

                        [Op.or]: [
                            {
                                ends_at:
                                    null,
                            },

                            {
                                ends_at: {
                                    [Op.gt]:
                                    startedAt,
                                },
                            },
                        ],
                    },
                });


        if (overlappingPeriod) {
            throw new Error(
                "Traffic period overlaps existing period",
            );
        }


        const period =
            await VpnNodeTrafficPeriod
                .create({
                    node_id:
                    nodeId,

                    started_at:
                    startedAt,

                    ends_at:
                    endsAt,

                    limit_bytes:
                    limitBytes,

                    used_bytes:
                        "0",

                    created_at:
                        new Date(),

                    updated_at:
                        new Date(),
                });


        return this.mapTrafficPeriod(
            period,
        );
    }


    private mapTrafficPeriod(
        period: VpnNodeTrafficPeriod,
    ): NodeTrafficPeriodResponse {

        return {
            id:
            period.id,

            nodeId:
            period.node_id,

            startedAt:
            period.started_at,

            endsAt:
            period.ends_at,

            limitBytes:
            period.limit_bytes,

            usedBytes:
            period.used_bytes,

            createdAt:
            period.created_at,

            updatedAt:
            period.updated_at,
        };
    }

    public async delete(
        nodeId: number,
    ): Promise<boolean> {
        const node =
            await VpnNode.findByPk(
                nodeId,
            );

        if (!node) {
            return false;
        }

        await node.destroy();

        return true;
    }

}


export default AdminNodesService;