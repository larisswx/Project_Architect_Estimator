
export interface TimelinePhase {
  phaseName: string;
  hours: number;
  description: string;
}

export interface ProjectEstimate {
  id: string;
  createdAt: string;
  projectName: string;
  totalHours: number;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  timelinePhases: TimelinePhase[];
  technicalRisks: string[];
  assumptions: string[];
  executiveSummary: string;
  complexity: string; // Added complexity from inputs
}

export interface ProjectInputs {
  projectName: string;
  description: string;
  techStack: string;
  teamSize: string;
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Enterprise-Scale';
  constraints: string;
}
