
import React, { useState, useEffect } from 'react';
import { Resource } from '../types';

const INITIAL_RESOURCES: Resource[] = [
  { id: '1', name: 'Alpha Project', description: 'Initial backend infrastructure', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Beta API', description: 'User authentication service', status: 'inactive', createdAt: new Date().toISOString() },
];

const SERVER_CODE = `// server.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

let db: Resource[] = []; // In-memory DB simulation

// 1. Create
app.post('/resources', (req: Request, res: Response) => {
  const resource: Resource = { id: uuidv4(), ...req.body };
  db.push(resource);
  res.status(201).json(resource);
});

// 2. List with filters
app.get('/resources', (req: Request, res: Response) => {
  const { status } = req.query;
  let results = db;
  if (status) results = db.filter(r => r.status === status);
  res.json(results);
});

// 3. Get Details
app.get('/resources/:id', (req: Request, res: Response) => {
  const resource = db.find(r => r.id === req.params.id);
  resource ? res.json(resource) : res.status(404).send('Not Found');
});

// 4. Update
app.put('/resources/:id', (req: Request, res: Response) => {
  const index = db.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  db[index] = { ...db[index], ...req.body };
  res.json(db[index]);
});

// 5. Delete
app.delete('/resources/:id', (req: Request, res: Response) => {
  db = db.filter(r => r.id !== req.params.id);
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));`;

const README_CONTENT = `# A Crude Server
## Configuration
1. Install dependencies: \`npm install express uuid typescript @types/express @types/node\`
2. Initialize TS: \`npx tsc --init\`
3. Run: \`npx ts-node server.ts\`

## Endpoints
- POST /resources : Create
- GET /resources : List (supports ?status=)
- GET /resources/:id : Read
- PUT /resources/:id : Update
- DELETE /resources/:id : Delete`;

const CrudeServerTab: React.FC = () => {
  const [view, setView] = useState<'demo' | 'code' | 'readme'>('demo');
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [filter, setFilter] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Simulated Form State
  // Fix: Explicitly type the form state to allow the 'inactive' status which was previously prohibited by 'as const' inference.
  const [form, setForm] = useState<{
    name: string;
    description: string;
    status: Resource['status'];
  }>({ name: '', description: '', status: 'active' });

  const filteredResources = resources.filter(r => filter === 'all' || r.status === filter);

  const handleCreate = () => {
    const newRes: Resource = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      createdAt: new Date().toISOString()
    };
    setResources([...resources, newRes]);
    setIsAdding(false);
    resetForm();
  };

  const handleUpdate = () => {
    setResources(resources.map(r => r.id === editingId ? { ...r, ...form } : r));
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const resetForm = () => setForm({ name: '', description: '', status: 'active' });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {(['demo', 'code', 'readme'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`pb-2 px-4 capitalize transition-all ${view === v ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {v === 'demo' ? 'Live Demo' : v}
          </button>
        ))}
      </div>

      {view === 'demo' && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {['all', 'active', 'inactive'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              + Create Resource
            </button>
          </div>

          {(isAdding || editingId) && (
            <div className="mb-8 p-4 bg-slate-900 rounded-xl border border-slate-700 animate-in zoom-in-95 duration-200">
              <h4 className="text-white font-bold mb-4">{editingId ? 'Update' : 'Create'} Resource</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Resource Name"
                  className="bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                  className="bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as any })}
                  className="bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredResources.map(res => (
                  <tr key={res.id} className="group hover:bg-slate-700/20 transition-all">
                    <td className="py-4 pl-2 font-medium text-white">{res.name}</td>
                    <td className="py-4 text-slate-400">{res.description}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${res.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() => { setEditingId(res.id); setForm({ name: res.name, description: res.description, status: res.status }); }}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'code' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 overflow-hidden">
          <pre className="code-font text-sm text-slate-300 overflow-x-auto leading-relaxed">
            <code>{SERVER_CODE}</code>
          </pre>
        </div>
      )}

      {view === 'readme' && (
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700 p-8 prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
            {README_CONTENT}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudeServerTab;
