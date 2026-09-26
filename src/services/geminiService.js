import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (prompt, customApiKey) => {
  // Check custom passed key, then localStorage settings key, then Vite env variable
  const apiKey = 
    customApiKey || 
    localStorage.getItem("gemini_api_key") || 
    localStorage.getItem("user_gemini_key") || 
    import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API Key missing from localStorage and environment variables.");
    throw new Error("Gemini API Key is missing. Please save your key in the Settings page.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Execution Error:", error);
    throw error;
  }
};