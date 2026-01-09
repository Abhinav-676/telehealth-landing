"use client"

import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setFalse } from "@/store/slices/modelVisibility";

interface Props {
    isVisible: boolean;
}

export default function ConsultModal({ isVisible }: Props) {
    const dispatch = useDispatch();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const close = useCallback(() => dispatch(setFalse()), [dispatch]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") close();
        }

        if (isVisible) {
            document.addEventListener("keydown", onKey);
            // focus textarea when modal opens
            setTimeout(() => textareaRef.current?.focus(), 0);
            // prevent body scroll while open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "auto";
        };
    }, [isVisible, close]);

    if (!isVisible) return null;

    return (
        <div
            aria-modal="true"
            role="dialog"
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={close}
            />

            <div className="relative z-10 w-full max-w-lg p-6 glass rounded-xl shadow-2xl">
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-tech-900">Please write your symptoms</h2>
                    <button
                        aria-label="Close modal"
                        onClick={close}
                        className="ml-4 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                        ✕
                    </button>
                </div>

                <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="w-full">
                        <textarea
                            ref={textareaRef}
                            placeholder="Describe your symptoms, duration, and any other details..."
                            className="w-full min-h-[160px] max-h-80 resize-none rounded-md border border-gray-200 p-3 text-sm text-gray-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={close}
                            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm hover:from-brand-700"
                        >
                            Analyse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}