"use server";

import OpenAI from "openai";

const MODEL_NAME = "liquid/lfm-2.5-1.2b-thinking:free";

export interface ReportRecommendations {
    recommendedDoctor: string;
    precautions: string[];
}

export async function generateReportRecommendations(consultationData: Record<string, string>): Promise<ReportRecommendations> {
    const apiKey = process.env.OPEN_ROUTER;
    if (!apiKey) {
        console.error("OPEN_ROUTER API key is missing");
        return {
            recommendedDoctor: "General Practitioner",
            precautions: ["System Configuration Error: Missing API Key"],
        };
    }

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
    });

    try {
        // Convert consultation data to a readable string
        const dataSummary = Object.entries(consultationData)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

        const prompt = `
        You are a medical consultant AI. Analyze the following consultation data:
        
        ${dataSummary}

        Based on these symptoms and details:
        1. Recommend the specific type of doctor specialist the patient should visit (e.g., Cardiologist, Dermatologist, General Practitioner, etc.).
        2. Provide a list of 3-5 immediate precautionary measures or home care advice relevant to their symptoms.

        Output strictly valid JSON with the following structure:
        {
            "recommendedDoctor": "Specialist Name",
            "precautions": ["Precaution 1", "Precaution 2", "Precaution 3"]
        }
        
        Do not include markdown formatting or explanations.
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
        if (!content) throw new Error("No content received from AI");

        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const result = JSON.parse(cleanContent);

        return {
            recommendedDoctor: result.recommendedDoctor || "General Practitioner",
            precautions: Array.isArray(result.precautions) ? result.precautions : ["Consult a doctor for further advice."],
        };

    } catch (error) {
        console.error("Error generating report recommendations:", error);
        return {
            recommendedDoctor: "General Practitioner",
            precautions: ["Please consult a general physician for a detailed examination."],
        };
    }
}
