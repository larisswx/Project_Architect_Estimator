
import React, { useState, useMemo } from 'react';
import { ProjectEstimate } from '../types';

interface ProjectDashboardProps {
  projects: ProjectEstimate[];
  onViewProject: (project: ProjectEstimate) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projects, onViewProject, onDeleteProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfidence, setFilterConfidence] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'hours' | 'name'>('date');

  const stats = useMemo(() => {
    const totalHours = projects.reduce((acc, p) => acc + p.totalHours, 0);
    const avgConfidence = projects.length > 0 
      ? (projects.filter(p => p.confidenceLevel === 'High').length / projects.length * 100).toFixed(0)
      : 0;
    return { totalHours, avgConfidence, count: projects.length };
  }, [projects]);

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesConfidence = filterConfidence === 'All' || p.confidenceLevel === filterConfidence;
        return matchesSearch && matchesConfidence;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'hours') return b.totalHours - a.totalHours;
        return a.projectName.localeCompare(b.projectName);
      });
  }, [projects, searchTerm, filterConfidence, sortBy]);

  const getConfidenceBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-rose-100 text-rose-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase">Portfolio Projects</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats.count}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Estimated Effort</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalHours.toLocaleString()}h</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 uppercase">High Confidence Rate</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.avgConfidence}%</p>
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
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={filterConfidence}
            onChange={(e) => setFilterConfidence(e.target.value)}
          >
            <option value="All">All Confidence</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>
          <select 
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complexity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Hours</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedProjects.length > 0 ? (
                filteredAndSortedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{project.projectName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(project.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{project.complexity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getConfidenceBadge(project.confidenceLevel)}`}>
                        {project.confidenceLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">
                      {project.totalHours}h
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => onViewProject(project)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        View Report
                      </button>
                      <button 
                        onClick={() => onDeleteProject(project.id)}
                        className="text-slate-300 hover:text-rose-600 text-sm transition-colors"
                      >
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No projects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
