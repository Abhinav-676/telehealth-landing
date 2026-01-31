"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER,
});

const MODEL_NAME = "google/gemini-2.0-flash-exp:free";

export interface Question {
    id: string;
    text: string;
    field: string;
}

export async function generateFollowUpQuestions(consultationData: Record<string, string>): Promise<Question[]> {
    try {
        const dataString = Object.entries(consultationData)
            .map(([key, value]) => `- ${key}: "${value}"`)
            .join("\n");

        const prompt = `
        You are a medical intake assistant.
        The patient has provided the following information so far:
        ${dataString}

        Based on this information (especially the Symptoms, Severity, and Duration), generate up to 4 relevant follow-up questions to gather more clinical context.
        
        Focus on:
        - Specific nature of the symptoms (e.g. sharp vs dull pain)
        - Triggers or relieving factors
        - Associated symptoms
        - Clarifying any ambiguous previous answers
        
        Output strictly a JSON array of objects with the following structure:
        [
            { "id": "q_unique_id", "text": "Question text here", "field": "Short Label for Report" }
        ]

        Do not duplicate questions that have effectively already been asked/answered in the data above.
        Do not include any markdown formatting or explanations. Just the JSON array.
        `;

        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: "You are a JSON-only API. Output ONLY valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });

        const content = completion.choices[0].message.content;
        if (!content) return [];

        // Parse JSON
        // Sometimes models wrap in ```json ... ``` despite instructions, so clean it
        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

        // Handle "questions" key if the model wraps the array in an object
        let parsed = JSON.parse(cleanContent);
        if (!Array.isArray(parsed) && parsed.questions && Array.isArray(parsed.questions)) {
            parsed = parsed.questions;
        }

        if (Array.isArray(parsed)) {
            return parsed.map((q: any, i: number) => ({
                id: q.id || `follow_up_${Date.now()}_${i}`,
                text: q.text,
                field: q.field || `Follow-up ${i + 1}`
            })).slice(0, 4); // Ensure max 4
        }

        return [];

    } catch (error) {
        console.error("Error generating follow-up questions:", error);
        return []; // Fail gracefully with no extra questions
    }
}
