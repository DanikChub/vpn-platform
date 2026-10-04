import {
    useState,
} from "react";

import {
    Save,
} from "lucide-react";

import type {
    CreatePlanPayload,
    Plan,
} from "@/entities/plan";

import {
    Button,
    Input,
    Modal,
} from "@/shared/ui";
import {toast} from "sonner";
import {getApiErrorMessage} from "@/shared/api";


interface PlanFormModalProps {
    isOpen: boolean;
    isLoading: boolean;

    plan:
        | Plan
        | null;

    onClose: () => void;

    onSubmit: (
        payload: CreatePlanPayload
    ) => Promise<void>;
}


interface PlanFormState {
    name: string;
    durationDays: string;
    priceRubles: string;
    currency: string;
    isActive: boolean;
}


interface PlanFormErrors {
    name?: string;
    durationDays?: string;
    priceRubles?: string;
    currency?: string;
}


const EMPTY_FORM: PlanFormState = {
    name: "",
    durationDays: "30",
    priceRubles: "299",
    currency: "RUB",
    isActive: true,
};

function getInitialForm(
    plan: Plan | null
): PlanFormState {
    if (!plan) {
        return {
            ...EMPTY_FORM,
        };
    }

    return {
        name:
        plan.name,

        durationDays:
            String(
                plan.durationDays
            ),

        priceRubles:
            String(
                plan.priceAmount / 100
            ),

        currency:
        plan.currency,

        isActive:
        plan.isActive,
    };
}

export function PlanFormModal({
                                  isOpen,
                                  isLoading,
                                  plan,
                                  onClose,
                                  onSubmit,
                              }: PlanFormModalProps) {
    const [
        form,
        setForm,
    ] =
        useState<PlanFormState>(
            () =>
                getInitialForm(plan)
        );

    const [
        errors,
        setErrors,
    ] =
        useState<PlanFormErrors>(
            {}
        );





    const updateField = <
        Key extends keyof PlanFormState
    >(
        key: Key,
        value: PlanFormState[Key]
    ): void => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setErrors((current) => ({
            ...current,
            [key]: undefined,
        }));
    };


    const handleSubmit =
        async (): Promise<void> => {
            const validation =
                validatePlanForm(
                    form
                );

            if (!validation.isValid) {
                setErrors(
                    validation.errors
                );

                return;
            }

            const durationDays =
                Number(
                    form.durationDays
                );

            const priceAmount =
                Math.round(
                    Number(
                        form.priceRubles
                    ) * 100
                );

            try {
                await onSubmit({
                    name:
                        form.name.trim(),

                    durationDays,

                    priceAmount,

                    currency:
                        form.currency
                            .trim()
                            .toUpperCase(),

                    isActive:
                    form.isActive,
                });

                toast.success(
                    plan
                        ? "Тариф обновлён"
                        : "Тариф создан"
                );

                onClose();
            } catch (error) {
                toast.error(
                    getApiErrorMessage(
                        error
                    )
                );
            }
        };


    return (
        <Modal
            closeOnBackdrop={
                !isLoading
            }
            description={
                plan
                    ? "Изменения применятся ко всем новым заказам. Старые заказы сохранят прежние параметры."
                    : "Создайте новый тариф, который можно будет показывать пользователям."
            }
            footer={
                <>
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="outline"
                    >
                        Отмена
                    </Button>

                    <Button
                        isLoading={isLoading}
                        leftIcon={
                            <Save className="size-4" />
                        }
                        onClick={() => {
                            void handleSubmit();
                        }}
                    >
                        {plan
                            ? "Сохранить"
                            : "Создать"}
                    </Button>
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
            title={
                plan
                    ? "Редактировать тариф"
                    : "Создать тариф"
            }
        >
            <div className="space-y-5">
                <Input
                    autoFocus
                    disabled={isLoading}
                    error={errors.name}
                    label="Название"
                    onChange={(event) => {
                        updateField(
                            "name",
                            event.target.value
                        );
                    }}
                    placeholder="Например, 30 дней"
                    value={form.name}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        disabled={isLoading}
                        error={
                            errors.durationDays
                        }
                        label="Срок, дней"
                        min={1}
                        onChange={(event) => {
                            updateField(
                                "durationDays",
                                event.target.value
                            );
                        }}
                        type="number"
                        value={
                            form.durationDays
                        }
                    />

                    <Input
                        disabled={isLoading}
                        error={
                            errors.priceRubles
                        }
                        hint="Цена указывается в рублях"
                        label="Цена, ₽"
                        min={0}
                        onChange={(event) => {
                            updateField(
                                "priceRubles",
                                event.target.value
                            );
                        }}
                        step="0.01"
                        type="number"
                        value={
                            form.priceRubles
                        }
                    />
                </div>

                <Input
                    disabled={isLoading}
                    error={
                        errors.currency
                    }
                    label="Валюта"
                    maxLength={3}
                    onChange={(event) => {
                        updateField(
                            "currency",
                            event.target.value
                                .toUpperCase()
                        );
                    }}
                    value={form.currency}
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                    <input
                        checked={
                            form.isActive
                        }
                        className="mt-1 size-4 rounded border-slate-300"
                        disabled={isLoading}
                        onChange={(event) => {
                            updateField(
                                "isActive",
                                event.target.checked
                            );
                        }}
                        type="checkbox"
                    />

                    <span>
                        <span className="block text-sm font-medium text-slate-950">
                            Активный тариф
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                            Активные тарифы доступны пользователям для покупки.
                        </span>
                    </span>
                </label>
            </div>
        </Modal>
    );
}


function validatePlanForm(
    form: PlanFormState
): {
    isValid: boolean;
    errors: PlanFormErrors;
} {
    const errors:
        PlanFormErrors = {};

    const name =
        form.name.trim();

    const durationDays =
        Number(
            form.durationDays
        );

    const priceRubles =
        Number(
            form.priceRubles
        );

    const currency =
        form.currency
            .trim()
            .toUpperCase();


    if (!name) {
        errors.name =
            "Укажите название тарифа";
    } else if (
        name.length > 100
    ) {
        errors.name =
            "Название не должно быть длиннее 100 символов";
    }

    if (
        !Number.isInteger(
            durationDays
        ) ||
        durationDays < 1 ||
        durationDays > 3650
    ) {
        errors.durationDays =
            "Укажите целое число от 1 до 3650";
    }

    if (
        !Number.isFinite(
            priceRubles
        ) ||
        priceRubles < 0
    ) {
        errors.priceRubles =
            "Цена не может быть отрицательной";
    }

    if (
        !/^[A-Z]{3}$/.test(
            currency
        )
    ) {
        errors.currency =
            "Используйте код из трёх букв, например RUB";
    }

    return {
        isValid:
            Object.keys(
                errors
            ).length === 0,

        errors,
    };
}