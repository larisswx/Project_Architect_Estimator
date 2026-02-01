
export interface TimelinePhase {
  phaseName: string;
  hours: number;
  description: string;
}

export interface BlockEstimation {
  blockName: string;
  baseHours: number;
  complexity: 'Baixa' | 'Média' | 'Alta';
  estimatedHours: number;
}

export interface ProjectEstimate {
  id: string;
  createdAt: string;
  projectName: string;
  totalHours: number;
  scHours: number;
  techHours: number;
  confidenceLevel: 'Baixa' | 'Média' | 'Alta';
  blockBreakdown: BlockEstimation[];
  timelinePhases: TimelinePhase[];
  technicalRisks: string[];
  assumptions: string[];
  executiveSummary: string;
  complexity: string;
  clientMaturity: string;
  externalDependency: string;
}

export interface ProjectInputs {
  projectName: string;
  description: string;
  techStack: string;
  teamSize: string;
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Enterprise-Scale';
  clientMaturity: 'Alta' | 'Média' | 'Baixa';
  externalDependency: 'Baixa' | 'Média' | 'Alta';
  constraints: string;
}
