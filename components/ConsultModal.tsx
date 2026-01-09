"use client"

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setFalse } from "@/store/slices/modelVisibility";
import { generatePunctuation } from "@/actions/generatePunctuation";

interface Props {
    isVisible: boolean;
}

export default function ConsultModal({ isVisible }: Props) {
    const dispatch = useDispatch();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const close = useCallback(() => dispatch(setFalse()), [dispatch]);

    const [text, setText] = useState("");
    const [listening, setListening] = useState(false);
    const listeningRef = useRef<boolean>(false);
    const [supported, setSupported] = useState(true);
    const recognitionRef = useRef<any | null>(null);
    const baseTranscriptRef = useRef<string>("");
    const punctuationGeneratedRef = useRef<boolean>(false);
    const [isGeneratingPunctuation, setIsGeneratingPunctuation] = useState(false);
    const [punctuationError, setPunctuationError] = useState("");

    const toggleListening = useCallback(() => {
        if (!supported) return;
        setListening((s) => !s);
    }, [supported]);

    useEffect(() => {
        listeningRef.current = listening;
    }, [listening]);

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

    // Initialize SpeechRecognition and attach handlers
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSupported(false);
            return;
        }

        const recog: any = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (e: any) => {
            let interim = "";
            for (let i = e.resultIndex; i < e.results.length; ++i) {
                const transcript = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    baseTranscriptRef.current += transcript;
                } else {
                    interim += transcript;
                }
            }
            setText(baseTranscriptRef.current + interim);
        };

        recog.onerror = (err: any) => {
            console.error("Speech recognition error", err);
            setListening(false);
        };

        recog.onend = () => {
            // If user hasn't stopped listening, restart to keep transcribing
            if (listeningRef.current) {
                try {
                    recog.start();
                } catch (e) {
                    // ignore start errors
                }
            }
        };

        recognitionRef.current = recog;

        return () => {
            recog.onresult = null;
            recog.onerror = null;
            recog.onend = null;
            try {
                recog.stop();
            } catch {}
            recognitionRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!supported) return;
        const recog = recognitionRef.current;
        if (!recog) return;

        if (listening) {
            // Reset the flag when starting to listen
            punctuationGeneratedRef.current = false;
            try {
                recog.start();
            } catch (e) {
                console.warn("Failed to start speech recognition", e);
            }
        } else {
            try {
                recog.stop();
            } catch {}
            
            // Generate punctuation only once when listening stops
            if (text.trim() && !punctuationGeneratedRef.current) {
                punctuationGeneratedRef.current = true;
                generatePunctuationFromText(text);
            }
        }
    }, [listening, supported]);

    const generatePunctuationFromText = async (textToSummarize: string) => {
        setIsGeneratingPunctuation(true);
        setPunctuationError("");
        try {
            const result = await generatePunctuation(textToSummarize);
            if (result.success) {
                setText(result.text || '');
                baseTranscriptRef.current = result.text || '';
            } else {
                const errorMsg = result.error || "Unknown error occurred";
                console.error("Failed to generate punctuation:", errorMsg);
                setPunctuationError(errorMsg);
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            console.error("Error generating punctuation:", errorMsg);
            setPunctuationError(errorMsg);
        } finally {
            setIsGeneratingPunctuation(false);
        }
    };

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
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                {/* Heartbeat / pulse icon */}
                                <path d="M22 12h-4l-3 8-4-16-3 8H2" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-tech-900">Describe your symptoms</h2>
                            <p className="text-sm text-gray-500">You can type or use voice to describe what's bothering you.</p>
                        </div>
                    </div>
                </div>

                {/* Close button moved to top-right */}
                <button
                    aria-label="Close modal"
                    onClick={close}
                    className="absolute right-3 top-3 rounded-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                    ✕
                </button>


                <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="w-full">
                        <div className="relative rounded-md">
                            <textarea
                                ref={textareaRef}
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    baseTranscriptRef.current = e.target.value;
                                }}
                                placeholder="Describe your symptoms, duration, and any other details..."
                                className="w-full min-h-[160px] max-h-80 resize-none rounded-md border border-gray-200 p-4 text-sm text-gray-800 focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm"
                            />

                            <div className="absolute right-3 bottom-3 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    aria-pressed={listening}
                                    aria-label={listening ? "Stop listening" : "Start voice input"}
                                    className={`mic-btn ${listening ? "listening" : ""} flex items-center justify-center rounded-full p-2 transition-transform focus:outline-none`}
                                >
                                    {listening ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                                            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
                                            <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                                            <path d="M12 1v11" />
                                            <path d="M19 11a7 7 0 0 1-14 0" />
                                            <path d="M12 17v4" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {listening && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-brand-600">
                                <span className="font-medium">🎙️ Listening…</span>
                                <span className="text-gray-400">Click the mic to stop.</span>
                            </div>
                        )}

                        {!supported && (
                            <p className="mt-2 text-xs text-red-500">Voice input not supported in this browser.</p>
                        )}

                        {isGeneratingPunctuation && (
                            <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                AI Formating...
                            </div>
                        )}

                        {punctuationError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                Failed to generate punctuation
                            </div>
                        )}

                        <div aria-live="polite" className="sr-only">{listening ? 'Listening' : 'Not listening'}{isGeneratingPunctuation ? ' Generating punctuation' : ''}</div>

                        <p className="mt-3 text-xs text-gray-400">Tip: Be as specific as possible — mention duration, intensity, and any prior conditions.</p>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={close}
                            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-md bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow hover:from-brand-700"
                        >
                            Analyze
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}