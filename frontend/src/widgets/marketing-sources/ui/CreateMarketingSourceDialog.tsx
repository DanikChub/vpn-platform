import { useState } from "react";
import { useCreateMarketingSourceMutation, type MarketingSourceType } from "@/entities/marketing-source";
import { Button, Input, Modal } from "@/shared/ui";

const types: { value: MarketingSourceType; label: string }[] = [
    { value: "telegram", label: "Telegram" },
    { value: "tiktok", label: "TikTok" },
    { value: "blogger", label: "Блогер" },
    { value: "friend", label: "Друг" },
    { value: "other", label: "Другое" },
];

const CreateMarketingSourceDialog = () => {
    const [trialDays, setTrialDays] = useState(0);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [type, setType] = useState<MarketingSourceType>("telegram");
    const [createSource, { isLoading, isError, reset: resetMutation }] = useCreateMarketingSourceMutation();

    const reset = () => {
        setName("");
        setCode("");
        setType("telegram");
        setTrialDays(0);
        resetMutation();
    };

    const create = async () => {
        try {
            await createSource({
                name,
                code,
                type,
                trial_days: trialDays,
            }).unwrap();
            setOpen(false);
            reset();
        } catch {
            // RTK Query keeps the mutation error state.
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Создать источник</Button>
            <Modal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    reset();
                }}
                title="Создание источника"
            >
                <div className="space-y-4">
                    <Input label="Название" placeholder="Telegram канал Иван" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="Код" placeholder="tg_ivan_august" value={code} onChange={(e) => setCode(e.target.value)} />
                    <div>
                        <label className="text-sm">Тип</label>
                        <select className="mt-1 w-full rounded-md border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as MarketingSourceType)}>
                            {types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                    </div>
                    <Input
                        label="Тестовый период, дней"
                        type="number"
                        min={0}
                        max={365}
                        value={trialDays}
                        onChange={(event) => {
                            const value = Number(event.target.value);

                            setTrialDays(
                                Number.isNaN(value)
                                    ? 0
                                    : value
                            );
                        }}
                    />
                    {isError && <div className="text-sm text-red-600">Не удалось создать источник</div>}
                    <Button
                        disabled={
                            isLoading ||
                            !name ||
                            !code ||
                            !Number.isInteger(trialDays) ||
                            trialDays < 0 ||
                            trialDays > 365
                        }
                        onClick={create}
                    >
                        {isLoading ? "Создание..." : "Создать"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CreateMarketingSourceDialog;
