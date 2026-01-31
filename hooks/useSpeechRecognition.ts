"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SpeechRecognitionHook {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    hasRecognitionSupport: boolean;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);

    const recognitionRef = useRef<any>(null); // Type 'any' because SpeechRecognition is not standard TS yet
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const SILENCE_TIMEOUT = 2000; // Stop after 2 seconds of silence

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setHasRecognitionSupport(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";
            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
            setHasRecognitionSupport(false);
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore errors on cleanup
                }
            }
        };
    }, []);

    const stopListeningInternal = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Already stopped
            }
        }
        setIsListening(false);

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    }, []);

    const startListening = useCallback(() => {
        if (!hasRecognitionSupport || !recognitionRef.current || isListening) return;

        try {
            // Reset state
            setInterimTranscript("");

            // Set up event handlers
            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                // Don't stop immediately on 'no-speech' error, but others might require restart
                if (event.error !== 'no-speech') {
                    setIsListening(false);
                }
            };

            recognitionRef.current.onend = () => {
                // If we didn't explicitly stop (isListening is true), it might have stopped due to silence or error
                // In continuous mode, it generally keeps going, but we can manage state here.
                // However, the native API might stop automatically.
                // We'll trust the 'onstart'/'onend' to reflect reality, BUT:
                // If we want it to truly be "continuous" like a session:
                // We might need to restart it if it wasn't manually stopped. 
                // For now, let's treat onend as "paused" or "stopped".
                if (isListening) {
                    setIsListening(false);
                }
            };

            recognitionRef.current.onresult = (event: any) => {
                let finalTrans = "";
                let interimTrans = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTrans += event.results[i][0].transcript;
                    } else {
                        interimTrans += event.results[i][0].transcript;
                    }
                }

                if (finalTrans) {
                    setTranscript((prev) => {
                        const newTranscript = prev + (prev ? " " : "") + finalTrans;
                        return newTranscript;
                    });

                    // Reset silence timer
                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = setTimeout(() => {
                        stopListeningInternal();
                    }, SILENCE_TIMEOUT);
                }

                setInterimTranscript(interimTrans);
            };

            recognitionRef.current.start();
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            setIsListening(false);
        }
    }, [hasRecognitionSupport, isListening, stopListeningInternal, SILENCE_TIMEOUT]);

    const stopListening = useCallback(() => {
        stopListeningInternal();
    }, [stopListeningInternal]);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        hasRecognitionSupport,
    };
};
