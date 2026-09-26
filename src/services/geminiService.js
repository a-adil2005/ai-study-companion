import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (prompt) => {
  try {
    // Check if the user saved their API key in localStorage via a settings modal or page
    const apiKey = localStorage.getItem("user_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Missing Gemini API Key");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};