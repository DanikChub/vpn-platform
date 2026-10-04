export interface VpnNode {
    id: number;

    name: string;
    host: string;
    port: number;

    reality_public_key: string;
    reality_server_name: string;
    reality_short_id: string;

    inbound_tag: string;

    is_active: boolean;

    status:
        | "online"
        | "offline";

    last_seen_at: string | null;

    cpu_count: number | null;
    cpu_model: string | null;

    memory_total: number | null;
    memory_used: number | null;

    uptime_seconds: number | null;

    install_status:
        | "pending"
        | "installing"
        | "waiting_agent"
        | "ready"
        | "failed";

    agent_token: string | null;

    ssh_port: number;
    ssh_user: string;

    display_name: string | null;

    country_code: string | null;

    sort_order: number;
}

export interface CreateVpnNodeDto {

    name:string;

    host:string;

    port:number;

    sshPort:number;

    sshUser:string;

    sshPassword:string;

}

export type EditableNodeField =
    | "name"
    | "display_name"
    | "host"
    | "port"
    | "ssh_port"
    | "ssh_user"
    | "inbound_tag"
    | "reality_public_key"
    | "reality_server_name"
    | "reality_short_id"
    | "country_code"
    | "sort_order"
    | "is_active";


export interface NodeTrafficPeriod {
    id: number;
    nodeId: number;

    startedAt: string;
    endsAt: string | null;

    limitBytes: string | null;
    usedBytes: string;

    createdAt: string;
    updatedAt: string;
}


export interface SetNodeTrafficPeriodDto {
    startedAt: string;
    endsAt: string | null;
    limitBytes: string | null;
}