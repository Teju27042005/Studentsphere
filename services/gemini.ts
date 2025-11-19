import { GoogleGenAI } from "@google/genai";

// Determine the API key based on the environment.
// 1. import.meta.env.VITE_API_KEY is used by Vite for local development (.env file).
// 2. process.env.API_KEY is used by standard Node environments or cloud builders.
const getApiKey = (): string => {
  try {
    // @ts-ignore - Handles Vite environment types implicitly
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore errors if import.meta is not available
  }
  return process.env.API_KEY || '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const GeminiService = {
  /**
   * Summarizes a note or text content.
   */
  summarizeText: async (text: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following educational note concisely in bullet points:\n\n${text}`,
      });
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error contacting AI service. Please check your API Key.";
    }
  },

  /**
   * General AI Tutor chat function.
   */
  askTutor: async (query: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
          systemInstruction: "You are a helpful, encouraging, and knowledgeable academic tutor for a university student. Keep answers concise and educational.",
        }
      });
      
      const result = await chat.sendMessage({ message: query });
      return result.text || "I'm not sure how to answer that.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Sorry, I am having trouble connecting to the knowledge base right now. Please check your Internet connection or API Key.";
    }
  }
};