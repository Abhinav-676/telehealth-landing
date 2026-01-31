"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER,
});

const MODEL_NAME = "google/gemini-2.0-flash-exp:free";

interface ValidationResult {
    isValid: boolean;
    feedback?: string;
}

export async function validateAnswer(question: string, answer: string): Promise<ValidationResult> {
    try {
        const prompt = `
        You are a medical intake assistant validator.
        
        Context:
        The AI assistant asked the patient: "${question}"
        The patient answered: "${answer}"

        Task:
        Determine if the patient's answer is a valid and relevant response to the question.
        - Valid answers: Direct answers, relevant information, even if brief.
        - Invalid answers: Gibberish, silence placeholders (like "dots"), completely unrelated non-sequiturs, or clear refusals to answer without reason.
        
        Note: If the answer is just "no", "yes", "none", or simple numbers where appropriate, those ARE valid.
        
        Output strictly a JSON object:
        {
            "isValid": boolean,
            "feedback": "string (optional, only if invalid. A polite, short sentence asking the user to clarify or repeat. e.g. 'I didn't quite catch that, could you please repeat?')"
        }
        `;

        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: "You are a JSON-only API. Output ONLY valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
        });

        const content = completion.choices[0].message.content;
        if (!content) return { isValid: true }; // Default to true if AI fails to respond to avoid blocking

        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanContent);

        return {
            isValid: parsed.isValid,
            feedback: parsed.feedback
        };

    } catch (error) {
        console.error("Error validating answer:", error);
        return { isValid: true }; // Fail open (allow validation to pass if logic errors) to prevent getting stuck
    }
}
