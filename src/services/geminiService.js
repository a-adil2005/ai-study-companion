import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (prompt, customApiKey) => {
  try {
    // Check localStorage fallback or .env variable
    const key = customApiKey || localStorage.getItem("user_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      throw new Error("Gemini API Key is missing. Please provide it in the Settings page or your .env file.");
    }

    // Initialize the GoogleGenAI client with the key
    const ai = new GoogleGenAI({ apiKey: key });

    // Using the current standard model identifier for text tasks
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