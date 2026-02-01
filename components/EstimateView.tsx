
import React from 'react';
import { ProjectEstimate } from '../types';
import { Button } from './Button';

interface EstimateViewProps {
  estimate: ProjectEstimate;
}

export const EstimateView: React.FC<EstimateViewProps> = ({ estimate }) => {
  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'alta': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'média': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'baixa': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Summary */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Architectural Assessment</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{estimate.projectName}</h2>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Maturidade: {estimate.clientMaturity}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">Dependência: {estimate.externalDependency}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="text-center px-8 py-4 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Total Effort</p>
              <p className="text-3xl font-black text-white">{estimate.totalHours}<span className="text-lg font-medium ml-1">h</span></p>
            </div>
            <div className={`text-center px-8 py-4 rounded-2xl border-2 shadow-sm ${getConfidenceColor(estimate.confidenceLevel)}`}>
              <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest mb-1">Confidence</p>
              <p className="text-3xl font-black">{estimate.confidenceLevel}</p>
            </div>
          </div>
        </div>

        {/* Resources Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-blue-800">Solutions Consultant (70%)</span>
              <span className="text-xl font-black text-blue-900">{estimate.scHours}h</span>
            </div>
            <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-800">Tech / Integration (30%)</span>
              <span className="text-xl font-black text-slate-900">{estimate.techHours}h</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>

        {/* Explainability Insight Card */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg mb-8">
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="relative z-10">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-80">AI Reasoning & Rule Application</h3>
             <p className="text-xl font-bold leading-relaxed">{estimate.logicExplanation}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16L9.01697 16C7.9124 16 7.01697 16.8954 7.01697 18L7.01697 21M14.017 21L17.017 21C18.1216 21 19.017 20.1046 19.017 19L19.017 5C19.017 3.89543 18.1216 3 17.017 3L7.01697 3C5.9124 3 5.01697 3.89543 5.01697 5L5.01697 19C5.01697 20.1046 5.9124 21 7.01697 21L10.017 21M14.017 21L10.017 21M11 11L13 11M11 7L13 7M11 15L13 15" /></svg>
          </div>
          <h3 className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">Architect's Briefing</h3>
          <p className="text-slate-700 leading-relaxed font-medium text-lg italic">"{estimate.executiveSummary}"</p>
        </div>
      </div>

      {/* Technical Risks Registry */}
      <div className="bg-white rounded-2xl border-2 border-rose-100 overflow-hidden shadow-2xl shadow-rose-100/20">
        <div className="bg-rose-600 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/20 text-white rounded-xl backdrop-blur-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Technical Risk Registry</h3>
              <p className="text-rose-100 text-xs font-bold uppercase tracking-wider opacity-80">Critical implementation alerts</p>
            </div>
          </div>
          <div className="bg-rose-800 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-inner">
            {estimate.technicalRisks.length} IDENTIFIED THREATS
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {estimate.technicalRisks.map((risk, idx) => (
              <div key={idx} className="group relative flex gap-5 p-6 rounded-2xl border border-rose-100 bg-rose-50/20 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Impact Level: High</div>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    {risk}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Functional Blocks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 flex items-center justify-center text-lg">📦</span>
              Delivery Block Breakdown
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estimate.blockBreakdown.map((block, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-slate-800 leading-tight">{block.blockName}</h4>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${block.complexity === 'Alta' ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {block.complexity}
                  </span>
                </div>
                <div className="flex items-end justify-between border-t border-slate-50 pt-3 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Base Allocation</span>
                    <span className="text-sm font-bold text-slate-500">{block.baseHours}h</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-blue-400 uppercase font-bold tracking-tighter">Adjusted Total</span>
                    <p className="text-2xl font-black text-slate-900 leading-none">{block.estimatedHours}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 flex items-center justify-center text-lg">⏳</span>
            Delivery Pipeline
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-0">
            {estimate.timelinePhases.map((phase, idx) => (
              <div key={idx} className="relative pl-8 pb-8 last:pb-0 group">
                {idx !== estimate.timelinePhases.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-100 group-hover:bg-blue-100 transition-colors"></div>
                )}
                <div className="absolute -left-[1px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-200 group-hover:border-blue-600 transition-all flex items-center justify-center z-10">
                   <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-600"></div>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-black text-slate-800 group-hover:text-blue-700 transition-colors">{phase.phaseName}</p>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{phase.hours}h</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center no-print pt-10 border-t border-slate-200">
        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          ESTIMATE AUDIT ID: {estimate.id.slice(0,13)}
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.print()} className="group">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Export Proposal PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
