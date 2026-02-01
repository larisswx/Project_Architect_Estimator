
import React from 'react';
import { ProjectEstimate } from '../types';

interface ProjectComparisonProps {
  projects: ProjectEstimate[];
}

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({ projects }) => {
  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'alta':
      case 'high': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'média':
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'baixa':
      case 'low': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getComplexityWeight = (c: string) => {
    if (c.includes('Enterprise')) return 4;
    if (c.includes('Complex')) return 3;
    if (c.includes('Moderate')) return 2;
    return 1;
  };

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max">
        <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(350px,1fr))] border-t border-slate-200">
          {/* Labels Column */}
          <div className="bg-slate-50 border-r border-slate-200 p-6 space-y-16">
            <div className="h-24"></div> {/* Spacer for header */}
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Metrics</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Total Effort</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Role Split</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Core Blocks</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Assumptions</div>
          </div>

          {/* Project Columns */}
          {projects.map((p, idx) => (
            <div key={p.id} className={`border-r border-slate-200 p-6 space-y-8 bg-white transition-all hover:shadow-xl relative ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
              {/* Header */}
              <div className="h-24">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{p.projectName}</h3>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {p.complexity}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Confidence & Context */}
              <div className="space-y-4">
                <div className={`text-center py-2 px-4 rounded-lg border-2 font-black ${getConfidenceColor(p.confidenceLevel)}`}>
                  {p.confidenceLevel} Confidence
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border border-slate-200 p-2 rounded text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Maturity</p>
                    <p className="text-sm font-bold text-slate-700">{p.clientMaturity}</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 rounded text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Dependency</p>
                    <p className="text-sm font-bold text-slate-700">{p.externalDependency}</p>
                  </div>
                </div>
              </div>

              {/* Effort */}
              <div className="space-y-2">
                <div className="text-4xl font-black text-slate-900">{p.totalHours}h</div>
                <div className="text-xs text-slate-400">Estimated total billable hours</div>
              </div>

              {/* Split Visualization */}
              <div className="space-y-4">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: '70%' }}></div>
                  <div className="bg-slate-800 h-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <div className="text-blue-600">SC: {p.scHours}h</div>
                  <div className="text-slate-800">Tech: {p.techHours}h</div>
                </div>
              </div>

              {/* Block Distribution */}
              <div className="space-y-2">
                {p.blockBreakdown.map(block => (
                  <div key={block.blockName} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                    <span className="text-slate-500">{block.blockName}</span>
                    <span className="font-bold text-slate-900">{block.estimatedHours}h</span>
                  </div>
                ))}
              </div>

              {/* Key Assumptions */}
              <div className="space-y-2">
                {p.assumptions.slice(0, 3).map((a, i) => (
                  <div key={i} className="flex gap-2 text-xs text-slate-600 bg-slate-100 p-2 rounded">
                    <span className="text-blue-500">•</span>
                    <span className="line-clamp-2">{a}</span>
                  </div>
                ))}
                {p.assumptions.length > 3 && (
                  <div className="text-[10px] text-slate-400 text-center font-bold">
                    + {p.assumptions.length - 3} more assumptions
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
