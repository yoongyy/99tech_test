
import React from 'react';
import { AlgorithmInfo } from '../types';

interface AlgorithmCardProps {
  algo: AlgorithmInfo;
  n: number;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algo, n }) => {
  const result = algo.implementation(n);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{algo.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{algo.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded border border-blue-500/20">
            Time: {algo.complexityTime}
          </span>
          <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-mono rounded border border-purple-500/20">
            Space: {algo.complexitySpace}
          </span>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto border border-slate-800">
        <pre className="code-font text-sm text-slate-300">
          <code>{algo.code}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <span className="text-slate-400 text-sm">Output (n={n}):</span>
        <span className="text-xl font-bold text-emerald-400 tabular-nums">
          {isNaN(result) ? "Error" : result.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default AlgorithmCard;
