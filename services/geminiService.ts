import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AssessmentResult, GroundingSource } from "../types.ts";

export const analyzeEligibility = async (profile: UserProfile): Promise<AssessmentResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing from the environment.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const textPrompt = `
    Perform a professional audit for a UK Global Talent Visa (${profile.route} route) as an ${profile.careerStage}.
    
    Candidate Identity: ${profile.fullName}
    Current Role: ${profile.currentRole}
    Public Profile: ${profile.publicUrl || 'Not provided'}
    
    Career Summary: 
    ${profile.summary}
    
    Claimed Achievements:
    ${profile.evidenceItems.join('\n- ')}

    Visual Evidence Attached: ${profile.evidenceImages.length} items.

    TASKS:
    1. VISA AUDIT: Verify against LATEST 2026 endorsement criteria. Use Google Search.
    2. GEO AUDIT (Generative Engine Optimization): Analyze how "discoverable" this candidate's profile is for AI agents (LLMs). 
       Evaluate if an AI search (Perplexity/Gemini/GPT-4o) could easily verify their claims. 
       Provide a 'visibilityScore' (0-100), an 'aiPersona' (how an AI sees them), and 'discoveryTips' (SEO/GEO steps to improve AI-readiness).
    
    Return a strict JSON response.
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
        systemInstruction: `You are a lead UK Global Talent Visa auditor and GEO (Generative Engine Optimization) expert. 
        You MUST use Google Search for grounding. Return JSON only.
        The 'geoAudit' object should contain visibilityScore (integer), aiPersona (string), and discoveryTips (array of strings).`,
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
            suggestedEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            geoAudit: {
              type: Type.OBJECT,
              properties: {
                visibilityScore: { type: Type.INTEGER },
                aiPersona: { type: Type.STRING },
                discoveryTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["visibilityScore", "aiPersona", "discoveryTips"]
            }
          },
          required: ["score", "probability", "strengths", "weaknesses", "recommendations", "suggestedEvidence", "geoAudit"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("Empty response from AI engine.");
    
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