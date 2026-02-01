
import React, { useState } from 'react';
import { ProjectInputs } from '../types';
import { Button } from './Button';

interface ProjectInputProps {
  onSubmit: (inputs: ProjectInputs) => void;
  isLoading: boolean;
}

export const ProjectInput: React.FC<ProjectInputProps> = ({ onSubmit, isLoading }) => {
  const [inputs, setInputs] = useState<ProjectInputs>({
    projectName: '',
    description: '',
    techStack: '',
    teamSize: '4-6 engineers',
    complexity: 'Moderate',
    constraints: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Project Name</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. Next-Gen Supply Chain Dashboard"
            value={inputs.projectName}
            onChange={e => setInputs(prev => ({ ...prev, projectName: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Complexity</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={inputs.complexity}
            onChange={e => setInputs(prev => ({ ...prev, complexity: e.target.value as any }))}
          >
            <option value="Simple">Simple (Internal Tool / Prototype)</option>
            <option value="Moderate">Moderate (Standard Web App)</option>
            <option value="Complex">Complex (Distributed Systems / Heavy Logic)</option>
            <option value="Enterprise-Scale">Enterprise-Scale (Multi-Region / High Compliance)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Detailed Description</label>
        <textarea
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Describe the core features, objectives, and problem space..."
          value={inputs.description}
          onChange={e => setInputs(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Technology Stack</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. React, Node.js, AWS, Postgres, Kubernetes"
            value={inputs.techStack}
            onChange={e => setInputs(prev => ({ ...prev, techStack: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Target Team Size</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="e.g. 2 backend, 2 frontend, 1 DevOps"
            value={inputs.teamSize}
            onChange={e => setInputs(prev => ({ ...prev, teamSize: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Specific Constraints or Compliance</label>
        <textarea
          rows={2}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="e.g. SOC2, GDPR, strict deadline of 6 months, integration with legacy ERP..."
          value={inputs.constraints}
          onChange={e => setInputs(prev => ({ ...prev, constraints: e.target.value }))}
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          variant="secondary" 
          isLoading={isLoading} 
          className="w-full md:w-auto"
        >
          Generate Architecture Estimate
        </Button>
      </div>
    </form>
  );
};
