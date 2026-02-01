
import React from 'react';
import { ProjectEstimate, DeliveryBlock } from '../types';

interface EstimateViewProps {
  estimate: ProjectEstimate;
}

export const EstimateView: React.FC<EstimateViewProps> = ({ estimate }) => {
  // Add explicit type casting for delivery breakdown entries to fix TS unknown type errors
  const deliveryEntries = Object.entries(estimate.deliveryBreakdown) as [string, DeliveryBlock][];

  // Helper to calculate total project costs/resource mix
  const hasDev = estimate.projectSchedule.weeklyPlan.some(w => w.resourceAllocation.technicalConsultant > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Enterprise Delivery Intelligence</p>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{estimate.projectName}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-white bg-slate-900 px-2.5 py-1 rounded-md">{estimate.platform}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{estimate.methodology}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{estimate.audience}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-center px-10 py-5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Total Billable Hours</p>
              <p className="text-4xl font-black text-white">{estimate.totalHours}<span className="text-xl font-medium ml-1">h</span></p>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Estimated Duration: <span className="text-slate-900">{estimate.projectSchedule.totalDurationWeeks} Weeks</span>
            </p>
          </div>
        </div>

        {/* Resources Allocation Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-3">Solutions Consultant</p>
            <p className="text-2xl font-black text-blue-900">{estimate.scHours}h</p>
            <p className="text-xs text-blue-500 mt-1">Config & Functional Logic</p>
          </div>
          <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <p className="text-[10px] font-black text-emerald-600 uppercase mb-3">Project Management</p>
            <p className="text-2xl font-black text-emerald-900">{Math.round(estimate.totalHours * 0.15)}h</p>
            <p className="text-xs text-emerald-500 mt-1">Governance & Stakeholders</p>
          </div>
          <div className={`p-5 rounded-2xl border ${hasDev ? 'bg-amber-50/50 border-amber-100 opacity-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
            <p className={`text-[10px] font-black uppercase mb-3 ${hasDev ? 'text-amber-600' : 'text-slate-400'}`}>Technical Consultant (Dev)</p>
            <p className={`text-2xl font-black ${hasDev ? 'text-amber-900' : 'text-slate-400'}`}>{hasDev ? 'Included' : 'Not Required'}</p>
            <p className="text-xs text-slate-400 mt-1">API & External Integrations</p>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.895 14.912 16 16.017 16L19.017 16C19.57 16 20.017 15.553 20.017 15L20.017 13C20.017 12.447 19.57 12 19.017 12L17.017 12C15.36 12 14.017 10.657 14.017 9L14.017 6C14.017 4.343 15.36 3 17.017 3L20.017 3C21.674 3 23.017 4.343 23.017 6L23.017 9C23.017 10.657 21.674 12 20.017 12L20.017 15C20.017 17.209 18.226 19 16.017 19L14.017 19L14.017 21ZM1 21L1 18C1 16.895 1.895 16 3 16L6 16C6.553 16 7 15.553 7 15L7 13C7 12.447 6.553 12 6 12L4 12C2.343 12 1 10.657 1 9L1 6C1 4.343 2.343 3 4 3L7 3C8.657 3 10 4.343 10 6L10 9C10 10.657 8.657 12 7 12L7 15C7 17.209 5.209 19 3 19L1 19L1 21Z" /></svg>
          </div>
          <h3 className="text-[10px] font-black text-blue-400 mb-4 uppercase tracking-[0.2em]">Executive Summary</h3>
          <p className="text-xl font-medium leading-relaxed italic border-l-4 border-blue-600 pl-6 text-slate-100 relative z-10">"{estimate.executiveSummary}"</p>
        </div>

        {/* Calculation Logic Info */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-slate-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </span>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Architectural Reasoning Engine</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">{estimate.logicExplanation}</p>
        </div>
      </div>

      {/* Main Delivery Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Weekly Plan & Critical Path */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Delivery Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">🗓️</span>
                Weekly Delivery Roadmap
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Wk</th>
                    <th className="px-6 py-4">Phase</th>
                    <th className="px-6 py-4">Activities</th>
                    <th className="px-6 py-4 text-center">Resources (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estimate.projectSchedule.weeklyPlan.map((week, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-400">{week.week}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 rounded text-slate-600 whitespace-nowrap">
                          {week.phase}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="text-xs text-slate-600 space-y-1">
                          {week.activities.map((act, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-blue-400">•</span>
                              {act}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-center">
                           <div className="flex gap-1">
                             <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700" title="Solutions Consultant">SC</div>
                             <span className="text-xs font-bold text-slate-700">{week.resourceAllocation.solutionsConsultant}h</span>
                           </div>
                           <div className="flex gap-1">
                             <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700" title="Project Manager">PM</div>
                             <span className="text-xs font-bold text-slate-700">{week.resourceAllocation.projectManager}h</span>
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Path & Logic */}
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
             <h3 className="text-sm font-black text-blue-400 mb-6 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               Critical Path Identification
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {estimate.projectSchedule.criticalPath.map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">0{idx+1}</div>
                        {idx < estimate.projectSchedule.criticalPath.length - 1 && <div className="w-px h-full bg-slate-700 my-1"></div>}
                      </div>
                      <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors pt-0.5">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Delivery Strategy</p>
                   <p className="text-sm text-slate-400 leading-relaxed italic">
                     This estimation assumes a strict focus on the critical path to mitigate ${estimate.externalDependency.toLowerCase()} external dependencies and ${estimate.clientMaturity.toLowerCase()} client maturity impacts.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Governance, Blocks & Risks */}
        <div className="space-y-8">
          {/* Governance Milestones */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Governance Milestones
            </h3>
            <div className="space-y-4">
               {estimate.projectSchedule.milestones.map((milestone, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <p className="text-sm font-bold text-slate-800">{milestone}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Delivery Blocks List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               Effort Breakdown
            </h3>
            <div className="space-y-3">
              {deliveryEntries.map(([name, data], idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{name}</p>
                    <span className="text-[8px] font-black uppercase text-slate-400">{data.complexity} complexity</span>
                  </div>
                  <p className="text-lg font-black text-slate-900">{data.hours}h</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risks & Assumptions Quick List */}
          <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
             <h3 className="text-xs font-black text-rose-600 mb-4 uppercase tracking-widest">Top Risks</h3>
             <ul className="space-y-3">
               {estimate.technicalRisks.slice(0, 3).map((risk, idx) => (
                 <li key={idx} className="flex gap-2 text-xs font-bold text-rose-900">
                   <span className="text-rose-400 opacity-50">•</span>
                   {risk}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
