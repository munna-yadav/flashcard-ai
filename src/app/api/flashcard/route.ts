import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey:process.env.google_api_key!,
});



export async function GET() {
  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: `
      Return a JSON array of 3 flashcards about AI.
      Format strictly like:
      [
        {"question":"...","answer":"..."},
        {"question":"...","answer":"..."}
      ]
    `,
  });

  let flashcards: { question: string; answer: string }[] = [];
  try {
    flashcards = JSON.parse(text);
  } catch {
    // fallback in case model outputs junk
    flashcards = [{ question: "Parse error", answer: text }];
  }

  return NextResponse.json({ flashcards });
}
