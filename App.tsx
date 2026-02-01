
import React, { useState, useEffect } from 'react';
import { ProjectInput } from './components/ProjectInput';
import { EstimateView } from './components/EstimateView';
import { ProjectDashboard } from './components/ProjectDashboard';
import { ProjectInputs, ProjectEstimate } from './types';
import { generateProjectEstimate } from './services/geminiService';

type View = 'dashboard' | 'input' | 'result';

const STORAGE_KEY = 'enterprise_estimates_v1';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [projects, setProjects] = useState<ProjectEstimate[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleGenerate = async (inputs: ProjectInputs) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateProjectEstimate(inputs);
      
      const enrichedEstimate: ProjectEstimate = {
        ...result,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        complexity: inputs.complexity
      };

      setProjects(prev => [enrichedEstimate, ...prev]);
      setEstimate(enrichedEstimate);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please check your API configuration.');
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
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

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
              onClick={() => { setEstimate(null); setView('input'); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${view === 'input' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              + New Estimate
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {view === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Project Portfolio</h2>
              <p className="text-slate-600">Overview of all software estimations generated for enterprise clients.</p>
            </div>
            <ProjectDashboard 
              projects={projects} 
              onViewProject={handleViewProject} 
              onDeleteProject={handleDeleteProject}
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

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-xl mt-8 flex items-center gap-4">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
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
