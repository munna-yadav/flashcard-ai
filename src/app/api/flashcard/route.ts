import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.google_api_key!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const numCards = parseInt(formData.get("numCards") as string) || 5;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (numCards < 1 || numCards > 20) {
      return NextResponse.json({ error: "Number of cards must be between 1 and 20" }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Send file + instructions to Gemini
    const { text } = await generateText({
      model: google("gemini-2.0-flash-lite"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create ${numCards} flashcards from this PDF. Return only valid JSON with a 'flashcards' key containing an array of objects with 'question' and 'answer' fields. Example: {"flashcards": [{"question": "What is...", "answer": "It is..."}]}. No markdown, no code blocks, just pure JSON.`
            },
            { type: "file", data: buffer, mediaType: "application/pdf" },
          ],
        },
      ],
    });

    // Parse the AI response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```")) {
        // Remove opening code block (```json or ```)
        cleanedText = cleanedText.replace(/^```(?:json)?\n?/, '');
        // Remove closing code block
        cleanedText = cleanedText.replace(/\n?```$/, '');
      }
      
      parsedData = JSON.parse(cleanedText.trim());
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    // Validate the response structure
    if (!parsedData.flashcards || !Array.isArray(parsedData.flashcards)) {
      console.error("Invalid flashcards structure:", parsedData);
      return NextResponse.json({ error: "Invalid flashcard data structure" }, { status: 500 });
    }

    // Validate each flashcard has question and answer
    const validFlashcards = parsedData.flashcards.filter(
      (card: any) => card.question && card.answer
    );

    if (validFlashcards.length === 0) {
      return NextResponse.json({ error: "No valid flashcards generated" }, { status: 500 });
    }

    return NextResponse.json({ flashcards: validFlashcards });
  } catch (error) {
    console.error("Error processing flashcard request:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
