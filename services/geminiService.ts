import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AssessmentResult, GroundingSource } from "../types.ts";

export const analyzeEligibility = async (profile: UserProfile): Promise<AssessmentResult> => {
  // Always create a fresh instance to ensure correct API key usage
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing from the environment.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const textPrompt = `
    Perform a live audit for a UK Global Talent Visa (${profile.route} route) as an ${profile.careerStage}.
    
    Candidate Identity: ${profile.fullName}
    Current Role: ${profile.currentRole}
    
    Career Summary: 
    ${profile.summary}
    
    Claimed Achievements:
    ${profile.evidenceItems.join('\n- ')}

    Visual Evidence Attached: ${profile.evidenceImages.length} items.

    MANDATORY: Use Google Search to verify the LATEST 2026 endorsement criteria for ${profile.route}. 
    Cross-reference the candidate's profile against current Home Office requirements and specific endorsing body guidance.
    
    For strengths and weaknesses, provide a 'title' (short name) and a 'description' (detailed context on why this matters for the visa).
    Provide high-precision recommendations in JSON format.
  `;

  const parts: any[] = [{ text: textPrompt }];
  
  if (profile.evidenceImages && profile.evidenceImages.length > 0) {
    profile.evidenceImages.forEach((base64Data) => {
      if (base64Data.includes(',')) {
        const base64Content = base64Data.split(',')[1];
        const mimeType = base64Data.split(';')[0].split(':')[1];
        parts.push({
          inlineData: {
            data: base64Content,
            mimeType: mimeType
          }
        });
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: { parts },
      config: {
        systemInstruction: "You are a lead UK Global Talent Visa legal auditor. You MUST use Google Search to grounding your advice in current 2025/2026 rules. Return a strict JSON response. Do not use Markdown backticks in the response. Ensure strengths and weaknesses are detailed objects with title and description fields.",
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            probability: { type: Type.STRING },
            strengths: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              } 
            },
            weaknesses: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              } 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["title", "description", "action"]
              } 
            },
            suggestedEvidence: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "probability", "strengths", "weaknesses", "recommendations", "suggestedEvidence"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("Empty response from AI engine.");
    }
    
    const parsedData = JSON.parse(jsonStr.trim());

    // Extract grounding sources
    const groundingSources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          groundingSources.push({
            title: chunk.web.title || "Official Resource",
            uri: chunk.web.uri
          });
        }
      });
    }

    const uniqueSources = Array.from(new Map(groundingSources.map(s => [s.uri, s])).values());

    return {
      ...parsedData,
      groundingSources: uniqueSources
    };
  } catch (err) {
    console.error("Gemini Audit Error:", err);
    throw err;
  }
};