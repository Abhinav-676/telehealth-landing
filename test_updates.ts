
import { validateAnswer } from "./actions/validateAnswer";
import { generateFollowUpQuestions } from "./actions/generateFollowUpQuestions";
import dotenv from "dotenv";

dotenv.config();

async function test() {
    console.log("--- Testing validateAnswer ---");

    const validRes = await validateAnswer("What is your name?", "My name is John Doe");
    console.log("Valid Answer Result:", validRes);

    const invalidRes = await validateAnswer("How old are you?", "The sky is blue");
    console.log("Invalid Answer Result:", invalidRes);

    console.log("\n--- Testing generateFollowUpQuestions ---");

    const mockData = {
        "Name": "John Doe",
        "Age": "30",
        "Symptoms": "Severe headache and nausea",
        "Duration": "2 days",
        "Severity": "8"
    };

    const questions = await generateFollowUpQuestions(mockData);
    console.log("Generated Questions:", JSON.stringify(questions, null, 2));
}

test().catch(console.error);
