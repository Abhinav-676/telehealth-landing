"use server";

import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function getDeepgramToken(): Promise<string> {
    const { result } = await deepgram.manage.createProjectKey(
        process.env.DEEPGRAM_PROJECT_ID!,
        {
            comment: "Temporary browser key",
            scopes: ["usage:write"],
            time_to_live_in_seconds: 60,
        }
    );
    return result?.key || "";
}
