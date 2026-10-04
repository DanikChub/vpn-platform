import {
    MessageType,
    type TrafficReportMessage,
    type TrafficReportPayload,
} from "@vpn/common";

import type {
    AgentMessageContext,
} from "../transport/message-router";

import type {
    NodeRegistry,
} from "../connection/node-registry";

import type {
    AgentMessageSender,
} from "../transport/message-sender";

import trafficService
    from "../../../modules/traffic/traffic.service";


interface TrafficReportHandlerOptions {
    nodeRegistry: NodeRegistry;
    messageSender: AgentMessageSender;
}


export class TrafficReportHandler {

    private readonly nodeRegistry:
        NodeRegistry;

    private readonly messageSender:
        AgentMessageSender;


    public constructor(
        options:
        TrafficReportHandlerOptions,
    ) {

        this.nodeRegistry =
            options.nodeRegistry;

        this.messageSender =
            options.messageSender;
    }


    public handle = async (
        context:
        AgentMessageContext<
            TrafficReportMessage
        >,
    ): Promise<void> => {

        const {
            socket,
            message,
        } = context;


        /*
         * nodeId НЕ доверяем из payload.
         *
         * Его там вообще нет.
         * Определяем ноду по уже
         * аутентифицированному socket.
         */
        const agent =
            this.nodeRegistry
                .findBySocket(
                    socket,
                );


        if (!agent) {

            this.messageSender.sendError(
                socket,
                "NOT_AUTHENTICATED",
                "Agent must authenticate before sending traffic",
                message.requestId,
            );


            socket.close(
                1008,
                "Authentication required",
            );


            return;
        }


        if (
            !this.isValidPayload(
                message.payload,
            )
        ) {

            this.messageSender.sendError(
                socket,
                "INVALID_TRAFFIC_REPORT",
                "Traffic report payload is invalid",
                message.requestId,
            );


            return;
        }


        await trafficService.applySnapshot({
            nodeId:
            agent.nodeId,

            snapshot:
            message.payload,
        });

        console.log(
            "Traffic report applied",
            {
                nodeId:
                agent.nodeId,

                users:
                message.payload
                    .users
                    .length,
            },
        );
    };


    private isValidPayload(
        payload: unknown,
    ): payload is TrafficReportPayload {

        if (
            typeof payload !== "object" ||
            payload === null ||
            Array.isArray(payload)
        ) {
            return false;
        }


        const value =
            payload as Record<
                string,
                unknown
            >;


        if (
            typeof value.timestamp !==
            "string" ||
            Number.isNaN(
                Date.parse(
                    value.timestamp,
                ),
            )
        ) {
            return false;
        }


        if (
            !this.isTrafficBytes(
                value.node,
            )
        ) {
            return false;
        }


        if (
            !Array.isArray(
                value.users,
            )
        ) {
            return false;
        }


        for (
            const rawUser
            of value.users
            ) {

            if (
                typeof rawUser !==
                "object" ||
                rawUser === null ||
                Array.isArray(rawUser)
            ) {
                return false;
            }


            const user =
                rawUser as Record<
                    string,
                    unknown
                >;


            if (
                typeof user.email !==
                "string" ||
                !user.email.trim()
            ) {
                return false;
            }


            if (
                !this.isTrafficBytes(
                    user,
                )
            ) {
                return false;
            }
        }


        return true;
    }


    private isTrafficBytes(
        value: unknown,
    ): boolean {

        if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
        ) {
            return false;
        }


        const traffic =
            value as Record<
                string,
                unknown
            >;


        return (
            this.isValidByteCounter(
                traffic.uplinkBytes,
            ) &&
            this.isValidByteCounter(
                traffic.downlinkBytes,
            )
        );
    }


    private isValidByteCounter(
        value: unknown,
    ): value is number {

        return (
            typeof value === "number" &&
            Number.isSafeInteger(value) &&
            value >= 0
        );
    }
}