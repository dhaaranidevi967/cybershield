import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeWebsite = async (url: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this URL for phishing or scam potential: ${url}. 
    Provide a risk level (Safe, Suspicious, Dangerous) and a brief explanation. 
    Return JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, enum: ["Safe", "Suspicious", "Dangerous"] },
          explanation: { type: Type.STRING },
          color: { type: Type.STRING, description: "green, yellow, or red" }
        },
        required: ["riskLevel", "explanation", "color"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeAudioTranscript = async (transcript: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this phone call transcript for scam patterns: "${transcript}". 
    Look for urgency, threat language, and OTP requests. 
    Provide a scam probability score (0-100) and highlight suspicious phrases. 
    Return JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          probability: { type: Type.NUMBER },
          suspiciousPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["probability", "suspiciousPhrases", "summary"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const victimSupportChat = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a supportive cyber safety assistant. Your tone is friendly, empathetic, and reassuring. Help victims of scams by providing emotional support and clear, step-by-step guidance on what to do next (contact bank, report crime, change passwords). Do not use the word 'Gemini' in your responses.",
    },
    history: history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
