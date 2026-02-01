
export interface TimelinePhase {
  phase: string;
  durationWeeks: number;
  goal: string;
}

export interface DeliveryBlock {
  hours: number;
  complexity: string;
}

export interface ResourceAllocation {
  solutionsConsultant: number;
  projectManager: number;
  technicalConsultant: number;
}

export interface WeeklyPlan {
  week: number;
  phase: string;
  activities: string[];
  resourceAllocation: ResourceAllocation;
}

export interface ProjectSchedule {
  totalDurationWeeks: number;
  weeklyPlan: WeeklyPlan[];
  milestones: string[];
  criticalPath: string[];
}

export interface ProjectEstimate {
  id: string;
  createdAt: string;
  projectName: string;
  platform: string;
  methodology: string;
  audience: string;
  totalHours: number;
  scHours: number;
  deliveryBreakdown: Record<string, DeliveryBlock>;
  timelinePhases: TimelinePhase[];
  projectSchedule: ProjectSchedule;
  technicalRisks: string[];
  assumptions: string[];
  executiveSummary: string;
  logicExplanation: string; 
  complexity: string;
  clientMaturity: string;
  externalDependency: string;
  confidenceLevel: string;
}

export interface Attachment {
  data: string;
  mimeType: string;
  fileName: string;
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
  deepThinking: boolean;
  attachment: Attachment | null;
}
