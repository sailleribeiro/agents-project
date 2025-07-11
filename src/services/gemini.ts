import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

const gemini = new GoogleGenAI({
  apiKey: env.GOOGLE_GENAI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: "Transcribe the following audio into Brazilian Portuguese, be precise and natural in the transcription and maintain proper punctuation, divide into paragraphs when necessary.",
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });
  if (!response.text) {
    throw new Error("Failed to transcribe audio");
  }

  return response.text;
}

export async function generateEmbedding(text: string) {
  const response = await gemini.models.embedContent({
    model: "text-embedding-004",
    contents: [{ text }],
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("Failed to generate embedding");
  }

  return response.embeddings[0].values;
}
