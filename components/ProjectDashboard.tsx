
import React, { useState, useMemo } from 'react';
import { ProjectEstimate } from '../types';

interface ProjectDashboardProps {
  projects: ProjectEstimate[];
  onViewProject: (project: ProjectEstimate) => void;
  onDeleteProject: (id: string) => void;
  selectedProjectIds: string[];
  onToggleSelect: (id: string) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  projects, 
  onViewProject, 
  onDeleteProject,
  selectedProjectIds,
  onToggleSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfidence, setFilterConfidence] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'hours' | 'name'>('date');

  const metrics = useMemo(() => {
    if (projects.length === 0) return { avgHours: 0, total: 0, highConfidence: 0, enterpriseCount: 0 };
    
    const avgHours = projects.reduce((acc, p) => acc + p.totalHours, 0) / projects.length;
    const highConfidence = (projects.filter(p => p.confidenceLevel.toLowerCase() === 'alta').length / projects.length) * 100;
    const enterpriseCount = projects.filter(p => p.complexity.includes('Enterprise')).length;
    
    return {
      avgHours: avgHours.toFixed(1),
      total: projects.length,
      highConfidence: highConfidence.toFixed(0),
      enterpriseCount
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesConfidence = filterConfidence === 'All' || p.confidenceLevel.toLowerCase() === filterConfidence.toLowerCase();
        return matchesSearch && matchesConfidence;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'hours') return b.totalHours - a.totalHours;
        return a.projectName.localeCompare(b.projectName);
      });
  }, [projects, searchTerm, filterConfidence, sortBy]);

  return (
    <div className="space-y-8">
      {/* Metric Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Estimates</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{metrics.total}</p>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">📊</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Project Hours</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{metrics.avgHours}h</p>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">⏱️</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">High Confidence Rate</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{metrics.highConfidence}%</p>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">🎯</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enterprise Projects</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900">{metrics.enterpriseCount}</p>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">🏢</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            value={filterConfidence}
            onChange={(e) => setFilterConfidence(e.target.value)}
          >
            <option value="All">Confidence: All</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date">Latest First</option>
            <option value="hours">Effort (High to Low)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 w-12 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project & Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Scope</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Estimate</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProjectIds.includes(p.id)}
                      onChange={() => onToggleSelect(p.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{p.projectName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">{p.complexity}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                        p.confidenceLevel.toLowerCase() === 'alta' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>{p.confidenceLevel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xl font-black text-slate-900">{p.totalHours}h</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Effort Score</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => onViewProject(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => onDeleteProject(p.id)} className="p-2 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium italic">Nenhuma estimativa encontrada no portfólio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
