
import React from 'react';
import { ProjectEstimate } from '../types';

interface ProjectComparisonProps {
  projects: ProjectEstimate[];
}

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({ projects }) => {
  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'alta': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'média': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'baixa': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto pb-8">
      <div className="min-w-max">
        <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(350px,1fr))] border-t border-slate-200">
          {/* Labels Column */}
          <div className="bg-slate-50 border-r border-slate-200 p-6 space-y-16">
            <div className="h-24"></div> 
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Solution Metadata</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Total Effort</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Consultancy Split</div>
            <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">Risk Profile</div>
          </div>

          {/* Project Columns */}
          {projects.map((p, idx) => (
            <div key={p.id} className={`border-r border-slate-200 p-6 space-y-8 bg-white transition-all hover:shadow-xl relative ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
              <div className="h-24">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{p.projectName}</h3>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase bg-slate-900 text-white px-1.5 py-0.5 rounded">{p.platform}</span>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{p.audience}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border border-slate-200 p-2 rounded text-center">
                    <p className="text-[8px] text-slate-400 uppercase font-black">Methodology</p>
                    <p className="text-[10px] font-bold text-slate-700">{p.methodology}</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 rounded text-center">
                    <p className="text-[8px] text-slate-400 uppercase font-black">Maturity</p>
                    <p className="text-[10px] font-bold text-slate-700">{p.clientMaturity}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-black text-slate-900">{p.totalHours}h</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Billable Delivery Time</div>
              </div>

              <div className="space-y-4">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div className="bg-blue-600 h-full" style={{ width: `${(p.scHours / p.totalHours) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <div className="text-blue-600">SC: {p.scHours}h</div>
                  <div className="text-slate-400">Delivery: {p.totalHours - p.scHours}h</div>
                </div>
              </div>

              <div className="space-y-2">
                {p.technicalRisks.slice(0, 3).map((risk, i) => (
                  <div key={i} className="flex gap-2 text-[10px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-100 font-bold">
                    <span>⚠️</span>
                    <span className="line-clamp-1">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
