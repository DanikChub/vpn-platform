import type {
    TrafficReportPayload,
} from "@vpn/common";

import {
    Op,
    type Transaction,
} from "sequelize";

import sequelize
    from "../../database/sequelize";

import User
    from "../users/user.model";

import VpnNode
    from "../vpn-nodes/vpn-node.model";

import VpnNodeTraffic
    from "./vpn-node-traffic.model";

import VpnUserNodeTraffic
    from "./vpn-user-node-traffic.model";

import VpnNodeTrafficPeriod
    from "./vpn-node-traffic-period.model";


interface ApplySnapshotInput {
    nodeId: number;
    snapshot: TrafficReportPayload;
}


interface TrafficCounters {
    uplinkBytes: bigint;
    downlinkBytes: bigint;
}


class TrafficService {

    public async applySnapshot(
        input: ApplySnapshotInput,
    ): Promise<void> {

        await sequelize.transaction(
            async transaction => {

                await this.ensureNodeExists(
                    input.nodeId,
                    transaction,
                );


                await this.applyNodeTraffic(
                    input.nodeId,
                    input.snapshot,
                    transaction,
                );


                for (
                    const userTraffic
                    of input.snapshot.users
                    ) {

                    const userId =
                        this.parseUserId(
                            userTraffic.email,
                        );


                    /*
                     * На ноде теоретически может
                     * остаться старый Xray user,
                     * которого уже нет в БД.
                     *
                     * Из-за этого весь report
                     * падать не должен.
                     */
                    if (userId === null) {
                        continue;
                    }


                    const user =
                        await User.findByPk(
                            userId,
                            {
                                transaction,
                            },
                        );


                    if (!user) {
                        continue;
                    }


                    await this.applyUserTraffic(
                        userId,
                        input.nodeId,
                        {
                            uplinkBytes:
                                BigInt(
                                    userTraffic
                                        .uplinkBytes,
                                ),

                            downlinkBytes:
                                BigInt(
                                    userTraffic
                                        .downlinkBytes,
                                ),
                        },
                        transaction,
                    );
                }
            },
        );
    }


    private async applyNodeTraffic(
        nodeId: number,
        snapshot: TrafficReportPayload,
        transaction: Transaction,
    ): Promise<void> {

        const current: TrafficCounters = {
            uplinkBytes:
                BigInt(
                    snapshot.node
                        .uplinkBytes,
                ),

            downlinkBytes:
                BigInt(
                    snapshot.node
                        .downlinkBytes,
                ),
        };


        const [
            traffic,
            created,
        ] =
            await VpnNodeTraffic.findOrCreate({
                where: {
                    node_id:
                    nodeId,
                },

                defaults: {
                    node_id:
                    nodeId,

                    /*
                     * Первый увиденный snapshot
                     * считаем уже использованным
                     * трафиком.
                     *
                     * Иначе при первом запуске
                     * потеряем всё, что Xray
                     * успел насчитать до запуска
                     * reporter.
                     */
                    uplink_bytes:
                        current.uplinkBytes
                            .toString(),

                    downlink_bytes:
                        current.downlinkBytes
                            .toString(),

                    last_xray_uplink:
                        current.uplinkBytes
                            .toString(),

                    last_xray_downlink:
                        current.downlinkBytes
                            .toString(),

                    updated_at:
                        new Date(),
                },

                transaction,

                lock:
                transaction.LOCK.UPDATE,
            });


        if (created) {
            return;
        }


        const previous: TrafficCounters = {
            uplinkBytes:
                BigInt(
                    traffic
                        .last_xray_uplink,
                ),

            downlinkBytes:
                BigInt(
                    traffic
                        .last_xray_downlink,
                ),
        };


        const delta =
            this.calculateDelta(
                current,
                previous,
            );

        await this.applyNodePeriodTraffic(
            nodeId,
            delta,
            transaction,
        );


        traffic.uplink_bytes =
            (
                BigInt(
                    traffic.uplink_bytes,
                ) +
                delta.uplinkBytes
            ).toString();


        traffic.downlink_bytes =
            (
                BigInt(
                    traffic.downlink_bytes,
                ) +
                delta.downlinkBytes
            ).toString();


        traffic.last_xray_uplink =
            current.uplinkBytes
                .toString();


        traffic.last_xray_downlink =
            current.downlinkBytes
                .toString();


        traffic.updated_at =
            new Date();


        await traffic.save({
            transaction,
        });
    }


    private async applyUserTraffic(
        userId: number,
        nodeId: number,
        current: TrafficCounters,
        transaction: Transaction,
    ): Promise<void> {

        const [
            traffic,
            created,
        ] =
            await VpnUserNodeTraffic
                .findOrCreate({
                    where: {
                        user_id:
                        userId,

                        node_id:
                        nodeId,
                    },

                    defaults: {
                        user_id:
                        userId,

                        node_id:
                        nodeId,

                        uplink_bytes:
                            current
                                .uplinkBytes
                                .toString(),

                        downlink_bytes:
                            current
                                .downlinkBytes
                                .toString(),

                        last_xray_uplink:
                            current
                                .uplinkBytes
                                .toString(),

                        last_xray_downlink:
                            current
                                .downlinkBytes
                                .toString(),

                        updated_at:
                            new Date(),
                    },

                    transaction,

                    lock:
                    transaction.LOCK.UPDATE,
                });


        if (created) {
            return;
        }


        const previous: TrafficCounters = {
            uplinkBytes:
                BigInt(
                    traffic
                        .last_xray_uplink,
                ),

            downlinkBytes:
                BigInt(
                    traffic
                        .last_xray_downlink,
                ),
        };


        const delta =
            this.calculateDelta(
                current,
                previous,
            );


        traffic.uplink_bytes =
            (
                BigInt(
                    traffic.uplink_bytes,
                ) +
                delta.uplinkBytes
            ).toString();


        traffic.downlink_bytes =
            (
                BigInt(
                    traffic.downlink_bytes,
                ) +
                delta.downlinkBytes
            ).toString();


        traffic.last_xray_uplink =
            current.uplinkBytes
                .toString();


        traffic.last_xray_downlink =
            current.downlinkBytes
                .toString();


        traffic.updated_at =
            new Date();


        await traffic.save({
            transaction,
        });
    }


    private async applyNodePeriodTraffic(
        nodeId: number,
        delta: TrafficCounters,
        transaction: Transaction,
    ): Promise<void> {

        const now =
            new Date();


        /*
         * Ищем расчётный период,
         * в который попадает текущее время.
         *
         * ends_at = NULL означает период
         * без фиксированной даты окончания.
         */
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

                    transaction,

                    lock:
                    transaction
                        .LOCK
                        .UPDATE,
                });


        /*
         * Период ещё не настроен.
         *
         * Это не ошибка traffic reporter:
         * lifetime-трафик продолжает
         * считаться как обычно.
         */
        if (!period) {
            return;
        }


        const deltaBytes =
            delta.uplinkBytes +
            delta.downlinkBytes;


        if (deltaBytes === 0n) {
            return;
        }


        period.used_bytes =
            (
                BigInt(
                    period.used_bytes,
                ) +
                deltaBytes
            ).toString();


        period.updated_at =
            now;


        await period.save({
            transaction,
        });
    }

    private calculateDelta(
        current: TrafficCounters,
        previous: TrafficCounters,
    ): TrafficCounters {

        return {
            uplinkBytes:
                current.uplinkBytes >=
                previous.uplinkBytes

                    ? current.uplinkBytes -
                    previous.uplinkBytes

                    : current.uplinkBytes,


            downlinkBytes:
                current.downlinkBytes >=
                previous.downlinkBytes

                    ? current.downlinkBytes -
                    previous.downlinkBytes

                    : current.downlinkBytes,
        };
    }


    private parseUserId(
        email: string,
    ): number | null {

        const match =
            /^user_(\d+)$/
                .exec(
                    email,
                );


        if (!match) {
            return null;
        }


        const userId =
            Number(
                match[1],
            );


        if (
            !Number.isSafeInteger(
                userId,
            ) ||
            userId <= 0
        ) {
            return null;
        }


        return userId;
    }


    private async ensureNodeExists(
        nodeId: number,
        transaction: Transaction,
    ): Promise<void> {

        const node =
            await VpnNode.findByPk(
                nodeId,
                {
                    transaction,
                },
            );


        if (!node) {
            throw new Error(
                `VPN node ${nodeId} not found`,
            );
        }
    }
}


export default new TrafficService();