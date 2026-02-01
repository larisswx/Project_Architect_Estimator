
import React, { useState, useEffect } from 'react';
import { ProjectInput } from './components/ProjectInput';
import { EstimateView } from './components/EstimateView';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectComparison } from './components/ProjectComparison';
import { ProjectInputs, ProjectEstimate } from './types';
import { generateProjectEstimate } from './services/geminiService';

type View = 'dashboard' | 'input' | 'result' | 'compare';

const STORAGE_KEY = 'enterprise_estimates_v1';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [projects, setProjects] = useState<ProjectEstimate[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("[ArchitectEstimator] LocalStorage Load Error:", e);
      }
    }
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("[ArchitectEstimator] LocalStorage Save Error:", e);
    }
  }, [projects]);

  const handleGenerate = async (inputs: ProjectInputs) => {
    console.info(`[ArchitectEstimator] Starting estimation for: ${inputs.projectName}`);
    setLoading(true);
    setError(null);
    try {
      const result = await generateProjectEstimate(inputs);
      
      if (!result || !result.projectName) {
        throw new Error("Invalid response received from the Architecture AI. Please try again.");
      }

      const enrichedEstimate: ProjectEstimate = {
        ...result,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        complexity: inputs.complexity,
        clientMaturity: inputs.clientMaturity,
        externalDependency: inputs.externalDependency
      };

      setProjects(prev => [enrichedEstimate, ...prev]);
      setEstimate(enrichedEstimate);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.info("[ArchitectEstimator] Generation complete.");
    } catch (err: any) {
      console.error("[ArchitectEstimator] AI Generation Failure:", err);
      
      let userFriendlyMessage = 'An unexpected error occurred. Please check your API configuration.';
      
      if (err.message?.includes('API key')) {
        userFriendlyMessage = 'Architectural Engine API Key is invalid or missing.';
      } else if (err.message?.includes('thinkingBudget')) {
        userFriendlyMessage = 'Thinking Budget exceeded model limits. Try reducing complexity.';
      } else if (err.message?.includes('JSON')) {
        userFriendlyMessage = 'The AI returned a malformed estimation. This sometimes happens with highly complex diagrams. Please try re-submitting.';
      } else if (err.status === 429) {
        userFriendlyMessage = 'Rate limit exceeded. Please wait a few seconds before trying again.';
      }

      setError(`${userFriendlyMessage} (Debug: ${err.message || 'Unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (p: ProjectEstimate) => {
    setEstimate(p);
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      console.debug(`[ArchitectEstimator] Deleting project: ${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      setSelectedProjectIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProjectIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedProjectIds.length < 2) {
      console.warn("[ArchitectEstimator] Comparison requires at least 2 selected projects.");
      return;
    }
    setView('compare');
  };

  const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Enterprise Architect</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Project Estimator Tool</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Portfolio Dashboard
            </button>
            <button 
              onClick={() => { setEstimate(null); setError(null); setView('input'); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'input' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              + New Estimate
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Project Portfolio</h2>
                <p className="text-slate-600">Overview of all software estimations generated for enterprise clients.</p>
              </div>
              {selectedProjectIds.length > 1 && (
                <button
                  onClick={handleCompare}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  Compare {selectedProjectIds.length} Estimates
                </button>
              )}
            </div>
            <ProjectDashboard 
              projects={projects} 
              onViewProject={handleViewProject} 
              onDeleteProject={handleDeleteProject}
              selectedProjectIds={selectedProjectIds}
              onToggleSelect={handleToggleSelect}
            />
          </div>
        )}

        {view === 'input' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">New Architecture Estimate</h2>
              <p className="text-slate-600">Define the project scope to generate a realistic enterprise-grade timeline.</p>
            </div>
            <ProjectInput onSubmit={handleGenerate} isLoading={loading} />
          </div>
        )}

        {view === 'result' && estimate && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8 no-print">
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Portfolio
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Report Ref: {estimate.id.slice(0, 8)}</span>
              </div>
            </div>
            <EstimateView estimate={estimate} />
          </div>
        )}

        {view === 'compare' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8 no-print">
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Portfolio
              </button>
              <h2 className="text-2xl font-bold text-slate-900">Estimate Comparison</h2>
            </div>
            <ProjectComparison projects={selectedProjects} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Solutions Architecture Group. Enterprise Grade Estimations.</p>
        </div>
      </footer>

      {/* CSS for print mode */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .bg-slate-50 { background: white !important; }
          .shadow-sm { box-shadow: none !important; }
          .border { border-color: #e2e8f0 !important; }
          main { padding-top: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
