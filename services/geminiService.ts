
import { GoogleGenAI, Type } from "@google/genai";
import { MONO_SYSTEM_INSTRUCTION, DIARY_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMonoResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history,
    config: {
      systemInstruction: MONO_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.9,
    },
  });
  return response.text;
};

export const generateDiary = async (chatHistory: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: `대화 내용:\n${chatHistory}\n\n${DIARY_PROMPT}` }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          emotionScore: { type: Type.NUMBER },
          emotionLabel: { type: Type.STRING },
          dotColor: { type: Type.STRING },
        },
        required: ["content", "emotionScore", "emotionLabel", "dotColor"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("JSON Parse Error", e);
    return null;
  }
};
