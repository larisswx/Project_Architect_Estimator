
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
    teamSize: '1 SC + 1 Tech',
    complexity: 'Moderate',
    clientMaturity: 'Média',
    externalDependency: 'Baixa',
    constraints: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nome do Projeto</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Ex: Automação Procurement v2"
            value={inputs.projectName}
            onChange={e => setInputs(prev => ({ ...prev, projectName: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Complexidade Geral</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={inputs.complexity}
            onChange={e => setInputs(prev => ({ ...prev, complexity: e.target.value as any }))}
          >
            <option value="Simple">Simples</option>
            <option value="Moderate">Moderada</option>
            <option value="Complex">Complexa</option>
            <option value="Enterprise-Scale">Enterprise (Escala Global)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Maturidade do Cliente</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={inputs.clientMaturity}
            onChange={e => setInputs(prev => ({ ...prev, clientMaturity: e.target.value as any }))}
          >
            <option value="Alta">Alta (Processos Claros)</option>
            <option value="Média">Média (Silos Internos)</option>
            <option value="Baixa">Baixa (Definição em Fluxo)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Dependência Externa (TI/ERP)</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={inputs.externalDependency}
            onChange={e => setInputs(prev => ({ ...prev, externalDependency: e.target.value as any }))}
          >
            <option value="Baixa">Baixa (Independente)</option>
            <option value="Média">Média (Requer Token/Acesso)</option>
            <option value="Alta">Alta (Depende de Dev Externo)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Descrição do Processo</label>
        <textarea
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Descreva o fluxo principal e integrações desejadas..."
          value={inputs.description}
          onChange={e => setInputs(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          variant="secondary" 
          isLoading={isLoading} 
          className="w-full"
        >
          Calcular Estimativa Técnica
        </Button>
      </div>
    </form>
  );
};
