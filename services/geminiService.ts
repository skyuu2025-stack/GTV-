
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AssessmentResult } from "../types";

export const analyzeEligibility = async (profile: UserProfile): Promise<AssessmentResult> => {
  // Use the standard initialization pattern for GoogleGenAI
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Assess the eligibility of this candidate for the UK Global Talent Visa (${profile.route} route) as an ${profile.careerStage}.
    
    Candidate Details:
    - Current Role: ${profile.currentRole}
    - Career Summary: ${profile.summary}
    - Evidence Provided: ${profile.evidenceItems.join(', ')}

    Please evaluate against official Home Office criteria for this specific route.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert UK immigration consultant specializing in Global Talent Visa (GTV) endorsements. Provide a professional, critical, and accurate assessment. Return a structured JSON response.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "A score from 0-100 reflecting overall readiness." },
          probability: { type: Type.STRING, description: "One word: High, Medium, or Low." },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedEvidence: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "probability", "strengths", "weaknesses", "recommendations", "suggestedEvidence"]
      }
    }
  });

  // Extract text from the response safely using the .text property
  const jsonStr = response.text;
  if (!jsonStr) {
    throw new Error("No content generated from the model.");
  }
  
  return JSON.parse(jsonStr.trim());
};