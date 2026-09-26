import { GoogleGenAI } from "@google/genai";

export const generateGeminiResponse = async (prompt, customApiKey) => {
  try {
    const key = customApiKey || localStorage.getItem("user_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key) {
      throw new Error("Gemini API Key is missing. Please save your key in the Settings page.");
    }

    const ai = new GoogleGenAI({ apiKey: key });

    // Using the latest reliable model identifier
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Detailed Gemini API Error:", error);
    // Throw the detailed message so you can see it
    throw new Error(error.message || "Failed to communicate with Gemini API.");
  }
};