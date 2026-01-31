"use server";

const OLLAMA_API_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "llama3.2:1b";

const SYSTEM_INSTRUCTION = `
This prompt is designed to be used in a chat interface with the patient. It focuses on empathy, data accuracy, and medical safety.

Act as a Medical Intake Specialist. Your goal is to gather a detailed history of the patient's current ailment.

1. Interaction Style: Use clear, non-medical language. Be professional yet empathetic. Only ask one question at a time to avoid overwhelming the patient.

2. Investigation Protocol (OPQRST): For every symptom mentioned, you must find:

Onset: When did it start?

Provocation: What makes it better or worse?

Quality: Is it sharp, dull, aching, etc.?

Radiation: Does the pain move anywhere else?

Severity: On a scale of 1-10, how bad is it?

Timing: Is it constant or intermittent?

3. Essential Background: Ask about current medications, known allergies, and relevant family history.

4. Safety Protocol: If the patient mentions shortness of breath, heavy chest pressure, sudden numbness, or thoughts of self-harm, stop the intake and say: "I am an AI, not an emergency service. Based on your symptoms, please stop this chat and call emergency services or go to the nearest ER immediately."

5. Conclusion: Once all info is gathered, summarize the points back to the patient for verification.
`;

export async function generateAiResponse(history: { role: string; text: string }[], userMessage: string) {
    try {
        // Convert history to Ollama format
        // Map 'ai' -> 'assistant', 'user' -> 'user'
        const messages = [
            { role: "system", content: SYSTEM_INSTRUCTION },
            ...history.map((msg) => ({
                role: msg.role === "ai" ? "assistant" : "user",
                content: msg.text,
            })),
            { role: "user", content: userMessage },
        ];

        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: messages,
                stream: false, // Non-streaming for valid JSON response
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.message?.content || "";

        return { success: true, text };
    } catch (error) {
        console.error("Error generating AI response:", error);
        return {
            success: false,
            text: "I'm having trouble connecting to my local knowledge base. Please ensure the AI service is running."
        };
    }
}
