import { GoogleGenAI } from "@google/genai";
import { Question, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateQuestions(category: Category, count: number = 5): Promise<Question[]> {
  const prompt = `Generate ${count} CPNS practice questions for the category ${category}. 
  Return the result in valid JSON format as an array of objects matching this TypeScript interface:
  interface Question {
    id: string;
    category: Category;
    subCategory: string;
    text: string;
    options: {
      id: string;
      text: string;
      score?: number; // Only for TKP
    }[];
    correctAnswerId?: string; // For TWK and TIU
    explanation: string;
  }
  
  Make sure the questions are realistic and follow the latest CPNS standards. 
  For TKP, ensure each option has a score from 1-5. For others, specify correctAnswerId.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) return [];

    // Clean JSON if needed
    const jsonText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

export async function analyzePerformance(stats: any): Promise<string> {
  const prompt = `As an expert CPNS tutor, analyze this user's performance and provide a detailed study recommendation.
  Performance data: ${JSON.stringify(stats)}
  
  Focus on identifying weak topics, providing motivation, and suggesting a specific learning path for the next week. 
  Use a professional and encouraging tone. Return in Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Maaf, kami tidak dapat melakukan analisis saat ini.";
  } catch (error) {
    console.error("Error analyzing performance:", error);
    return "Maaf, kami tidak dapat melakukan analisis saat ini.";
  }
}
