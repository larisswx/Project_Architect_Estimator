
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInputs, ProjectEstimate } from "../types";

export const generateProjectEstimate = async (inputs: ProjectInputs): Promise<ProjectEstimate> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isEnterprise = inputs.complexity === 'Enterprise-Scale';
  const hasAttachment = !!inputs.attachment;
  const forceDeepThinking = isEnterprise || hasAttachment;
  const thinkingBudget = (forceDeepThinking || inputs.deepThinking) ? 32768 : 0;

  const systemInstruction = `Você é um Arquiteto de Soluções Sênior e Project Manager Enterprise, especializado em projetos de automação, SaaS e transformação digital.
Seu papel é atuar como um consultor técnico de pré-vendas e delivery, gerando estimativas conservadoras, cronogramas executivos e alocação de recursos.

ESTRUTURA MATEMÁTICA OBRIGATÓRIA:
1. BLOCOS DE DELIVERY (Horas Base): Estrutura Solução: 4h | Modelagem: 6h | Automação: 8h | Comunicação: 4h | Integrações: 6h | Governança: 3h | Testes: 5h | Go-Live: 4h.
2. FATOR COMPLEXIDADE: Baixa (1.0), Média (1.3), Alta (1.6).
3. FATORES GLOBAIS: Maturidade: Alta (1.0) a Baixa (1.3) | Dependência: Baixa (1.0) a Alta (1.4).
4. RESOURCE PLANNING:
   - Solutions Consultant (SC): Capacidade 30h/sem.
   - Project Manager (PM): Capacidade 15h/sem.
   - Technical Consultant (Dev): Capacidade 20h/sem (ATIVAR APENAS SE Integrações = Média/Alta).
5. SC HOURS: 25% a 35% do total. Use 35% para Baixa Maturidade/Enterprise.

GOVERNANÇA:
- Mínimo 3 Marcos: Executivo (Steering), Técnico (Sign-off) e Operacional (Go-live).
- Identifique claramente o Caminho Crítico.

POSTURA: Conservadora, realista e orientada a valor de negócio.
CAMPO OBRIGATÓRIO: 'confidenceLevel' deve ser 'Alta', 'Média' ou 'Baixa'.`;

  const promptText = `Gere uma estimativa enterprise completa:
Nome: ${inputs.projectName}
Descrição: ${inputs.description}
Maturidade: ${inputs.clientMaturity}
Dependência: ${inputs.externalDependency}
Complexidade: ${inputs.complexity}
Stack: ${inputs.techStack}
Restrições: ${inputs.constraints}`;

  const parts: any[] = [{ text: promptText }];
  if (inputs.attachment) {
    parts.push({ inlineData: { data: inputs.attachment.data, mimeType: inputs.attachment.mimeType } });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          platform: { type: Type.STRING },
          methodology: { type: Type.STRING },
          audience: { type: Type.STRING },
          totalHours: { type: Type.NUMBER },
          scHours: { type: Type.NUMBER },
          confidenceLevel: { type: Type.STRING },
          deliveryBreakdown: {
            type: Type.OBJECT,
            properties: {
              "Estrutura de Solução": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Modelagem de Dados": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Automação de Processos": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Comunicação e Notificações": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Integrações Externas": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Permissões e Governança": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Testes e Validação": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } },
              "Go-Live e Transição Operacional": { type: Type.OBJECT, properties: { hours: { type: Type.NUMBER }, complexity: { type: Type.STRING } } }
            }
          },
          timelinePhases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                durationWeeks: { type: Type.NUMBER },
                goal: { type: Type.STRING }
              }
            }
          },
          projectSchedule: {
            type: Type.OBJECT,
            properties: {
              totalDurationWeeks: { type: Type.NUMBER },
              weeklyPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: { type: Type.NUMBER },
                    phase: { type: Type.STRING },
                    activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    resourceAllocation: {
                      type: Type.OBJECT,
                      properties: {
                        solutionsConsultant: { type: Type.NUMBER },
                        projectManager: { type: Type.NUMBER },
                        technicalConsultant: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              },
              milestones: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalPath: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          technicalRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
          assumptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          executiveSummary: { type: Type.STRING },
          logicExplanation: { type: Type.STRING }
        },
        required: ["projectName", "platform", "methodology", "audience", "totalHours", "scHours", "confidenceLevel", "deliveryBreakdown", "timelinePhases", "projectSchedule", "technicalRisks", "assumptions", "executiveSummary", "logicExplanation"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as ProjectEstimate;
};
