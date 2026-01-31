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

    const socketRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hasSpokenRef = useRef<boolean>(false);

    // Silence timeout in milliseconds - stop listening after this duration of silence
    const SILENCE_TIMEOUT = 1500;

    useEffect(() => {
        // Check if browser supports required APIs
        setHasRecognitionSupport(
            typeof navigator !== "undefined" &&
            !!navigator.mediaDevices?.getUserMedia &&
            typeof WebSocket !== "undefined"
        );
    }, []);

    const stopListeningInternal = useCallback(() => {
        // Clear silence timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        // Stop MediaRecorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;

        // Close WebSocket
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.close();
        }
        socketRef.current = null;

        // Stop audio stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        streamRef.current = null;

        setIsListening(false);
        hasSpokenRef.current = false;
    }, []);

    const startListening = useCallback(async () => {
        if (isListening) return;

        // Clean up any existing resources from previous session
        // This prevents "Failed to execute 'start' on MediaRecorder" error
        if (mediaRecorderRef.current) {
            try {
                if (mediaRecorderRef.current.state !== "inactive") {
                    mediaRecorderRef.current.stop();
                }
            } catch (e) {
                // Ignore errors during cleanup
            }
            mediaRecorderRef.current = null;
        }

        if (socketRef.current) {
            try {
                if (socketRef.current.readyState === WebSocket.OPEN ||
                    socketRef.current.readyState === WebSocket.CONNECTING) {
                    socketRef.current.close();
                }
            } catch (e) {
                // Ignore errors during cleanup
            }
            socketRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        // Reset state
        hasSpokenRef.current = false;

        try {
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Connect to Deepgram WebSocket with utterance_end_ms for better end detection
            const socket = new WebSocket(
                `wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&interim_results=true&endpointing=300&utterance_end_ms=1000`,
                ["token", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || ""]
            );
            socketRef.current = socket;

            socket.onopen = () => {
                try {
                    setIsListening(true);

                    // Set up MediaRecorder to stream audio
                    const mediaRecorder = new MediaRecorder(stream, {
                        mimeType: "audio/webm;codecs=opus",
                    });
                    mediaRecorderRef.current = mediaRecorder;

                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
                            socket.send(event.data);
                        }
                    };

                    mediaRecorder.start(250); // Send audio chunks every 250ms
                } catch (error) {
                    console.error("Error initializing MediaRecorder:", error);
                    stopListeningInternal();
                }
            };

            socket.onmessage = (event) => {
                // Prevent ghost events from previous sockets
                if (socket !== socketRef.current) return;

                try {
                    const data = JSON.parse(event.data);

                    // Handle UtteranceEnd event - Deepgram detected end of speech
                    if (data.type === "UtteranceEnd") {
                        if (hasSpokenRef.current) {
                            // User has spoken and now stopped - trigger stop after a brief delay
                            silenceTimerRef.current = setTimeout(() => {
                                stopListeningInternal();
                            }, 500); // Short delay to catch any trailing words
                        }
                        return;
                    }

                    if (data.channel?.alternatives?.[0]?.transcript) {
                        const text = data.channel.alternatives[0].transcript;

                        // Clear any existing silence timer since we're getting speech
                        if (silenceTimerRef.current) {
                            clearTimeout(silenceTimerRef.current);
                            silenceTimerRef.current = null;
                        }

                        if (data.is_final && text.trim()) {
                            hasSpokenRef.current = true; // Mark that user has spoken something
                            setTranscript((prev) => prev + (prev ? " " : "") + text);
                            setInterimTranscript("");

                            // Start silence timer after receiving final transcript
                            // Stop if no more speech within SILENCE_TIMEOUT
                            if (data.speech_final) {
                                silenceTimerRef.current = setTimeout(() => {
                                    stopListeningInternal();
                                }, SILENCE_TIMEOUT);
                            }
                        } else if (!data.is_final) {
                            setInterimTranscript(text);
                        }
                    }
                } catch (e) {
                    console.error("Error parsing Deepgram message:", e);
                }
            };

            socket.onerror = (error) => {
                if (socket !== socketRef.current) return;
                console.error("Deepgram WebSocket error:", error);
                stopListeningInternal();
            };

            socket.onclose = () => {
                if (socket !== socketRef.current) return;
                setIsListening(false);
            };
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            setIsListening(false);
        }
    }, [isListening, stopListeningInternal]);

    const stopListening = useCallback(() => {
        stopListeningInternal();
    }, [stopListeningInternal]);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

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
