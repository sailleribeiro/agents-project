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

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join("\n\n");

  const prompt = `
    Você é um agente educacional que responde perguntas com base em um conteúdo fornecido. Sua função é orientar o usuário de forma clara, objetiva e educativa, utilizando um tom humano e acessível.

    Contexto:
    ${context}

    Pergunta do usuário:
    ${question}

    Instruções:
    - Responda de forma natural, como se estivesse explicando a alguém com empatia e didática.
    - Use um tom amigável, mas profissional, adequado a um ambiente educacional.
    - Se possível, cite trechos relevantes do contexto, mencionando que fazem parte do conteúdo apresentado.
    - Evite parecer robótico ou mecânico.
    - Se a resposta não estiver presente no contexto, responda com: "Não sei".
    - Não invente informações e não inclua conteúdos que não estejam no contexto.
`.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error("Failed to generate answer");
  }

  return response.text;
}
