
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInputs, ProjectEstimate } from "../types";

export const generateProjectEstimate = async (inputs: ProjectInputs): Promise<ProjectEstimate> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `Você é um Arquiteto de Soluções Sênior utilizando o modelo de estimativa do Pipefy.
REGRAS MATEMÁTICAS OBRIGATÓRIAS:
1. BLOCOS DE DELIVERY (Horas Base):
   - Estrutura: 4h | Campos: 6h | Automação: 8h | Comunicação: 4h | Integração: 6h | Permissões: 3h | Testes: 5h | Go-live: 4h.
2. FATORES DE COMPLEXIDADE POR BLOCO: Baixa (1.0), Média (1.3), Alta (1.6).
3. FATORES GLOBAIS:
   - Maturidade: Alta (1.0), Média (1.15), Baixa (1.30).
   - Dependência Externa: Baixa (1.0), Média (1.20), Alta (1.40).
4. CÁLCULO FINAL: (Soma dos Blocos ajustados) * Fator Maturidade * Fator Dependência.
5. SPLIT OPERACIONAL: 70% Solutions Consultant (SC), 30% Tech/Dev.
6. CONFIANÇA: Se Maturidade Alta + Dependência Baixa = Alta. Se qualquer fator Médio = Média. Se qualquer fator Alto = Baixa.

Retorne um JSON estruturado seguindo rigorosamente estas fórmulas.`;

  const prompt = `Estime o projeto:
Nome: ${inputs.projectName}
Descrição: ${inputs.description}
Stack: ${inputs.techStack}
Maturidade Cliente: ${inputs.clientMaturity}
Dependência Externa: ${inputs.externalDependency}
Complexidade Geral: ${inputs.complexity}`;

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
          totalHours: { type: Type.NUMBER },
          scHours: { type: Type.NUMBER },
          techHours: { type: Type.NUMBER },
          confidenceLevel: { type: Type.STRING },
          blockBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                blockName: { type: Type.STRING },
                baseHours: { type: Type.NUMBER },
                complexity: { type: Type.STRING },
                estimatedHours: { type: Type.NUMBER }
              },
              required: ["blockName", "baseHours", "complexity", "estimatedHours"]
            }
          },
          timelinePhases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseName: { type: Type.STRING },
                hours: { type: Type.NUMBER },
                description: { type: Type.STRING }
              }
            }
          },
          technicalRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
          assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          executiveSummary: { type: Type.STRING }
        },
        required: ["projectName", "totalHours", "scHours", "techHours", "confidenceLevel", "blockBreakdown", "timelinePhases", "technicalRisks", "assumptions", "executiveSummary"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as ProjectEstimate;
  } catch (error) {
    throw new Error("Erro ao processar estimativa lógica. Tente novamente.");
  }
};
