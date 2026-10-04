import {
    MessageType,
} from "./message-type.js";

import type {
    ProtocolMessage,
} from "./message.js";


export interface TrafficBytes {
    uplinkBytes: number;
    downlinkBytes: number;
}


export interface UserTrafficReport
    extends TrafficBytes {

    /*
     * Это Xray email.
     *
     * Сейчас backend генерирует его как:
     * user_${userId}
     */
    email: string;
}


export interface TrafficReportPayload {

    /*
     * Время снятия snapshot на ноде.
     */
    timestamp: string;


    /*
     * Абсолютные counters Xray.
     *
     * НЕ delta.
     */
    node: TrafficBytes;


    /*
     * Абсолютные counters каждого
     * пользователя Xray.
     */
    users: UserTrafficReport[];
}


export type TrafficReportMessage =
    ProtocolMessage<
        MessageType.TRAFFIC_REPORT,
        TrafficReportPayload
    >;