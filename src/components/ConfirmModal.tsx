import { Dialog } from '@headlessui/react';

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    onConfirm?: () => void
    confirmText?: string
    cancelText?: string
    showCancelButton?: boolean
}

export default function ConfirmModal({
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancelButton = true
}: ModalProps) {
    return (
        <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[#292929] p-6 shadow-xl">
                <div className="flex justify-between items-start">
                    <Dialog.Title className="text-lg font-semibold text-gray-white">{title}</Dialog.Title>
                    <button onClick={onClose} className="text-xl p-1 hover:bg-[#222] text-gray-400 hover:text-coral transition cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l8 8M6 14L14 6" />
                        </svg>
                    </button>
                </div>
                
                {description && <p className="mt-2 text-sm text-gray-300">{description}</p>}

                <div className="mt-6 flex justify-end gap-2">
                    {showCancelButton && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-[#222] text-gray-300 hover:bg-[#1b1b1b] transition cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    )}
                    {onConfirm && (
                    <button
                        onClick={() => {
                        onConfirm()
                        onClose()
                        }}
                        className="px-4 py-2 rounded-md bg-coral text-white hover:bg-coral-darker transition cursor-pointer"
                    >
                        {confirmText}
                    </button>
                    )}
                </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}