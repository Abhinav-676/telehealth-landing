"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface Message {
    id: string;
    sender: "ai" | "user";
    text: string;
    timestamp: Date;
}

import { generateFollowUpQuestions, Question } from "@/actions/generateFollowUpQuestions";
import { generateReportRecommendations, ReportRecommendations } from "@/actions/generateReportRecommendations";
import { validateAnswer } from "@/actions/validateAnswer";

const INITIAL_QUESTIONS: Question[] = [
    {
        id: "name",
        text: "Hello! I'm Dr. Sarah. To get started, could you please tell me your full name?",
        field: "Name",
    },
    { id: "age", text: "Thank you. And how old are you?", field: "Age" },
    {
        id: "symptoms",
        text: "What are the main symptoms you are experiencing today?",
        field: "Symptoms",
    },
    {
        id: "duration",
        text: "How long have you been experiencing these symptoms?",
        field: "Duration",
    },
    {
        id: "severity",
        text: "On a scale of 1 to 10, how severe would you rate your discomfort?",
        field: "Severity",
    },
    {
        id: "medications",
        text: "Are you currently taking any medications?",
        field: "Current Medications",
    },
    {
        id: "allergies",
        text: "Do you have any known allergies?",
        field: "Allergies",
    },
];

export default function ConsultationPage() {
    // -------------------------------------------------------------------------
    // Hooks
    // -------------------------------------------------------------------------
    const {
        isListening,
        transcript,
        interimTranscript,
        startListening: startSpeechVal,
        stopListening: stopSpeechVal,
        resetTranscript,
        hasRecognitionSupport,
    } = useSpeechRecognition();

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    const [messages, setMessages] = useState<Message[]>([]);
    const [callStatus, setCallStatus] = useState<
        "idle" | "connecting" | "active" | "ended"
    >("idle");
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasMicAccess, setHasMicAccess] = useState<boolean | null>(null);

    // Consultation Logic
    const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [consultationData, setConsultationData] = useState<
        Record<string, string>
    >({});
    const [recommendations, setRecommendations] = useState<ReportRecommendations | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const processedTranscriptRef = useRef<string>("");

    // -------------------------------------------------------------------------
    // Effects
    // -------------------------------------------------------------------------

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle Mic Access Check
    const checkMicAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasMicAccess(true);
            return true;
        } catch (error) {
            console.error("Mic access denied:", error);
            setHasMicAccess(false);
            return false;
        }

    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log("Unmounting consultation page");
            stopSpeechVal();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, []);

    // -------------------------------------------------------------------------
    // Control Helper Functions
    // -------------------------------------------------------------------------

    const addMessage = (sender: "ai" | "user", text: string) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Math.random().toString(36).slice(2, 9),
                sender,
                text,
                timestamp: new Date(),
            },
        ]);
    };

    const startConsultation = async () => {
        setCallStatus("connecting");
        const hasAccess = await checkMicAccess();

        if (!hasAccess) {
            setCallStatus("idle");
            addMessage(
                "ai",
                "I need microphone access to proceed. Please enable permissions."
            );
            return;
        }

        setCallStatus("active");

        // Start the flow
        const firstQ = questions[0];
        addMessage("ai", firstQ.text);

        // Speak initial question if TTS is available (optional integration point)
        // speak(firstQ.text);

        // Start listening after showing the first question
        resetTranscript();
        processedTranscriptRef.current = "";
        startSpeechVal();
    };

    const handleAnswer = async (answerText: string) => {
        if (!answerText.trim()) return;
        setIsProcessing(true);

        const currentQ = questions[currentQuestionIndex];

        // 1. Validate Answer
        const validation = await validateAnswer(currentQ.text, answerText);

        if (!validation.isValid) {
            addMessage("ai", validation.feedback || "I didn't quite catch that. Could you please repeat?");
            // Small delay before listening again
            resetTranscript();
            processedTranscriptRef.current = "";
            setTimeout(() => {
                startSpeechVal();
                setIsProcessing(false);
            }, 1000);
            return;
        }

        // 2. Valid Answer - Process it
        addMessage("user", answerText);
        const newData = { ...consultationData, [currentQ.field]: answerText };
        setConsultationData(newData);

        // 3. Generate Follow-up Questions (Trigger after severity)
        let updatedQuestions = [...questions];
        let nextIndex = currentQuestionIndex + 1;

        if (currentQ.id === "severity") {
            try {
                const followUps = await generateFollowUpQuestions(newData);
                if (followUps.length > 0) {
                    updatedQuestions.splice(nextIndex, 0, ...followUps);
                    setQuestions(updatedQuestions);
                }
            } catch (e) {
                console.error("Error generating follow-ups:", e);
            }
        }

        // 4. Move to Next Question
        if (nextIndex < updatedQuestions.length) {
            setCurrentQuestionIndex(nextIndex);
            const nextQ = updatedQuestions[nextIndex];
            addMessage("ai", nextQ.text);

            resetTranscript();
            processedTranscriptRef.current = "";
            setIsProcessing(false);

            // Wait a bit for user to read/hear before listening
            setTimeout(() => {
                startSpeechVal();
            }, 1000);
        } else {
            // End of questions
            await finishConsultation(newData);
        }
    };

    // Watch for listening to stop to process answer
    useEffect(() => {
        if (!isListening && transcript && callStatus === "active" && !isProcessing) {
            const cleanedTranscript = transcript.trim();
            if (cleanedTranscript && cleanedTranscript !== processedTranscriptRef.current) {
                processedTranscriptRef.current = cleanedTranscript;
                handleAnswer(cleanedTranscript);
            }
        }
    }, [isListening, transcript, callStatus, isProcessing]);

    const handleEndCall = () => {
        setCallStatus("ended");
        stopSpeechVal();
        console.log("Ending call at 190")
        addMessage("ai", "Session ended manually.");
    };

    const finishConsultation = async (finalData?: Record<string, string>) => {
        setIsProcessing(true); // Indicate processing
        addMessage("ai", "Thank you. I have gathered all the necessary information. Please wait a moment while I generate your consultation report...");

        const dataToUse = finalData || consultationData;

        try {
            // Fetch recommendations
            const recs = await generateReportRecommendations(dataToUse);
            setRecommendations(recs);
        } catch (error) {
            console.error("Failed to generate recommendations:", error);
        }

        setCallStatus("ended");
        stopSpeechVal();
        setIsProcessing(false);

        const farewell =
            "Your consultation report is ready. It includes a summary of your symptoms, potential doctor visit recommendations, and precautionary measures.";
        addMessage("ai", farewell);
    };

    const toggleMic = () => {
        if (isListening) {
            stopSpeechVal();
        } else {
            startSpeechVal();
        }
    };


    // -------------------------------------------------------------------------
    // PDF Generation
    // -------------------------------------------------------------------------
    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("Medical Consultation Report", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Consultant: Dr. Sarah (AI)`, 20, 36);

        // Content Table
        const tableData = Object.entries(consultationData).map(([key, value]) => [
            key,
            value,
        ]);

        autoTable(doc, {
            startY: 50,
            head: [["Field", "Patient Response"]],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [66, 133, 244] },
            styles: { fontSize: 11 },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 50 },
                1: { cellWidth: "auto" },
            },
        });

        // Recommendations Section
        if (recommendations) {
            const afterTableY = (doc as any).lastAutoTable.finalY + 15;

            doc.setFontSize(14);
            doc.setTextColor(40, 40, 40);
            doc.text("Clinical Recommendations", 20, afterTableY);

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(`Recommended Specialist: ${recommendations.recommendedDoctor}`, 20, afterTableY + 10);

            doc.setFont("helvetica", "normal");
            doc.text("Precautionary Measures:", 20, afterTableY + 20);

            const precautions = recommendations.precautions.map(p => `• ${p}`);
            doc.text(precautions, 25, afterTableY + 28);
        }

        // Disclaimer
        const finalY = (doc as any).lastAutoTable.finalY + (recommendations ? 60 : 20); // Adjust space based on added content
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
            "Disclaimer: This report is generated by an AI assistant and does not constitute an official medical diagnosis. Please consult a human doctor for critical concerns.",
            20,
            finalY + 20,
            { maxWidth: 170 }
        );

        doc.save("consultation_report.pdf");
    };

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden text-white font-sans selection:bg-brand-500/30">
            {/* Main Area */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-10">
                {/* The "Call Window" */}
                <div className="relative w-full max-w-5xl aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 ring-1 ring-white/10 flex flex-col group">
                    {/* Header/Status Bar */}
                    <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 via-black/30 to-transparent">
                        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                            {callStatus === "active" && (
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                            <span className="text-sm font-medium tracking-wide text-gray-200">
                                {callStatus === "active"
                                    ? "LIVE CONSULTATION"
                                    : callStatus === "ended"
                                        ? "SESSION COMPLETED"
                                        : "READY TO START"}
                            </span>
                        </div>

                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${hasMicAccess
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                }`}
                        >
                            <i
                                className={`fa-solid ${hasMicAccess ? "fa-microphone" : "fa-microphone-slash"
                                    }`}
                            ></i>
                            {hasMicAccess ? "Mic Active" : "Mic Blocked"}
                        </div>
                    </div>

                    {/* Main Content Area (Video/AI Avatar) */}
                    <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                        {/* Background Image simulating video feed */}
                        <div
                            className={`absolute inset-0 transition-all duration-700 ${callStatus === "ended"
                                ? "grayscale opacity-30 blur-sm"
                                : "opacity-100"
                                }`}
                        >
                            <Image
                                src="/ai-doctor.png"
                                alt="AI Doctor"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-black/20"></div>
                        </div>

                        {/* User Listening Indicator */}
                        {isListening && callStatus === "active" && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white animate-pulse shadow-xl">
                                        <i className="fa-solid fa-microphone text-2xl"></i>
                                    </div>
                                    <span className="text-white/80 font-medium tracking-wider text-sm bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                        Listening...
                                    </span>
                                </div>
                            </div>
                        )}

                        {callStatus === "idle" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm">
                                <div className="p-8 text-center max-w-md">
                                    <div className="w-20 h-20 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/40 animate-pulse">
                                        <i className="fa-solid fa-microphone text-3xl text-brand-400"></i>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-3">
                                        AI Consultation
                                    </h2>
                                    <p className="text-gray-300 mb-8 text-lg">
                                        Dr. Sarah will ask you a series of questions to generate a
                                        preliminary health report.
                                    </p>
                                    <button
                                        onClick={startConsultation}
                                        className="group relative inline-flex items-center justify-center gap-3 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand-600/20 hover:bg-brand-500 transition-all duration-300 hover:scale-105"
                                    >
                                        Start Consultation
                                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {callStatus === "connecting" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-md">
                                <div className="animate-spin w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full mb-4"></div>
                                <p className="text-white font-medium">
                                    Connecting to secure server...
                                </p>
                            </div>
                        )}

                        {callStatus === "ended" && (
                            <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 text-center max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <i className="fa-solid fa-file-pdf text-2xl text-green-400"></i>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Report Ready
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    We have compiled your consultation details into a PDF report.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={generatePDF}
                                        className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-500 transition duration-200 w-full shadow-lg shadow-brand-500/20"
                                    >
                                        <i className="fa-solid fa-download"></i>
                                        Download Report
                                    </button>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center gap-2 bg-white/5 text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition duration-200 w-full"
                                    >
                                        Return Home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex justify-center items-end bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                        {callStatus === "active" && (
                            <div className="flex items-center gap-4 p-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-transform hover:scale-105 duration-300">
                                <button
                                    onClick={toggleMic}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isListening
                                        ? "bg-brand-600 text-white hover:bg-brand-500"
                                        : "bg-gray-800 hover:bg-gray-700 text-white"
                                        }`}
                                >
                                    <i
                                        className={`fa-solid ${isListening ? "fa-microphone" : "fa-microphone-slash"
                                            }`}
                                    ></i>
                                </button>

                                <button
                                    onClick={handleEndCall}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 flex items-center gap-2 group"
                                >
                                    <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white transition-colors"></span>
                                    End Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar - Transcript */}
            <div className="w-[800px] h-full bg-white border-l border-gray-200 flex flex-col shadow-2xl relative z-30">
                <div className="p-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="font-bold text-gray-900 text-lg">
                            Live Transcript
                        </h2>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-200/50 px-2 py-1 rounded">
                            Real-time
                        </span>
                    </div>
                    {/* Progress Bar for Questions */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-500 transition-all duration-500 ease-out"
                                style={{
                                    width:
                                        callStatus === "ended"
                                            ? "100%"
                                            : `${(currentQuestionIndex / questions.length) * 100
                                            }%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-xs text-brand-600 font-medium">
                            {callStatus === "ended"
                                ? `${questions.length}/${questions.length}`
                                : `${currentQuestionIndex + 1}/${questions.length}`}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-8 border-2 border-dashed border-gray-100 rounded-2xl mx-4 mt-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <i className="fa-solid fa-wave-square text-blue-500"></i>
                            </div>
                            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                            <p className="text-gray-500 font-medium">Initializing...</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                                } group`}
                        >
                            <div className="flex items-end gap-2 max-w-[90%]">
                                {msg.sender === "ai" && (
                                    <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200 flex-shrink-0 flex items-center justify-center">
                                        <i className="fa-solid fa-user-doctor text-[10px] text-brand-600"></i>
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                        : "bg-gray-50 border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                            <span
                                className={`text-[10px] text-gray-300 mt-1.5 px-10 transition-opacity opacity-0 group-hover:opacity-100 ${msg.sender === "user" ? "text-right" : "text-left"
                                    }`}
                            >
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    ))}

                    {/* Live Transcript Bubble */}
                    {(interimTranscript || transcript) && (
                        <div className="flex flex-col items-end opacity-80">
                            <div className="max-w-[90%] rounded-2xl rounded-tr-sm p-3 text-sm bg-blue-50 text-blue-800 border-2 border-blue-100 border-dashed">
                                {transcript || interimTranscript}
                                <span className="animate-pulse ml-1">...</span>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">
                                {isListening ? "Listening..." : "Processing..."}
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Footer Status in Sidebar */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div
                        className={`w-full rounded-xl border flex items-center px-4 py-3 gap-3 transition-colors ${isListening
                            ? "bg-red-50/50 border-red-100"
                            : isProcessing
                                ? "bg-blue-50/50 border-blue-100"
                                : "bg-white border-gray-200"
                            }`}
                    >
                        <div className="relative flex h-2 w-2">
                            {(isListening || isProcessing) && (
                                <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isListening ? "bg-red-400" : "bg-blue-400"
                                        }`}
                                ></span>
                            )}
                            <span
                                className={`relative inline-flex rounded-full h-2 w-2 ${isListening
                                    ? "bg-red-500"
                                    : isProcessing
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                    }`}
                            ></span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                            {isListening
                                ? "Listening to you..."
                                : isProcessing
                                    ? "Validating response..."
                                    : callStatus === "ended"
                                        ? "Consultation Finished"
                                        : "Ready"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
