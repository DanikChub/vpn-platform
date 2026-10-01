import VpnCredential from "./vpn-credential.model";
import VpnNode from "../vpn-nodes/vpn-node.model";


class VlessUrlService {

    build(
        credential: VpnCredential,
        node: VpnNode,
    ) {
        return this.buildNodeConfig(
            credential,
            node,
        );
    }


    private buildNodeConfig(
        credential: VpnCredential,
        node: VpnNode,
    ) {
        return {
            dns: {
                hosts: {
                    "domain:googleapis.cn":
                        "googleapis.com",
                },

                queryStrategy:
                    "UseIPv4",

                servers: [
                    "1.1.1.1",

                    {
                        address:
                            "1.1.1.1",

                        domains: [],

                        port:
                            53,
                    },

                    {
                        address:
                            "8.8.8.8",

                        domains: [],

                        port:
                            53,
                    },
                ],
            },

            inbounds: [
                {
                    listen:
                        "127.0.0.1",

                    port:
                        10808,

                    protocol:
                        "socks",

                    settings: {
                        auth:
                            "noauth",

                        udp:
                            true,

                        userLevel:
                            8,
                    },

                    sniffing: {
                        destOverride: [
                            "http",
                            "tls",
                            "quic",
                        ],

                        enabled:
                            true,
                    },

                    tag:
                        "socks",
                },

                {
                    listen:
                        "127.0.0.1",

                    port:
                        11111,

                    protocol:
                        "dokodemo-door",

                    settings: {
                        address:
                            "127.0.0.1",
                    },

                    tag:
                        "metrics_in",
                },
            ],

            log: {
                loglevel:
                    "debug",
            },

            metrics: {
                tag:
                    "metrics_out",
            },

            outbounds: [
                {
                    mux: {
                        concurrency:
                            -1,

                        enabled:
                            false,

                        xudpConcurrency:
                            8,

                        xudpProxyUDP443:
                            "",
                    },

                    protocol:
                        "vless",

                    settings: {
                        vnext: [
                            {
                                address:
                                node.host,

                                port:
                                node.port,

                                users: [
                                    {
                                        encryption:
                                            "none",

                                        flow:
                                            "xtls-rprx-vision",

                                        id:
                                        credential.uuid,

                                        level:
                                            8,

                                        security:
                                            "auto",
                                    },
                                ],
                            },
                        ],
                    },

                    streamSettings: {
                        network:
                            "tcp",

                        realitySettings: {
                            allowInsecure:
                                false,

                            fingerprint:
                                "firefox",

                            publicKey:
                            node.reality_public_key,

                            serverName:
                            node.reality_server_name,

                            shortId:
                            node.reality_short_id,

                            show:
                                false,

                            spiderX:
                                "/",
                        },

                        security:
                            "reality",

                        tcpSettings: {
                            header: {
                                type:
                                    "none",
                            },
                        },
                    },

                    tag:
                        "proxy",
                },

                {
                    protocol:
                        "freedom",

                    settings: {
                        domainStrategy:
                            "UseIP",
                    },

                    tag:
                        "direct",
                },

                {
                    protocol:
                        "blackhole",

                    settings: {
                        response: {
                            type:
                                "http",
                        },
                    },

                    tag:
                        "block",
                },
            ],

            policy: {
                levels: {
                    "0": {
                        statsUserDownlink:
                            true,

                        statsUserUplink:
                            true,
                    },

                    "8": {
                        connIdle:
                            300,

                        downlinkOnly:
                            1,

                        handshake:
                            4,

                        uplinkOnly:
                            1,
                    },
                },

                system: {
                    statsInboundDownlink:
                        true,

                    statsInboundUplink:
                        true,

                    statsOutboundDownlink:
                        true,

                    statsOutboundUplink:
                        true,
                },
            },

            remarks:
                this.buildHappRemarks(
                    node,
                ),

            routing: {
                domainStrategy:
                    "IPIfNonMatch",

                rules: [
                    {
                        inboundTag: [
                            "metrics_in",
                        ],

                        outboundTag:
                            "metrics_out",
                    },

                    {
                        inboundTag: [
                            "socks",
                        ],

                        outboundTag:
                            "proxy",

                        port:
                            "53",
                    },

                    {
                        ip: [
                            "1.1.1.1",
                        ],

                        outboundTag:
                            "proxy",

                        port:
                            "53",
                    },

                    {
                        ip: [
                            "8.8.8.8",
                        ],

                        outboundTag:
                            "direct",

                        port:
                            "53",
                    },
                ],
            },

            stats: {},
        };
    }


    private buildHappRemarks(
        node: VpnNode,
    ): string {
        const name =
            node.display_name ??
            node.name;

        const flag =
            this.countryCodeToFlag(
                node.country_code,
            );

        return flag
            ? `${flag} ${name}`
            : name;
    }


    private countryCodeToFlag(
        countryCode: string | null,
    ): string | null {
        if (
            !countryCode ||
            !/^[A-Za-z]{2}$/.test(
                countryCode,
            )
        ) {
            return null;
        }

        return countryCode
            .toUpperCase()
            .split("")
            .map(
                (char) =>
                    String.fromCodePoint(
                        127397 +
                        char.charCodeAt(0),
                    ),
            )
            .join("");
    }
}


export default new VlessUrlService();