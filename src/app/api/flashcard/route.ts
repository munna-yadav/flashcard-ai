import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.google_api_key!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Send file + instructions to Gemini
  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Create 5 flashcards from this PDF." },
          { type: "file", data: buffer, mediaType: "application/pdf" },
        ],
      },
    ],
  });

  let flashcards: { question: string; answer: string }[] = [];
  try {
    flashcards = JSON.parse(text);
  } catch {
    flashcards = [{ question: "Parse error", answer: text }];
  }

  return NextResponse.json({ flashcards });
}
