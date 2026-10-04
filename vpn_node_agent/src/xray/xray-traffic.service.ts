import type {
    XrayStat,
} from "./api/xray-api.client.js";

import {
    XrayApiClient,
} from "./api/xray-api.client.js";


export interface XrayTrafficBytes {
    uplinkBytes: number;
    downlinkBytes: number;
}


export interface XrayUserTraffic
    extends XrayTrafficBytes {

    email: string;
}


export interface XrayTrafficSnapshot {
    node: XrayTrafficBytes;
    users: XrayUserTraffic[];
}


interface MutableTrafficBytes {
    uplinkBytes: number;
    downlinkBytes: number;
}


export class XrayTrafficService {

    public constructor(
        private readonly xrayApiClient:
        XrayApiClient,
    ) {}


    public async getSnapshot():
        Promise<XrayTrafficSnapshot> {

        const stats =
            await this.xrayApiClient.queryStats(
                "",
            );


        return {
            node:
                this.parseNodeTraffic(
                    stats,
                ),

            users:
                this.parseUserTraffic(
                    stats,
                ),
        };
    }


    private parseNodeTraffic(
        stats: XrayStat[],
    ): XrayTrafficBytes {

        const result: MutableTrafficBytes = {
            uplinkBytes: 0,
            downlinkBytes: 0,
        };


        for (const stat of stats) {

            const match =
                /^outbound>>>.+>>>traffic>>>(uplink|downlink)$/
                    .exec(
                        stat.name,
                    );


            if (!match) {
                continue;
            }


            const direction =
                match[1];


            if (direction === "uplink") {
                result.uplinkBytes +=
                    stat.value;
            } else if (direction === "downlink") {
                result.downlinkBytes +=
                    stat.value;
            }
        }


        return result;
    }


    private parseUserTraffic(
        stats: XrayStat[],
    ): XrayUserTraffic[] {

        const users =
            new Map<
                string,
                MutableTrafficBytes
            >();


        for (const stat of stats) {

            const parsed =
                this.parseUserStat(
                    stat,
                );


            if (!parsed) {
                continue;
            }


            const traffic =
                users.get(
                    parsed.email,
                ) ?? {
                    uplinkBytes: 0,
                    downlinkBytes: 0,
                };


            if (
                parsed.direction ===
                "uplink"
            ) {
                traffic.uplinkBytes =
                    stat.value;
            } else {
                traffic.downlinkBytes =
                    stat.value;
            }


            users.set(
                parsed.email,
                traffic,
            );
        }


        return Array.from(
            users.entries(),
        ).map(
            ([
                 email,
                 traffic,
             ]) => ({
                email,
                ...traffic,
            }),
        );
    }


    private parseUserStat(
        stat: XrayStat,
    ): {
        email: string;
        direction:
            "uplink" |
            "downlink";
    } | null {

        const match =
            /^user>>>(.+)>>>traffic>>>(uplink|downlink)$/
                .exec(
                    stat.name,
                );


        if (!match) {
            return null;
        }


        const email =
            match[1];

        const direction =
            match[2];


        if (
            !email ||
            (
                direction !== "uplink" &&
                direction !== "downlink"
            )
        ) {
            return null;
        }


        return {
            email,
            direction,
        };
    }
}