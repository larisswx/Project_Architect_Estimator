
import React, { useState, useRef } from 'react';
import { ProjectInputs, Attachment } from '../types';
import { Button } from './Button';

interface ProjectInputProps {
  onSubmit: (inputs: ProjectInputs) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for enterprise diagrams
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export const ProjectInput: React.FC<ProjectInputProps> = ({ onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [inputs, setInputs] = useState<ProjectInputs>({
    projectName: '',
    description: '',
    techStack: '',
    teamSize: '1 SC + 1 Tech',
    complexity: 'Moderate',
    clientMaturity: 'Média',
    externalDependency: 'Baixa',
    constraints: '',
    deepThinking: true,
    attachment: null
  });

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      const errorMsg = `Unsupported file type: "${file.type}". Allowed: JPG, PNG, WEBP, PDF.`;
      console.error(`[ArchitectEstimator] Validation Error: ${errorMsg}`, {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        fileType: file.type
      });
      return errorMsg;
    }
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed is 5MB.`;
      console.error(`[ArchitectEstimator] Validation Error: ${errorMsg}`, {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
      return errorMsg;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    console.debug('[ArchitectEstimator] Processing valid attachment:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    const reader = new FileReader();
    
    reader.onerror = (err) => {
      const errorMsg = 'Critical Error: Failed to read the selected file. The file might be corrupted or locked.';
      console.error('[ArchitectEstimator] FileReader Critical Error:', err);
      setFileError(errorMsg);
    };

    reader.onloadend = () => {
      try {
        const result = reader.result as string;
        if (!result) throw new Error("File reader result is empty");
        
        const base64String = result.split(',')[1];
        setInputs(prev => ({
          ...prev,
          attachment: {
            data: base64String,
            mimeType: file.type,
            fileName: file.name
          }
        }));
        console.info('[ArchitectEstimator] Attachment encoded and ready for AI analysis.');
      } catch (err) {
        console.error('[ArchitectEstimator] Base64 Encoding Error:', err);
        setFileError('Processing Error: Could not prepare file for AI analysis.');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setInputs(prev => ({ ...prev, attachment: null }));
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    console.debug('[ArchitectEstimator] Attachment cleared.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.projectName.trim() || !inputs.description.trim()) {
      console.warn('[ArchitectEstimator] Submit Blocked: Missing mandatory fields.');
      return;
    }
    onSubmit(inputs);
  };

  const isForcedDeepThinking = inputs.complexity === 'Enterprise-Scale' || !!inputs.attachment;

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
        <label className="text-sm font-bold text-slate-700">Anexar Diagrama BPMN / Processo (Imagem ou PDF)</label>
        <div 
          className={`group border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer ${
            inputs.attachment 
              ? 'border-blue-500 bg-blue-50' 
              : fileError 
                ? 'border-rose-400 bg-rose-50' 
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
          />
          
          {inputs.attachment ? (
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white shrink-0 shadow-lg">
                {inputs.attachment.mimeType.includes('pdf') ? 'PDF' : 'IMG'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{inputs.attachment.fileName}</p>
                <p className="text-xs text-slate-500">Arquivo verificado e pronto para análise</p>
              </div>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeAttachment(); }}
                className="p-2 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                title="Remover anexo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <svg className={`w-12 h-12 mx-auto mb-3 transition-colors ${fileError ? 'text-rose-500' : 'text-slate-400 group-hover:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              {fileError ? (
                <div className="space-y-1">
                  <p className="text-sm font-black text-rose-600">Erro no Anexo</p>
                  <p className="text-xs font-bold text-rose-500 bg-rose-100/50 px-3 py-1 rounded-full">{fileError}</p>
                  <p className="text-[10px] text-rose-400 mt-2">Clique para tentar novamente</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-700">Clique ou arraste o diagrama do processo</p>
                  <p className="text-xs text-slate-500 mt-1">Formatos aceitos: JPG, PNG, WEBP e PDF (Limite: 5MB)</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Descrição Complementar do Processo</label>
        <textarea
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Descreva o fluxo principal e integrações desejadas que não estão no diagrama..."
          value={inputs.description}
          onChange={e => setInputs(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${isForcedDeepThinking ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isForcedDeepThinking ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">Análise Profunda (Reasoning Mode)</p>
              {isForcedDeepThinking && (
                <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded shadow-sm">
                  Ativado Automático
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isForcedDeepThinking 
                ? "Obrigatório para projetos Enterprise ou com anexos." 
                : "Utiliza o orçamento máximo de pensamento para estimativas complexas."}
            </p>
          </div>
        </div>
        <label className={`relative inline-flex items-center ${isForcedDeepThinking ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isForcedDeepThinking || inputs.deepThinking}
            disabled={isForcedDeepThinking}
            onChange={e => setInputs(prev => ({ ...prev, deepThinking: e.target.checked }))}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          variant="secondary" 
          isLoading={isLoading} 
          className="w-full h-12 text-base font-black uppercase tracking-wider"
        >
          { (isForcedDeepThinking || inputs.deepThinking) ? "Processar com Análise Profunda" : "Calcular Estimativa Técnica"}
        </Button>
      </div>
    </form>
  );
};
