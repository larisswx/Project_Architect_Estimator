import React from 'react';
import { ProjectEstimate } from '../types';
// Fix: Import the Button component used in the JSX below
import { Button } from './Button';

interface EstimateViewProps {
  estimate: ProjectEstimate;
}

export const EstimateView: React.FC<EstimateViewProps> = ({ estimate }) => {
  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{estimate.projectName}</h2>
            <p className="text-slate-500">Solutions Architect Estimation Report</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs uppercase font-bold text-slate-400">Total Effort</p>
              <p className="text-xl font-bold text-slate-900">{estimate.totalHours} hrs</p>
            </div>
            <div className={`text-center px-4 py-2 rounded-lg border ${getConfidenceColor(estimate.confidenceLevel)}`}>
              <p className="text-xs uppercase font-bold opacity-70">Confidence</p>
              <p className="text-xl font-bold">{estimate.confidenceLevel}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Executive Summary</h3>
          <p className="text-slate-600 leading-relaxed">{estimate.executiveSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Phases */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">01</span>
            Timeline & Phased Breakdown
          </h3>
          <div className="space-y-4">
            {estimate.timelinePhases.map((phase, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{phase.phaseName}</h4>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{phase.hours}h</span>
                </div>
                <p className="text-sm text-slate-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risks & Assumptions */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">02</span>
              Technical Risks
            </h3>
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
              {estimate.technicalRisks.map((risk, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="text-rose-500 mt-1">•</span>
                  <p className="text-slate-600">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">03</span>
              Core Assumptions
            </h3>
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
              {estimate.assumptions.map((assumption, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="text-amber-500 mt-1">•</span>
                  <p className="text-slate-600">{assumption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 no-print">
        {/* Fix: Using Button after adding the import */}
        <Button variant="outline" onClick={() => window.print()}>
          Print to PDF Report
        </Button>
      </div>
    </div>
  );
};