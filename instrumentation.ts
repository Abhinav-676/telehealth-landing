import { GoogleGenAI } from "@google/genai";


let ai: GoogleGenAI

export function register() {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        throw new Error("Cannot find API Key");
    }
    
    ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
}

export {ai}