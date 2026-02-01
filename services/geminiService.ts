
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInputs, ProjectEstimate } from "../types";

export const generateProjectEstimate = async (inputs: ProjectInputs): Promise<ProjectEstimate> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Logic to determine if deep thinking is required based on complexity or attachments
  const isEnterprise = inputs.complexity === 'Enterprise-Scale';
  const hasAttachment = !!inputs.attachment;
  const forceDeepThinking = isEnterprise || hasAttachment;
  
  // Use user preference if not forced by complexity/attachments
  const thinkingBudget = (forceDeepThinking || inputs.deepThinking) ? 32768 : 0;

  const systemInstruction = `Você é um Arquiteto de Soluções Sênior utilizando o modelo de estimativa do Pipefy.
Sua tarefa é fornecer estimativas realistas e conservadoras para projetos de software enterprise.

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

TRANSPARÊNCIA E EXPLICABILIDADE (CAMPO logicExplanation):
Você DEVE explicar matematicamente como os fatores de Maturidade (${inputs.clientMaturity}) e Dependência (${inputs.externalDependency}) afetaram o total. Exemplo: "O total de 120h foi acrescido de 15% pela maturidade média e 20% pela dependência alta de integrações legadas identified no BPMN."

ANÁLISE DE DIAGRAMA (BPMN/PDF):
Se houver anexo, analise a densidade de automações e gateways para ajustar a complexidade dos blocos de Automação e Integração. ${hasAttachment ? "Dê atenção especial ao diagrama visual anexado para identificar caminhos críticos e integrações implícitas." : ""}
${thinkingBudget > 0 ? "Utilize sua capacidade de raciocínio profundo para antecipar riscos técnicos que não estão explicitamente descritos." : ""}`;

  const promptText = `Estime o projeto:
Nome: ${inputs.projectName}
Descrição: ${inputs.description}
Maturidade: ${inputs.clientMaturity}
Dependência: ${inputs.externalDependency}
Complexidade: ${inputs.complexity}
Stack: ${inputs.techStack}
Restrições: ${inputs.constraints}`;

  const parts: any[] = [{ text: promptText }];
  if (inputs.attachment) {
    parts.push({ 
      inlineData: { 
        data: inputs.attachment.data, 
        mimeType: inputs.attachment.mimeType 
      } 
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { 
        thinkingBudget: thinkingBudget 
      },
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
          executiveSummary: { type: Type.STRING },
          logicExplanation: { type: Type.STRING }
        },
        required: ["projectName", "totalHours", "scHours", "techHours", "confidenceLevel", "blockBreakdown", "timelinePhases", "technicalRisks", "assumptions", "executiveSummary", "logicExplanation"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ProjectEstimate;
};
