import {
    type VpnNode,
    useInstallVpnNodeAgentMutation,
    useUpdateVpnNodeFieldMutation,
} from "@/entities/vpn-node";

import {
    Badge, Button,
    Card,
    CardContent,
    DetailsRow, Input, Modal,
} from "@/shared/ui";

import {
    formatDate,
} from "@/shared/lib";
import {useState} from "react";


interface NodeDetailsContentProps {
    node: VpnNode;
}


const NodeDetailsContent = ({
                                node,
                            }: NodeDetailsContentProps) => {
    return (
        <div className="space-y-5">

            <div className="grid gap-5 xl:grid-cols-2">

                <Card>
                    <CardContent>
                        <CardTitle>
                            Основная информация
                        </CardTitle>

                        <div className="mt-5 space-y-4">
                            <DetailsRow
                                label="ID"
                                value={
                                    node.id
                                }
                            />

                            <DetailsRow
                                label="Название"
                                value={
                                    node.name
                                }
                            />

                            <DetailsRow
                                label="Активна"
                                value={
                                    node.is_active
                                        ? "Да"
                                        : "Нет"
                                }
                            />
                        </div>
                    </CardContent>
                </Card>


                <HappNodePreview
                    node={node}
                />

            </div>

            <div className="grid gap-5 xl:grid-cols-2">

                <Card>
                    <CardContent>
                        <CardTitle>
                            Основная информация
                        </CardTitle>

                        <div className="mt-5 space-y-4">
                            <DetailsRow
                                label="ID"
                                value={
                                    node.id
                                }
                            />

                            <DetailsRow
                                label="Название"
                                value={
                                    node.name
                                }
                            />

                            <DetailsRow
                                label="Активна"
                                value={
                                    node.is_active
                                        ? "Да"
                                        : "Нет"
                                }
                            />
                        </div>
                    </CardContent>
                </Card>


                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle>
                                Состояние
                            </CardTitle>

                            <NodeStatusBadge
                                status={
                                    node.status
                                }
                            />
                        </div>

                        <div className="mt-5 space-y-4">
                            <DetailsRow
                                label="Статус"
                                value={
                                    getNodeStatusLabel(
                                        node.status,
                                    )
                                }
                            />

                            <DetailsRow
                                label="Последний heartbeat"
                                value={
                                    node.last_seen_at
                                        ? formatDate(
                                            node.last_seen_at,
                                        )
                                        : "Нет данных"
                                }
                            />

                            <DetailsRow
                                label="Uptime"
                                value={
                                    formatUptime(
                                        node.uptime_seconds,
                                    )
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

            </div>


            <div className="grid gap-5 xl:grid-cols-2">

                <NodeConnectionSettings
                    node={node}
                />


                <NodeRealitySettings
                    node={node}
                />

            </div>


            <div className="grid gap-5 xl:grid-cols-2">

                <Card>
                    <CardContent>
                        <CardTitle>
                            Ресурсы сервера
                        </CardTitle>

                        <div className="mt-5 space-y-4">
                            <DetailsRow
                                label="CPU"
                                value={
                                    node.cpu_model ??
                                    "Нет данных"
                                }
                            />

                            <DetailsRow
                                label="Количество CPU"
                                value={
                                    node.cpu_count ??
                                    "Нет данных"
                                }
                            />

                            <DetailsRow
                                label="Память"
                                value={
                                    formatMemoryUsage(
                                        node.memory_used,
                                        node.memory_total,
                                    )
                                }
                            />

                            <DetailsRow
                                label="Использовано памяти"
                                value={
                                    formatBytes(
                                        node.memory_used,
                                    )
                                }
                            />

                            <DetailsRow
                                label="Всего памяти"
                                value={
                                    formatBytes(
                                        node.memory_total,
                                    )
                                }
                            />
                        </div>
                    </CardContent>
                </Card>


                

            </div>

        </div>
    );
};


interface CardTitleProps {
    children: React.ReactNode;
}


function CardTitle({
                       children,
                   }: CardTitleProps) {
    return (
        <h2 className="text-lg font-semibold text-slate-950">
            {children}
        </h2>
    );
}


interface NodeStatusBadgeProps {
    status:
        | "online"
        | "offline";
}


function NodeStatusBadge({
                             status,
                         }: NodeStatusBadgeProps) {
    if (
        status === "online"
    ) {
        return (
            <Badge>
                Online
            </Badge>
        );
    }

    return (
        <Badge>
            Offline
        </Badge>
    );
}


interface HappNodePreviewProps {
    node: VpnNode;
}


function HappNodePreview({
                             node,
                         }: HappNodePreviewProps) {
    const [
        isOpen,
        setIsOpen,
    ] = useState(false);

    const [
        displayName,
        setDisplayName,
    ] = useState(
        node.display_name ??
        node.name,
    );

    const [
        countryCode,
        setCountryCode,
    ] = useState(
        node.country_code ??
        "",
    );

    const [updateVpnNodeField, { isLoading: isSaving }] =
        useUpdateVpnNodeFieldMutation();


    const country =
        node.country_code ??
        "--";

    const previewName =
        node.display_name ??
        node.name;


    const handleOpen = () => {
        setDisplayName(
            node.display_name ??
            node.name,
        );

        setCountryCode(
            node.country_code ??
            "",
        );

        setIsOpen(true);
    };


    const handleSave = async () => {
        if (displayName !== (node.display_name ?? node.name)) {
            await updateVpnNodeField({
                nodeId: node.id,
                field: "display_name",
                value: displayName,
            }).unwrap();
        }

        if (countryCode !== (node.country_code ?? "")) {
            await updateVpnNodeField({
                nodeId: node.id,
                field: "country_code",
                value: countryCode || null,
            }).unwrap();
        }

        setIsOpen(false);
    };


    return (
        <>
            <button
                type="button"
                onClick={
                    handleOpen
                }
                className="
                    group
                    relative
                    min-h-[230px]
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-transparent
                    bg-[#18191d]
                    p-6
                    text-left
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-white/10
                    hover:shadow-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-400/40
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-white/[0.02]
                        opacity-0
                        transition-opacity
                        duration-200
                        group-hover:opacity-100
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-20
                        size-52
                        rounded-full
                        bg-white/[0.035]
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-24
                        -left-12
                        size-48
                        rounded-full
                        bg-white/[0.025]
                    "
                />

                <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                                HAPP
                            </div>

                            <h2 className="mt-1 text-sm font-medium text-white/70">
                                Preview
                            </h2>
                        </div>

                        <div className="rounded-full bg-white/[0.07] px-3 py-1 text-xs font-medium text-white/50">
                            #{node.sort_order}
                        </div>
                    </div>

                    <div className="mt-10 flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-base font-semibold uppercase tracking-wider text-white">
                            {country}
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-xl font-semibold tracking-tight text-white">
                                {previewName}
                            </div>

                            <div className="mt-1 text-sm text-white/40">
                                {getCountryLabel(
                                    node.country_code,
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-8">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                                display name
                            </div>

                            <div className="mt-1 text-xs text-white/45">
                                {previewName}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                                country
                            </div>

                            <div className="mt-1 font-mono text-xs text-white/45">
                                {country}
                            </div>
                        </div>
                    </div>
                </div>
            </button>


            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                title="Настройки отображения HAPP"
            >
                <div className="space-y-5">

                    <Input
                        label="Название"
                        value={
                            displayName
                        }
                        onChange={(
                            event
                        ) => {
                            setDisplayName(
                                event.target.value,
                            );
                        }}
                        placeholder="Amsterdam"
                    />


                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Страна
                        </label>

                        <select
                            value={
                                countryCode
                            }
                            onChange={(
                                event
                            ) => {
                                setCountryCode(
                                    event.target.value,
                                );
                            }}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-slate-950
                                outline-none
                                transition
                                focus:border-slate-400
                                focus:ring-2
                                focus:ring-slate-200
                            "
                        >
                            <option value="">
                                Не выбрана
                            </option>

                            {COUNTRIES.map(
                                (
                                    country
                                ) => (
                                    <option
                                        key={
                                            country.code
                                        }
                                        value={
                                            country.code
                                        }
                                    >
                                        {
                                            country.name
                                        } (
                                        {
                                            country.code
                                        })
                                    </option>
                                ),
                            )}
                        </select>
                    </div>


                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Отмена
                        </Button>

                        <Button
                            disabled={
                                isSaving
                            }
                            onClick={
                                handleSave
                            }
                        >
                            {isSaving
                                ? "Сохранение..."
                                : "Сохранить"}
                        </Button>
                    </div>

                </div>
            </Modal>
        </>
    );
}


const COUNTRIES = [
    {
        code: "NL",
        name: "Netherlands",
    },
    {
        code: "DE",
        name: "Germany",
    },
    {
        code: "FI",
        name: "Finland",
    },
    {
        code: "FR",
        name: "France",
    },
    {
        code: "GB",
        name: "United Kingdom",
    },
    {
        code: "US",
        name: "United States",
    },
    {
        code: "SE",
        name: "Sweden",
    },
    {
        code: "PL",
        name: "Poland",
    },
    {
        code: "CH",
        name: "Switzerland",
    },
];


function getCountryLabel(
    countryCode:
        | string
        | null,
): string {
    if (!countryCode) {
        return "Страна не указана";
    }

    return (
        COUNTRIES.find(
            (
                country
            ) =>
                country.code ===
                countryCode.toUpperCase(),
        )?.name ??
        countryCode
    );
}


function getNodeStatusLabel(
    status: VpnNode["status"],
): string {
    switch (status) {
        case "online":
            return "Онлайн";

        case "offline":
            return "Оффлайн";

        default:
            return "Неизвестно";
    }
}




function formatBytes(
    value:
        | number
        | null,
): string {
    if (
        value === null
    ) {
        return "Нет данных";
    }

    const gigabytes =
        value /
        1024 /
        1024 /
        1024;

    if (
        gigabytes >= 1
    ) {
        return `${gigabytes.toFixed(2)} GB`;
    }

    const megabytes =
        value /
        1024 /
        1024;

    return `${megabytes.toFixed(0)} MB`;
}


function formatMemoryUsage(
    used:
        | number
        | null,

    total:
        | number
        | null,
): string {
    if (
        used === null ||
        total === null ||
        total === 0
    ) {
        return "Нет данных";
    }

    const percentage =
        used /
        total *
        100;

    return `${percentage.toFixed(1)}%`;
}


function formatUptime(
    seconds:
        | number
        | null,
): string {
    if (
        seconds === null
    ) {
        return "Нет данных";
    }

    const days =
        Math.floor(
            seconds / 86400,
        );

    const hours =
        Math.floor(
            (
                seconds % 86400
            ) / 3600,
        );

    const minutes =
        Math.floor(
            (
                seconds % 3600
            ) / 60,
        );


    if (
        days > 0
    ) {
        return `${days} д. ${hours} ч.`;
    }

    if (
        hours > 0
    ) {
        return `${hours} ч. ${minutes} мин.`;
    }

    return `${minutes} мин.`;
}

interface NodeConnectionSettingsProps {
    node: VpnNode;
}

function NodeConnectionSettings({
                                    node,
                                }: NodeConnectionSettingsProps) {
    const [isOpen, setIsOpen] =
        useState(false);

    const [host, setHost] =
        useState(node.host);

    const [port, setPort] =
        useState(String(node.port));

    const [sshPort, setSshPort] =
        useState(String(node.ssh_port));

    const [sshUser, setSshUser] =
        useState(node.ssh_user);

    const [updateVpnNodeField, { isLoading: isSaving }] =
        useUpdateVpnNodeFieldMutation();

    const handleOpen = () => {
        setHost(node.host);
        setPort(String(node.port));
        setSshPort(String(node.ssh_port));
        setSshUser(node.ssh_user);
        setInboundTag(node.inbound_tag);

        setIsOpen(true);
    };

    const handleSave = async () => {
            await updateVpnNodeField({ nodeId: node.id, field: "host", value: host }).unwrap();

            await updateVpnNodeField({ nodeId: node.id, field: "port", value: Number(port) }).unwrap();

            await updateVpnNodeField({ nodeId: node.id, field: "ssh_port", value: Number(sshPort) }).unwrap();

            await updateVpnNodeField({ nodeId: node.id, field: "ssh_user", value: sshUser }).unwrap();

            await updateVpnNodeField({ nodeId: node.id, field: "inbound_tag", value: inboundTag }).unwrap();

            
            setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="w-full text-left"
                onClick={handleOpen}
            >
                <Card>
                    <CardContent>
                        <CardTitle>
                            Подключение
                        </CardTitle>

                        <div className="mt-5 space-y-4">
                            <DetailsRow
                                label="Host"
                                value={node.host}
                                monospace
                            />

                            <DetailsRow
                                label="Port"
                                value={node.port}
                            />

                            <DetailsRow
                                label="SSH port"
                                value={node.ssh_port}
                            />

                            <DetailsRow
                                label="SSH user"
                                value={node.ssh_user}
                                monospace
                            />

                            <DetailsRow
                                label="Inbound tag"
                                value={node.inbound_tag}
                                monospace
                            />
                        </div>
                    </CardContent>
                </Card>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                title="Настройки подключения"
            >
                <div className="space-y-4">
                    <Input
                        label="Host"
                        value={host}
                        onChange={(event) => {
                            setHost(event.target.value);
                        }}
                    />

                    <Input
                        label="Port"
                        value={port}
                        onChange={(event) => {
                            setPort(event.target.value);
                        }}
                    />

                    <Input
                        label="SSH port"
                        value={sshPort}
                        onChange={(event) => {
                            setSshPort(event.target.value);
                        }}
                    />

                    <Input
                        label="SSH user"
                        value={sshUser}
                        onChange={(event) => {
                            setSshUser(event.target.value);
                        }}
                    />

                    <Input
                        label="Inbound tag"
                        value={inboundTag}
                        onChange={(event) => {
                            setInboundTag(
                                event.target.value,
                            );
                        }}
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Отмена
                        </Button>

                        <Button
                            disabled={isSaving}
                            onClick={handleSave}
                        >
                            {isSaving
                                ? "Сохранение..."
                                : "Сохранить"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

interface NodeRealitySettingsProps {
    node: VpnNode;
}

function NodeRealitySettings({
                                 node,
                             }: NodeRealitySettingsProps) {
    const [isOpen, setIsOpen] =
        useState(false);

    const [serverName, setServerName] =
        useState(node.reality_server_name ?? "");

    const [publicKey, setPublicKey] =
        useState(node.reality_public_key ?? "");

    const [shortId, setShortId] =
        useState(node.reality_short_id ?? "");

    const [updateVpnNodeField, { isLoading: isSaving }] =
        useUpdateVpnNodeFieldMutation();

    const handleOpen = () => {
        setServerName(
            node.reality_server_name ?? "",
        );

        setPublicKey(
            node.reality_public_key ?? "",
        );

        setShortId(
            node.reality_short_id ?? "",
        );

        setIsOpen(true);
    };

    const handleSave = async () => {
            await updateVpnNodeField({ nodeId: node.id, field: "reality_server_name", value: serverName }).unwrap();

            await updateVpnNodeField({ nodeId: node.id, field: "reality_public_key", value: publicKey }).unwrap();

            await updateVpnNodeField({ nodeId: node.id, field: "reality_short_id", value: shortId }).unwrap();

            
            setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="w-full text-left"
                onClick={handleOpen}
            >
                <Card>
                    <CardContent>
                        <CardTitle>
                            Reality
                        </CardTitle>

                        <div className="mt-5 space-y-4">
                            <DetailsRow
                                label="Server name"
                                value={
                                    node.reality_server_name ||
                                    "Не настроено"
                                }
                                monospace
                            />

                            <DetailsRow
                                label="Public key"
                                value={
                                    node.reality_public_key ||
                                    "Не настроено"
                                }
                                monospace
                            />

                            <DetailsRow
                                label="Short ID"
                                value={
                                    node.reality_short_id ||
                                    "Не настроено"
                                }
                                monospace
                            />

                            <div className="mb-3 text-sm text-slate-500">
                                Агент: {node.install_status}
                            </div>

                            <div className="mt-5 border-t border-slate-200 pt-5">
                                <InstallAgentButton node={node} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                title="Настройки Reality"
            >
                <div className="space-y-4">
                    <Input
                        label="Server name"
                        value={serverName}
                        onChange={(event) => {
                            setServerName(
                                event.target.value,
                            );
                        }}
                    />

                    <Input
                        label="Public key"
                        value={publicKey}
                        onChange={(event) => {
                            setPublicKey(
                                event.target.value,
                            );
                        }}
                    />

                    <Input
                        label="Short ID"
                        value={shortId}
                        onChange={(event) => {
                            setShortId(
                                event.target.value,
                            );
                        }}
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Отмена
                        </Button>

                        <Button
                            disabled={isSaving}
                            onClick={handleSave}
                        >
                            {isSaving
                                ? "Сохранение..."
                                : "Сохранить"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

interface InstallAgentButtonProps {
    node: VpnNode;
}

function InstallAgentButton({
                                node,
                            }: InstallAgentButtonProps) {
    const [isOpen, setIsOpen] =
        useState(false);

    const [installAgent, { isLoading: isInstalling }] =
        useInstallVpnNodeAgentMutation();

    const [error, setError] =
        useState<string | null>(null);

    const handleOpen = () => {
        setSshPassword("");
        setError(null);
        setIsOpen(true);
    };

    const handleInstall = async () => {
        if (!sshPassword) {
            setError(
                "Введите SSH пароль",
            );

            return;
        }

        setError(null);
        try {
            await installAgent({
                nodeId: node.id,
                sshPassword,
            }).unwrap();

            setSshPassword("");
            setIsOpen(false);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Не удалось установить агент",
            );

        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
            >
                Установить агент
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => {
                    if (!isInstalling) {
                        setIsOpen(false);
                    }
                }}
                title="Установка агента"
            >
                <div className="space-y-5">

                    <div className="rounded-lg bg-slate-50 p-4 text-sm">
                        <div>
                            <b>Host:</b>{" "}
                            {node.host}
                        </div>

                        <div>
                            <b>SSH:</b>{" "}
                            {node.ssh_user}
                            @
                            {node.host}
                            :
                            {node.ssh_port}
                        </div>
                    </div>

                    <Input
                        label="SSH пароль"
                        type="password"
                        value={sshPassword}
                        disabled={isInstalling}
                        onChange={(event) => {
                            setSshPassword(
                                event.target.value,
                            );
                        }}
                        placeholder="Введите пароль root"
                    />

                    {error && (
                        <div
                            className="
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-700
                            "
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            disabled={isInstalling}
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Отмена
                        </Button>

                        <Button
                            disabled={
                                isInstalling ||
                                !sshPassword
                            }
                            onClick={handleInstall}
                        >
                            {isInstalling
                                ? "Установка..."
                                : "Установить"}
                        </Button>
                    </div>

                </div>
            </Modal>
        </>
    );
}


export default NodeDetailsContent;