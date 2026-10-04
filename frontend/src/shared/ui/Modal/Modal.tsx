import * as Dialog from "@radix-ui/react-dialog";
import {
    type ReactNode,
} from "react";
import {
    X,
} from "lucide-react";

import {
    cn,
} from "@/shared/lib";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
    closeOnBackdrop?: boolean;
}


export function Modal({
                          isOpen,
                          onClose,
                          title,
                          description,
                          children,
                          footer,
                          className,
                          closeOnBackdrop = true,
                      }: ModalProps) {
    return (
        <Dialog.Root
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            open={isOpen}
        >
            <Dialog.Portal>
                <Dialog.Overlay
                    className="modal-overlay fixed inset-0 z-50 bg-slate-950/35"
                    onPointerDown={(event) => {
                        if (!closeOnBackdrop) {
                            event.preventDefault();
                        }
                    }}
                />

                <Dialog.Content
                    className={cn(
                        "modal-content fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl",
                        className
                    )}
                    onEscapeKeyDown={(event) => {
                        if (!closeOnBackdrop) {
                            event.preventDefault();
                        }
                    }}
                    onInteractOutside={(event) => {
                        if (!closeOnBackdrop) {
                            event.preventDefault();
                        }
                    }}
                >
                    {(title || description) && (
                        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
                            <div>
                                {title && (
                                    <Dialog.Title className="text-base font-semibold text-slate-950">
                                        {title}
                                    </Dialog.Title>
                                )}

                                {description && (
                                    <Dialog.Description className="mt-1 text-sm leading-5 text-slate-500">
                                        {description}
                                    </Dialog.Description>
                                )}
                            </div>

                            <Dialog.Close asChild>
                                <button
                                    aria-label="Закрыть"
                                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                    type="button"
                                >
                                    <X
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </button>
                            </Dialog.Close>
                        </div>
                    )}

                    {!title && (
                        <Dialog.Title className="sr-only">
                            Диалоговое окно
                        </Dialog.Title>
                    )}

                    {!description && (
                        <Dialog.Description className="sr-only">
                            Диалоговое окно
                        </Dialog.Description>
                    )}

                    <div className="max-h-[60vh] overflow-y-auto p-5">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
                            {footer}
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
