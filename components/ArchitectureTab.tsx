
import React from 'react';

const ArchitectureTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Documentation */}
        <div className="space-y-8">
          <section className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              README.md
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
              <h3 className="text-xl font-semibold text-blue-300">Module: Real-time Score Verification Service</h3>
              <p>
                This module handles secure score updates and real-time synchronization for the top 10 global leaderboard.
              </p>
              
              <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mt-6">Functional Requirements</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Handle authenticated score increment requests via <code>POST /api/v1/score/update</code>.</li>
                <li>Maintain a high-performance "Top 10" cache for the scoreboard.</li>
                <li>Broadcast leaderboard updates to connected clients using WebSockets.</li>
              </ul>

              <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mt-6">Security Implementation</h4>
              <p>
                To prevent malicious spoofing:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>JWT Authentication:</strong> Every request must include a valid bearer token.</li>
                <li><strong>Action Verification Tokens (AVT):</strong> Actions generate a short-lived, single-use nonce on the server before the action is performed. The client must return this AVT during the update call.</li>
                <li><strong>Rate Limiting:</strong> Enforce a cooldown period between score updates per User ID.</li>
              </ul>
            </div>
          </section>

          <section className="bg-slate-800/20 border border-slate-700/50 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Improvement Suggestions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <h4 className="text-blue-400 font-bold text-sm mb-1">1. Redis Sorted Sets</h4>
                <p className="text-slate-400 text-sm">Use Redis <code>ZINCRBY</code> and <code>ZREVRANGE</code> for the leaderboard. It provides O(log(N)) performance even with millions of users, ensuring the "Top 10" query is near-instant.</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <h4 className="text-blue-400 font-bold text-sm mb-1">2. Eventual Consistency for DB</h4>
                <p className="text-slate-400 text-sm">Process score updates in Redis first for speed, then asynchronously batch-sync to the primary SQL database to reduce write heavy load.</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                <h4 className="text-blue-400 font-bold text-sm mb-1">3. Throttling Broadcasts</h4>
                <p className="text-slate-400 text-sm">Instead of pushing on every single update, debounce the WebSocket broadcast to once every 500ms-1s to avoid overwhelming clients during peak activity.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Execution Diagram */}
        <div className="flex flex-col h-full">
          <section className="bg-slate-900 border border-slate-700 p-8 rounded-3xl flex-grow flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Execution Flow Diagram
            </h2>
            
            <div className="relative flex-grow flex items-center justify-center p-4">
              <svg viewBox="0 0 400 600" className="w-full max-w-md h-auto">
                {/* Entities */}
                <rect x="140" y="20" width="120" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="200" y="52" textAnchor="middle" fill="#fff" className="text-sm font-bold">CLIENT (User)</text>

                <rect x="140" y="150" width="120" height="50" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                <text x="200" y="182" textAnchor="middle" fill="#fff" className="text-sm font-bold">API SERVER</text>

                <rect x="260" y="280" width="100" height="50" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <text x="310" y="312" textAnchor="middle" fill="#fff" className="text-xs font-bold">REDIS (Cache)</text>

                <rect x="40" y="280" width="100" height="50" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                <text x="90" y="312" textAnchor="middle" fill="#fff" className="text-xs font-bold">AUTH SERVICE</text>

                <rect x="140" y="450" width="120" height="50" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                <text x="200" y="482" textAnchor="middle" fill="#fff" className="text-sm font-bold">WS BROKER</text>

                {/* Flow Lines */}
                <line x1="200" y1="70" x2="200" y2="150" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="210" y="110" fill="#94a3b8" className="text-[10px]">1. Update Request (JWT+Action)</text>

                <path d="M140 175 H 90 V 280" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="45" y="220" fill="#94a3b8" className="text-[10px]">2. Verify Identity</text>

                <path d="M140 175 H 90 V 280" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="45" y="220" fill="#94a3b8" className="text-[10px]">2. Verify Identity</text>

                <path d="M260 175 H 310 V 280" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="280" y="220" fill="#94a3b8" className="text-[10px]">3. Increment Score</text>

                <line x1="310" y1="330" x2="200" y2="450" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="270" y="400" fill="#94a3b8" className="text-[10px]">4. Notify Top 10 Change</text>

                {/* Fix: Merged the malformed path command back into the d attribute string */}
                <path d="M140 475 H 20 V 45 H 140" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow)" />
                <text x="30" y="400" fill="#3b82f6" className="text-[10px] transform -rotate-90">5. Real-time Push</text>

                {/* Arrows */}
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                  </marker>
                </defs>
              </svg>
            </div>

            <p className="text-slate-500 text-xs text-center mt-4 italic">
              * The dashed line represents the asynchronous WebSocket feedback loop to all connected users.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureTab;
