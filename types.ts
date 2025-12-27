
export type TabType = 'sum' | 'server' | 'architecture';

export interface AlgorithmInfo {
  id: string;
  name: string;
  description: string;
  complexityTime: string;
  complexitySpace: string;
  code: string;
  implementation: (n: number) => number;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
