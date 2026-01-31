'use server'

import OpenAI from "openai";

// Using the same model as other actions for consistency via OpenRouter
const MODEL_NAME = "liquid/lfm-2.5-1.2b-thinking:free";

export async function generatePunctuation(textInput: string) {
  const apiKey = process.env.OPEN_ROUTER;

  if (!apiKey) {
    console.error("OPEN_ROUTER API key is not set");
    return {
      success: false,
      error: "Server configuration error: Missing API Key",
    };
  }

  if (!textInput) {
    throw new Error("No text provided for summarization.");
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

  try {
    const prompt = `Please reformat the text with proper punctuation and line breaks. (You are a bot purposed to reformat texts, do not ask any suggestions, just perform the task): \n\n${textInput}`;

    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: "You are a text formatting assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    const text = completion.choices[0].message.content || "";

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