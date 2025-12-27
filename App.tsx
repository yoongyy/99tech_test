
import React, { useState, useMemo } from 'react';
import { AlgorithmInfo, TabType } from './types';
import AlgorithmCard from './components/AlgorithmCard';
import CrudeServerTab from './components/CrudeServerTab';
import ArchitectureTab from './components/ArchitectureTab';

// --- Sum to N Implementations ---
const sumAlgos: AlgorithmInfo[] = [
  {
    id: 'sum-a',
    name: 'Iterative (For Loop)',
    description: 'A robust linear scan through all integers.',
    complexityTime: 'O(n)',
    complexitySpace: 'O(1)',
    code: `function sum_to_n(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
}`,
    implementation: (n) => {
      let s = 0; for (let i = 1; i <= n; i++) s += i; return s;
    }
  },
  {
    id: 'sum-b',
    name: 'Mathematical (Gauss)',
    description: 'Direct arithmetic series formula.',
    complexityTime: 'O(1)',
    complexitySpace: 'O(1)',
    code: `function sum_to_n(n) {
  return (n * (n + 1)) / 2;
}`,
    implementation: (n) => (n * (n + 1)) / 2
  },
  {
    id: 'sum-c',
    name: 'Functional (Reduce)',
    description: 'Declarative approach using Array.from.',
    complexityTime: 'O(n)',
    complexitySpace: 'O(n)',
    code: `function sum_to_n(n) {
  return Array.from({ length: n }, (_, i) => i + 1)
    .reduce((a, b) => a + b, 0);
}`,
    implementation: (n) => n <= 0 ? 0 : Array.from({ length: Math.min(n, 100000) }, (_, i) => i + 1).reduce((a, b) => a + b, 0)
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('sum');
  const [n, setN] = useState<number>(10);

  const currentAlgos = useMemo(() => {
    switch (activeTab) {
      case 'sum': return sumAlgos;
      default: return [];
    }
  }, [activeTab]);

  const tabTitle = useMemo(() => {
    switch (activeTab) {
      case 'server': return 'A Crude Server';
      case 'architecture': return 'Software Architecture';
      default: return 'Three ways to sum to N';
    }
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setN(isNaN(val) ? 0 : val);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <nav className="flex justify-center mb-12">
        <div className="bg-slate-800/50 p-1 rounded-2xl border border-slate-700 backdrop-blur-md flex gap-1">
          {(['sum', 'server', 'architecture'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {tab === 'sum' ? 'Sum to N' : tab === 'server' ? 'Crude Server' : 'Architecture'}
            </button>
          ))}
        </div>
      </nav>

      <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          {tabTitle}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {activeTab === 'server' 
            ? 'An end-to-end TypeScript/ExpressJS CRUD interface demonstration.'
            : activeTab === 'architecture'
            ? 'Strategic module design for high-performance, real-time backend systems.'
            : 'Exploring algorithmic efficiency and implementation patterns.'}
        </p>
      </header>

      {activeTab === 'sum' && (
        <>
          <section className="max-w-md mx-auto mb-12">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-xl shadow-black/50">
              <label htmlFor="n-input" className="block text-sm font-medium text-slate-400 mb-2">
                Target Integer (n)
              </label>
              <div className="relative">
                <input
                  id="n-input"
                  type="number"
                  value={n}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="Enter n..."
                  min="0"
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentAlgos.map((algo) => (
              <AlgorithmCard key={algo.id} algo={algo} n={n} />
            ))}
          </section>
        </>
      )}

      {activeTab === 'server' && <CrudeServerTab />}
      {activeTab === 'architecture' && <ArchitectureTab />}

      <footer className="mt-20 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p className="mb-2">
          <a
            href="https://github.com/yoongyy/99tech_test"
            className="text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
          >
            https://github.com/yoongyy/99tech_test
          </a>
        </p>
        <p>@2025 Kenny.Yew</p>
      </footer>
    </div>
  );
};

export default App;
