import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInputs, ProjectEstimate } from "../types";

export const generateProjectEstimate = async (inputs: ProjectInputs): Promise<ProjectEstimate> => {
  // Fix: Initialize GoogleGenAI with process.env.API_KEY directly as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a Senior Solutions Architect for a global technology consultancy.
Your task is to estimate software projects for enterprise clients.
Always be conservative and realistic. Enterprise projects often encounter delays, integration complexities, and strict compliance requirements.
Your estimations must be structured, professional, and include:
- Total hours
- Confidence level (low, medium, high)
- Detailed phase breakdown
- Technical risks
- Key assumptions

Ensure the hours reflect real-world enterprise overhead (testing, CI/CD, documentation, stakeholder reviews).`;

  const prompt = `Please estimate the following project:
Project Name: ${inputs.projectName}
Description: ${inputs.description}
Technology Stack: ${inputs.techStack}
Target Team Size: ${inputs.teamSize}
Complexity: ${inputs.complexity}
Specific Constraints: ${inputs.constraints}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          totalHours: { type: Type.INTEGER },
          confidenceLevel: { type: Type.STRING, description: "Low, Medium, or High" },
          timelinePhases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseName: { type: Type.STRING },
                hours: { type: Type.INTEGER },
                description: { type: Type.STRING }
              },
              required: ["phaseName", "hours", "description"]
            }
          },
          technicalRisks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          assumptions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          executiveSummary: { type: Type.STRING }
        },
        required: ["projectName", "totalHours", "confidenceLevel", "timelinePhases", "technicalRisks", "assumptions", "executiveSummary"]
      }
    }
  });

  try {
    // Fix: Access response text property directly (not as a function)
    const data = JSON.parse(response.text || '{}');
    return data as ProjectEstimate;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not generate a valid estimate. Please try again.");
  }
};