
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
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{estimate.projectName}</h2>
            <div className="flex gap-2 mt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">Maturidade: {estimate.clientMaturity}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">Dependência: {estimate.externalDependency}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="text-center px-6 py-3 bg-slate-900 rounded-xl">
              <p className="text-xs uppercase font-bold text-slate-400">Total Geral</p>
              <p className="text-2xl font-black text-white">{estimate.totalHours}h</p>
            </div>
            <div className={`text-center px-6 py-3 rounded-xl border-2 ${getConfidenceColor(estimate.confidenceLevel)}`}>
              <p className="text-xs uppercase font-bold opacity-70">Confiança</p>
              <p className="text-2xl font-black">{estimate.confidenceLevel}</p>
            </div>
          </div>
        </div>

        {/* Resources Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-blue-700">Solutions Consultant (70%)</span>
              <span className="text-lg font-black text-blue-800">{estimate.scHours}h</span>
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-slate-700">Tech / Integration (30%)</span>
              <span className="text-lg font-black text-slate-800">{estimate.techHours}h</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-600 h-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-widest">Análise do Arquiteto</h3>
          <p className="text-slate-600 leading-relaxed italic">"{estimate.executiveSummary}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Functional Blocks */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">📦</span>
            Composição por Blocos (Pipefy Model)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estimate.blockBreakdown.map((block, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{block.blockName}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${block.complexity === 'Alta' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                    {block.complexity}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-xs text-slate-400">Base: {block.baseHours}h</span>
                  <span className="text-lg font-black text-slate-900">{block.estimatedHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">⏳</span>
            Fases do Delivery
          </h3>
          <div className="space-y-4">
            {estimate.timelinePhases.map((phase, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-slate-200 py-1">
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
                <p className="text-sm font-bold text-slate-800">{phase.phaseName} ({phase.hours}h)</p>
                <p className="text-xs text-slate-500 mt-1">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-l-4 border-rose-500 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="text-rose-500">⚠️</span> Riscos e Alertas Técnicos
        </h3>
        <ul className="space-y-2">
          {estimate.technicalRisks.map((risk, idx) => (
            <li key={idx} className="text-sm text-slate-600 flex gap-2">
              <span className="text-rose-500">•</span> {risk}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-4 no-print">
        <Button variant="outline" onClick={() => window.print()}>
          Exportar Relatório PDF
        </Button>
      </div>
    </div>
  );
};
