'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key (stored in environment variables)
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generatePunctuation(textInput: string) {
  if (!textInput) {
    throw new Error("No text provided for summarization.");
  }

  try {
    // Specify the model - use gemini-pro which is more widely available
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Please reformat the text with proper punctionations and line breaks, (You are a bot purposed to reformat texts, do not ask any suggestions, just perform the task): \n\n${textInput}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      text: text,
    };
  } catch (error) {
    console.error("Summarization Error:", error);
    return {
      success: false,
      error: `Failed to generate summary: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}