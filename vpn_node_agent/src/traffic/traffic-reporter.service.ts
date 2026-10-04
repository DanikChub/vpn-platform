import {
    MessageType,
    type TrafficReportMessage,
} from "@vpn/common";

import type {
    AgentConnection,
} from "../connection/agent-connection.js";

import type {
    XrayTrafficService,
} from "../xray/xray-traffic.service.js";

import {
    logger,
} from "../logger/logger.js";


export class TrafficReporterService {

    private timer:
        NodeJS.Timeout | undefined;

    private isReporting = false;


    public constructor(
        private readonly connection:
        AgentConnection,

        private readonly trafficService:
        XrayTrafficService,

        private readonly intervalMs =
        60_000,
    ) {}


    public start(): void {

        if (this.timer) {
            return;
        }


        /*
         * Первый snapshot отправляем сразу.
         */
        void this.report();


        this.timer =
            setInterval(
                () => {
                    void this.report();
                },
                this.intervalMs,
            );


        /*
         * Сам timer не должен мешать
         * завершению процесса.
         */
        this.timer.unref();
    }


    public stop(): void {

        if (!this.timer) {
            return;
        }


        clearInterval(
            this.timer,
        );


        this.timer = undefined;
    }


    private async report():
        Promise<void> {

        /*
         * Если запрос к Xray вдруг выполняется
         * дольше intervalMs, не запускаем
         * второй параллельный report.
         */
        if (this.isReporting) {
            logger.warn(
                "Skipping traffic report because previous report is still running",
            );

            return;
        }


        /*
         * При разорванном WS даже не ходим
         * лишний раз в Xray.
         */
        if (!this.connection.connected) {
            return;
        }


        this.isReporting = true;


        try {

            const snapshot =
                await this.trafficService
                    .getSnapshot();


            const message:
                TrafficReportMessage = {

                type:
                MessageType.TRAFFIC_REPORT,

                payload: {
                    timestamp:
                        new Date()
                            .toISOString(),

                    node: {
                        uplinkBytes:
                        snapshot.node
                            .uplinkBytes,

                        downlinkBytes:
                        snapshot.node
                            .downlinkBytes,
                    },

                    users:
                        snapshot.users.map(
                            user => ({
                                email:
                                user.email,

                                uplinkBytes:
                                user.uplinkBytes,

                                downlinkBytes:
                                user.downlinkBytes,
                            }),
                        ),
                },
            };


            this.connection.send(
                message,
            );


            logger.debug(
                "Traffic report sent",
                {
                    nodeUplinkBytes:
                    snapshot.node
                        .uplinkBytes,

                    nodeDownlinkBytes:
                    snapshot.node
                        .downlinkBytes,

                    users:
                    snapshot.users.length,
                },
            );

        } catch (error) {

            /*
             * Ошибка статистики не должна
             * убивать весь агент.
             */
            logger.error(
                "Failed to send traffic report",
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error),
                },
            );

        } finally {

            this.isReporting = false;
        }
    }
}