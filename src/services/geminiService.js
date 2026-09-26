import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (prompt, customApiKey) => {
  try {
    // Checks parameter, then Settings storage, then local .env
    const key = customApiKey || localStorage.getItem("user_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      throw new Error("Gemini API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey: key });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw error;
  }
};